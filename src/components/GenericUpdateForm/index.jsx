"use client"

import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import './styles.scss';

export default function GenericUpdateForm({ item, type, updateItem, closeModal }) {
  const [updatedItemName, setUpdatedItemName] = useState()

  const itemName = type === "line" ? "Linha" : "Estação"

  return (
    <div className='update-item-form-container'>
      <div className="top">
        <CloseIcon 
          className='close-icon' 
          onClick={closeModal}
        />
      </div>
      <h3>Editar {itemName}</h3>
      <form onSubmit={(e) => updateItem(e, updatedItemName)}>
        <label htmlFor="name">
          <span>Nome</span>
          <input 
            type="text" 
            defaultValue={item?.name} 
            name='name' 
            onChange={(e) => setUpdatedItemName(e.target.value)}
          />
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
