"use client"

import { useCallback, useEffect, useState } from 'react';
import { notFound, usePathname } from 'next/navigation';
import { useFCContext } from '@/contexts/FCContext';

import ProblemsOverviewCard from '@/components/ProblemsOverviewCard';
import Title from '@/components/Title';
import AddButton from '@/components/AddButton';
import GenericUpdateForm from '@/components/GenericUpdateForm';
import ModalForm from '@/components/ModalForm';
import Breadcrumbs from '@/components/Breadcrumbs';
import AddFCWarning from '@/components/AddFCWarning';
import GenericLoading from '@/components/GenericLoading';
import haveNotEmptyStrings from '@/utils/haveNotEmptyStrings';
import { Station } from '../../../classes/Station';
import './LinePage.scss'

export default function LinePage() {
  const { fc, loadingFc } = useFCContext()

  const [line, setLine] = useState()
  const [stations, setStations] = useState([])
  const [focusedStation, setFocusedStation] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const pathname = usePathname()
  const lineId = pathname.split("/")[1]

  function focusStation(id) {
    setShowModal(true)

    const desiredStation = stations.find(station => station._id === id)

    setFocusedStation(desiredStation)
  }

  function closeModal() {
    setShowModal(false)
  }

  const getLine = useCallback(async () => {
    if (lineId !== "" || lineId !== null || lineId !== undefined) {
      const response = await fetch("/api/lines/" + lineId, { cache: "no-store" })
      const actualLine = await response.json()

      console.log(response)

      if (response.ok === true) {
        setLine(actualLine)
      }
      else {
        setError({ 
          status: response.status, 
          informations: actualLine.error
        })
      }
    }

  }, [lineId])

  async function createStation() {
    const newStationProperties = {
      number: stations.length + 1,
      lineId,
      problemsResolved: 0,
      problemsUnresolved: 0,
      fcWarehouse: fc
    }

    const newStation = new Station(newStationProperties)

    const response = await fetch("/api/stations", {
      method: "POST",
      body: JSON.stringify(newStation),
      headers: { "Content-Type": "application/json" }
    }, { cache: "no-store" })
    const createdStation = await response.json()

    if (response.ok === true) {
      newStation._id = createdStation.insertedId
      setStations(currentStations => [...currentStations, newStation])
    }
    else {
      setError({ 
        status: response.status, 
        informations: createdStation.error
      })
    }
  }

  const updateStation = useCallback(async (e, stationName) => {
    e.preventDefault()

    const notEmpty = haveNotEmptyStrings(stationName)

    if (!notEmpty) return // toast

    const stationUpdate = {
      name: stationName
    }

    const response = await fetch("/api/stations/" + focusedStation._id, {
      method: "PATCH",
      body: JSON.stringify(stationUpdate),
      headers: { "Content-Type": "application/json" }
    }, { cache: "no-store" })

    if (response.ok) setShowModal(false)
    else {
      setShowModal(false)
      const responseData = await response.json()
      setError({ 
        status: response.status, 
        informations: responseData.error
      })
    }

  }, [showModal])

  async function deleteStation(id) {
    const response = await fetch("/api/stations/" + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    }, { cache: "no-store" })

    if (response.ok) {
      const stationsWithoutThisStation = stations.filter(station => station._id !== id)
      setStations(stationsWithoutThisStation)
    }
    else {
      const responseData = await response.json()
      setError({ 
        status: response.status, 
        informations: responseData.error
      })
    }
  }

  function getProblemsQuantityInTheSavedStation(problems, stationId) {
    if (!problems.length > 0) return {}

    const problemsInTheStation = problems.filter(problem => problem.stationId === stationId)

    if (problemsInTheStation.length > 0) {
      let problemsResolved = 0
      let problemsUnresolved = 0
      let problemsTotal = 0

      problemsInTheStation.forEach(problem => {
        if (problem.resolved === true) problemsResolved++
        else problemsUnresolved++
        problemsTotal++
      })

      const allProblems = {
        problemsResolved,
        problemsUnresolved,
        problemsTotal
      }

      return allProblems
    }

    return {}
  }

  const getProblems = useCallback(async () => {
    if (lineId !== "" || lineId !== null || lineId !== undefined) {
      const filterUrl = `fc=${fc}&lineId=${lineId}`
      const response = await fetch("/api/problems?" + filterUrl, { cache: "no-store" })
      const savedProblems = await response.json()

      if (response.ok) return savedProblems
      else {
        setError({ 
          status: response.status, 
          informations: savedProblems.error
        })
      }
    }
  }, [fc, lineId])

  const getStationsOfThisLine = useCallback(async () => {
    setLoading(true)
    if (lineId !== "" || lineId !== null || lineId !== undefined) {
      const filterUrl = `fc=${fc}&lineId=${lineId}`

      const problems = await getProblems()
      const response = await fetch("/api/stations?" + filterUrl, { cache: "no-store" })
      const savedStationsOfThisLine = await response.json()

      if (response.ok) {
        if (savedStationsOfThisLine.length > 0) {
          const stationsWithProblems = savedStationsOfThisLine.map((station) => ({
            ...station,
            ...getProblemsQuantityInTheSavedStation(problems, station._id)
          }))

          setStations(stationsWithProblems)
        }

        setLoading(false)
      }
      else {
        setError({ 
          status: response.status, 
          informations: savedStationsOfThisLine.error
        })
      }
    }
  }, [lineId, getProblems])

  useEffect(() => {
    if (fc) {
      getLine()
      getStationsOfThisLine()
    }
  }, [updateStation, getLine, getStationsOfThisLine, fc])

  useEffect(() => {
    if (error !== null) {
      if (error.status === 404) return notFound()
      else throw error.informations
    } 
  }, [error])

  if (loadingFc) return <GenericLoading />

  if (!fc && !loadingFc) return <AddFCWarning />

  if (!line) return <GenericLoading />
  
  if (line) return (
    <main className='line-page'>
      <Title>Estações da <span className="highlight">{line?.name}</span></Title>
      <Breadcrumbs />
      {
        loading
          ? (
            <GenericLoading />
          )
          : (
            <div className="stations">
              {
                stations.map((station, index) => (
                  <ProblemsOverviewCard
                    name={station.name}
                    number={station.number}
                    problems={{
                      unsolved: station.problemsUnresolved,
                      resolved: station.problemsResolved,
                      total: station.problemsTotal
                    }}
                    href={pathname + `/${station._id}`}
                    key={index}
                    id={station._id}
                    deleteItem={deleteStation}
                    openModal={focusStation}
                  />
                ))
              }
              <AddButton onClick={createStation} />
            </div>
          )
      }
      {
        showModal && (
          <ModalForm
            form={
              <GenericUpdateForm
                item={focusedStation}
                updateItem={updateStation}
                type="station"
                closeModal={closeModal}
              />
            }
            closeModal={closeModal}
          />
        )
      }
    </main>
  )
}