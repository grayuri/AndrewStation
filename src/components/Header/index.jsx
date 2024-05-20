import Link from "next/link"
import Image from "next/image"
import './styles.scss'

export default function Header() {
  return (
    <header>
      <Link href="/">
        <div className="logo">
          <Image 
            src="/images/logo.png"
            width={240.75}
            height={54}
            alt="Andrew Station Logo"
            priority
          />
        </div>
      </Link>
    </header>
  )
}
