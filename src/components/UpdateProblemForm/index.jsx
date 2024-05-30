"use client"

import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import './styles.scss';

export default function UpdateProblemForm({ 
  problem, updateProblem, nameInputRef, statusInputRef
}) {
  const router = useRouter()

  return (
    <div className='update-problem-form-container'>
      <div className="top">
        <CloseIcon 
          className='close-icon' 
          onClick={() => router.back()}
        />
      </div>
      <h3>Editar Problema</h3>
      <form onSubmit={(e) => updateProblem(e)}>
        <label htmlFor="name">
          <span>Nome</span>
          <input 
            ref={nameInputRef}
            name='name' 
            type="text" 
            defaultValue={problem?.name} 
          />
        </label>
        <label htmlFor="resolved">
          <span>Status</span>
          <select 
            ref={statusInputRef}
            name="resolved" 
            id="status"
            defaultValue={problem?.resolved}
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
