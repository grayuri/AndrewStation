"use client"

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import './styles.scss'

export default function GenericErrorPage({ title, message, statusCode, reset }) {
  const pathname = usePathname()

  function resetPage() {
    if (pathname === "/") reset()
  }

  return (
    <main className="error-page">
      <Image 
        src="/images/error-page-image.svg"
        width={913 / 3}
        height={898 / 3}
        alt="Error Page Image"
      />
      <h2>{ title } - Erro { statusCode }</h2>
      <h3>{ message }</h3>
      <p>Volte para a <Link href="/" onClick={resetPage}>página inicial</Link> do Andrew para você poder utilizá-lo.</p>
    </main>
  )
}
