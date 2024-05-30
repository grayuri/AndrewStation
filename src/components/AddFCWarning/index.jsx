import Link from "next/link";
import Image from "next/image";
import Title from "../Title";
import './styles.scss'

export default function AddFCWarning() {
  return (
    <main className="add-fc-warning">
      <div className="image-container">
        <Image 
          src="/images/select-fc-warning.svg"
          alt="Select FC Image"
          priority
          fill
        />
      </div>
      <Title>Você Ainda <span className="highlight">Não Adicionou</span> Um FC</Title>
      <p>Para que possamos inserir e manusear os dados, precisamos registrar um FC.</p>
      <p>Tendo isso em mente, <Link href="/fc-warehouse">Adicione um FC</Link> no seu registro.</p>
    </main>
  )
}
