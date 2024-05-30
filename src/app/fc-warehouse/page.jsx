"use client"

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CheckIcon from '@mui/icons-material/Check';
import { useFCContext } from "@/contexts/FCContext"
import haveNotEmptyStrings from "@/utils/haveNotEmptyStrings";
import './FCWarehousePage.scss';

export default function FCWarehousePage() {
  const { fc, writeFc } = useFCContext()
  const inputFcNameRef = useRef()
  const router = useRouter()
  
  function storageFc(e) {
    e.preventDefault()
    
    const fcName = inputFcNameRef.current.value.toUpperCase()
    const notEmpty = haveNotEmptyStrings(fcName)

    if (!notEmpty) return // toast

    localStorage.setItem("fc", JSON.stringify(fcName))
    writeFc(fcName)
    router.push("/")
  }

  return (
    <div className="fc-warehouse-page"> 
      <div className="top">
        <h3>Insira o nome do seu FC</h3>
        <p>Com essa informação adicionada, você conseguirá visualizar as linhas, estações e problemas presentes no seu FC. Insira-o abaixo para poder visualizar os dados.</p>
        <p>Caso você já o tenha adicionado, volte para a <Link href="/">página principal</Link>.</p>
      </div>

      <form onSubmit={storageFc}>
        <label htmlFor="fc-name">
          <span>Nome do FC</span>
          <input 
            ref={inputFcNameRef}
            defaultValue={fc ? fc : ""} 
            type="text" 
          />
        </label>
        <button>
          <CheckIcon className="save-icon" />
          <span>Salvar</span>
        </button>
      </form>
    </div>
  )
}
