"use client"

import { useEffect, useState } from 'react'
import './styles.scss'


export default function PrintedProblems({ problems, confirmLoading }) {
  const [quantityOfProblems, setQuantityOfProblems] = useState()

  function getQuantityOfProblems() {
    let problemsUnresolved = 0
    let problemsResolved = 0

    problems.forEach(problem => {
      if (problem.resolved === false) problemsUnresolved++
      else problemsResolved++
    })

    setQuantityOfProblems({
      unresolved: problemsUnresolved,
      resolved: problemsResolved
    })
    
    confirmLoading()
  }

  useEffect(() => {
    getQuantityOfProblems()
  },[])

  return (
    <div className="printed-problems-container">
      {
        quantityOfProblems?.unresolved > 0 && (
          <ul className='problems-list'>
            <h3 className="status">Não Resolvidos:</h3>
            {
              problems
              .filter(problem => problem.resolved === false)
              .map(problem => (
                <li key={problem.id}>{problem.name}</li>
              ))
            }
          </ul>
        )
      }
      {
        quantityOfProblems?.resolved > 0 && (
          <ul className='problems-list'>
            <h3 className="status">Resolvidos:</h3>
            {
              problems
              .filter(problem => problem.resolved === true)
              .map(problem => (
                <li key={problem.id}>{problem.name}</li>
              ))
            }
          </ul>
        )
      }
    </div>
  )
}
