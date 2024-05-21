"use client"

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import Title from '@/components/Title'
import SingleProblem from '@/components/Problem'
import AddButton from '@/components/AddButton'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Problem } from '../../../../classes/Problem'
import './StationPage.scss'

export default function StationPage() {
  const [station, setStation] = useState()
  const [problems, setProblems] = useState([])

  const pathname = usePathname()
  const lineId = pathname.split("/")[1]
  const stationId = pathname.split("/")[2]
  
  function getProblemsFromDatabase() {
    const problems = JSON.parse(localStorage.getItem("problems")) || []
    return problems
  }

  const getProblems = useCallback(() => {
    const storedProblems = getProblemsFromDatabase()

    if (storedProblems.length > 0) {
      const filteredProblems = storedProblems.filter(problem => 
        (lineId === problem.lineId && stationId === problem.stationId)
      )
      setProblems(filteredProblems)
    }
  }, [lineId, stationId])

  function addProblemIntoDatabase(problemAdded) {
    const storedProblems = getProblemsFromDatabase()

    const allProblems = [...storedProblems]

    allProblems.push(problemAdded)

    localStorage.setItem("problems", JSON.stringify(allProblems))
  }

  function createProblem() {
    const problemNumber = problems?.length + 1 || 1

    const problem = new Problem({
      name: `Problema ${problemNumber}`,
      number: problemNumber,
      lineId,
      stationId,
      resolved: false
    })

    let problemsWithThisProblem = []

    if (!problems.length > 0) {
      setProblems(problemsWithThisProblem.push(problem))
    }
    else {
      problemsWithThisProblem = [...problems, problem]
    }
    
    setProblems(problemsWithThisProblem)
    addProblemIntoDatabase(problem)
  }

  function deleteProblemFromDatabase(id) {
    const storedProblems = getProblemsFromDatabase() || []
    const problemsWithoutThisProblem = storedProblems.filter(problem => problem.id !== id)

    localStorage.setItem("problems", JSON.stringify(problemsWithoutThisProblem))
  }

  function deleteProblem(id) {
    const problemsWithoutThisProblem = problems.filter(problem => problem.id !== id)

    setProblems(problemsWithoutThisProblem)
    deleteProblemFromDatabase(id)
  }

  const getStation = useCallback(() => {
    const savedStations = JSON.parse(localStorage.getItem("stations")) || []

    if (savedStations.length > 0) {
      const desiredStation = savedStations.find(station => station.id === stationId)
      setStation(desiredStation)
    }
  }, [stationId])

  useEffect(() => {
    getStation()
    getProblems()
  },[getStation, getProblems])

  return (
    <main className="station-page">
      <Title>Problemas da <span className="highlight">{station?.name}</span></Title>
      <Breadcrumbs />
      <div className="problems">
        {
          problems?.map(problem => (
            <SingleProblem 
              key={problem.id}
              id={problem.id}
              name={problem.name}
              resolved={problem.resolved}
              deleteProblem={deleteProblem}
            />
          )) 
        }
        <AddButton onClick={createProblem} />
      </div>
    </main>
  )
}
