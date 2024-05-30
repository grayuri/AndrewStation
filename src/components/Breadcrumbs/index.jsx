"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import './styles.scss'

export default function Breadcrumbs() {
  const pathname = usePathname()
  
  const breadcrumbLinks = pathname.split("/").map((path, index) => {
    let linkName = ""

    if (index === 0) {
      linkName = "Home"
      path = "/"
    }
    else if (index === 1) {
      linkName = "Linha"
      path = `/${path}`
    }
    else if (index === 2) {
      linkName = "Estação"
      path = `/${pathname[1]}/${path}`
    } 
    else if (index === 3) {
      linkName = "Problema"
      path = `/${pathname[1]}/${pathname[2]}/${path}`
    }

    return {
      name: linkName,
      href: path
    }
  })

  return (
    <div className="breadcrumbs">
      {
        breadcrumbLinks.map((link, index) => (
          <div className="link" key={index}>
            <Link 
              href={link.href}
              className={ index === breadcrumbLinks.length - 1 ? "actual-route" : "" }
            >
              {link.name}
            </Link>
            <span key={link.path + `${index}`} >
              { index === breadcrumbLinks.length - 1 ? "" : "/" }
            </span>
          </div>
        ))
      }
    </div>
  )
}
