"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import './styles.scss';

export default function UpdateProblemForm({ problem, updateProblem }) {
  const [updatedProblem, setUpdatedProblem] = useState()

  const router = useRouter()

  function setSpecificProblemProperty(e) {
    const { name, value } = e.target

    setUpdatedProblem(currentProperties => ({
      ...currentProperties,
      [name]: name === "resolved" 
        ? (value === "true")
        : value
    }))
  }

  return (
    <div className='update-problem-form-container'>
      <div className="top">
        <CloseIcon 
          className='close-icon' 
          onClick={() => router.back()}
        />
      </div>
      <h3>Editar Problema</h3>
      <form onSubmit={(e) => updateProblem(e, updatedProblem)}>
        <label htmlFor="name">
          <span>Nome</span>
          <input 
            type="text" 
            defaultValue={problem?.name} 
            name='name' 
            onChange={setSpecificProblemProperty}
          />
        </label>
        <label htmlFor="resolved">
          <span>Status</span>
          <select 
            name="resolved" 
            id="status"
            defaultValue={problem?.resolved}
            onChange={setSpecificProblemProperty}
          >
            <option value="">Insira um Valor</option>
            <option value="false">Não Resolvido</option>
            <option value="true">Resolvido</option>
          </select>
        </label>
        <button>
          <CheckIcon className='save-icon' />
          <span>
            Salvar
          </span>
        </button>
      </form>
    </div>
  )
}
