import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import LangAttributeSetter from '@/components/LangAttributeSetter'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  }
}

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }]
}

export default async function LangLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const { lang } = await params
  return (
    <>
      <LangAttributeSetter lang={lang} />
      {children}
    </>
  )
}
