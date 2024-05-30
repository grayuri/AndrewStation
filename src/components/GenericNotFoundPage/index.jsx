import Image from "next/image";
import Link from "next/link";
import './styles.scss';

export default function GenericNotFoundPage({ title }) {
  return (
    <main className="not-found-page">
      <Image 
        src="/images/page-not-found-image.svg"
        width={913 / 3}
        height={898 / 3}
        priority
        alt="Page Not Found Image"
      />
      <h2>Erro 404</h2>
      <h3>{ title }</h3>
      <p>Volte para a <Link href="/">página inicial</Link> do Andrew para você poder utilizá-lo.</p>
    </main>
  )
}