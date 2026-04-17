import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const FROM_EMAIL     = 'reservas@personaldriveratl.com'
const FROM_NAME      = 'Johann Garcia Personal Driver'

serve(async (req) => {
  try {
    const body = await req.json()

    // El webhook de Supabase envía los datos en body.record
    const reserva = body.record

    // Solo actuar cuando el estado cambia a 'aceptada'
    if (reserva.estado !== 'aceptada') {
      return new Response(JSON.stringify({ message: 'No action needed' }), { status: 200 })
    }

    // Formatear fecha y hora
    const fecha = new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric',
    })

    const [h, m]  = reserva.hora.split(':').map(Number)
    const ampm    = h >= 12 ? 'PM' : 'AM'
    const hora    = `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`

    // HTML del correo
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirmación de Pre-Reserva</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

          <!-- Header -->
          <tr>
            <td style="background:#0A192F;padding:32px 40px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#C5A059;font-weight:700;">
                Johann Garcia Personal Driver LLC
              </p>
              <p style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff;">
                Pre-Reserva Confirmada
              </p>
            </td>
          </tr>

          <!-- Saludo -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0;font-size:15px;color:#334155;line-height:1.7;">
                Estimado/a <strong>${reserva.nombre}</strong>,
              </p>
              <p style="margin:12px 0 0;font-size:14px;color:#64748b;line-height:1.7;font-weight:300;">
                Nos complace confirmar que su pre-reserva ha sido <strong style="color:#10b981;">aceptada</strong>.
                A continuación encontrará el resumen de su traslado:
              </p>
            </td>
          </tr>

          <!-- Detalles -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;font-weight:700;">Origen</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#1e293b;font-weight:600;">${reserva.origen}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;font-weight:700;">Destino</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#1e293b;font-weight:600;">${reserva.destino}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;font-weight:700;">Fecha</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#1e293b;font-weight:600;">${fecha}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;font-weight:700;">Hora</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#1e293b;font-weight:600;">${hora}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Nota -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;font-weight:300;">
                En breve nos pondremos en contacto con usted al número
                <strong style="color:#1e293b;">${reserva.telefono}</strong> para coordinar los detalles finales.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7;">
                Johann Garcia Personal Driver LLC · Atlanta, GA & Metro Area<br/>
                Puntualidad · Seguridad · Discreción
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    // Enviar correo via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    `${FROM_NAME} <${FROM_EMAIL}>`,
        to:      [reserva.correo],
        subject: `✅ Pre-Reserva Confirmada — ${fecha} a las ${hora}`,
        html,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Resend error:', result)
      return new Response(JSON.stringify({ error: result }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), { status: 200 })

  } catch (err) {
    console.error('Function error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})