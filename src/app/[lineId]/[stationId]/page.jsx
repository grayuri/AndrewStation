"use client"

import { useCallback, useEffect, useState } from 'react'
import { notFound, usePathname } from 'next/navigation'
import { useFCContext } from '@/contexts/FCContext'

import Title from '@/components/Title'
import SingleProblem from '@/components/Problem'
import AddButton from '@/components/AddButton'
import Breadcrumbs from '@/components/Breadcrumbs'
import AddFCWarning from '@/components/AddFCWarning'
import GenericLoading from '@/components/GenericLoading'
import { Problem } from '../../../../classes/Problem'
import './StationPage.scss'

export default function StationPage() {
  const { fc, loadingFc } = useFCContext()

  const [station, setStation] = useState()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const pathname = usePathname()
  const lineId = pathname.split("/")[1]
  const stationId = pathname.split("/")[2]

  const getProblems = useCallback(async () => {
    setLoading(true)

    const filterUrl = `lineId=${lineId}&stationId=${stationId}`
    const response = await fetch("/api/problems?" + filterUrl, { cache: "no-store" })
    const filteredProblems = await response.json()

    if (response.ok) {
      setProblems(filteredProblems)
      setLoading(false)
    }
    else {
      setError({ 
        status: response.status, 
        informations: filteredProblems.error
      })
    }

  }, [lineId, stationId])

  async function createProblem() {
    const problemNumber = problems?.length + 1 || 1

    const newProblem = new Problem({
      name: `Problema ${problemNumber}`,
      number: problemNumber,
      lineId,
      stationId,
      resolved: false,
      lastTimeUpdated: "",
      fcWarehouse: fc
    })
    
    const response = await fetch("/api/problems", {
      method: "POST",
      body: JSON.stringify(newProblem),
      headers: { "Content-type":"Application/json" }
    }, { cache: "no-store" })
    const createdProblem = await response.json()

    if (response.ok) {
      newProblem._id = createdProblem.insertedId
      setProblems(currentProblems => [...currentProblems, newProblem])
    }
    else {
      if (response.status === 404) notFound()
      else setError(createdProblem.error)
    }
  }

  async function deleteProblem(id) {
    const problemsWithoutThisProblem = problems.filter(problem => problem._id !== id)

    const response = await fetch("/api/problems/" + id, {
      method: "DELETE",
      headers: { "Content-Type":"application/json" }
    }, { cache: "no-store" })

    if (response.ok) {
      setProblems(problemsWithoutThisProblem)
    }
    else {
      const responseData = await response.json()
      setError({ 
        status: response.status, 
        informations: responseData.error
      })
    }
  }

  const getStation = useCallback(async () => {
    const response = await fetch("/api/stations/" + stationId, { cache: "no-store" }) 
    const actualStation = await response.json()

    if (response.ok) {
      if (actualStation) setStation(actualStation)
      else notFound()
    }
    else {
      setError({ 
        status: response.status, 
        informations: actualStation.error
      })
    }
    
  }, [stationId])

  useEffect(() => {
    getStation()
    getProblems()
  },[getStation, getProblems])

  useEffect(() => {
    if (error !== null) {
      if (error.status === 404) return notFound()
      else throw error.informations
    }
  },[error])

  if (loadingFc) return <GenericLoading />
  
  if (!fc && !loadingFc) return <AddFCWarning />

  if (!station) return <GenericLoading />

  if (station) return (
    <main className="station-page">
      <Title>Problemas da <span className="highlight">{station?.name}</span></Title>
      <Breadcrumbs />
      {
        loading
        ? (
          <GenericLoading />
        )
        : (
          <div className="problems">
            {
              problems?.map((problem, index) => (
                <SingleProblem 
                  key={index}
                  id={problem._id}
                  name={problem.name}
                  resolved={problem.resolved}
                  lastTimeUpdated={problem.lastTimeUpdated}
                  deleteProblem={deleteProblem}
                />
              )) 
            }
            <AddButton onClick={createProblem} />
          </div>
        )
      }
    </main>
  )
}
