"use client"

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import ProblemsOverviewCard from '@/components/ProblemsOverviewCard';
import Title from '@/components/Title';
import AddButton from '@/components/AddButton';
import GenericUpdateForm from '@/components/GenericUpdateForm';
import ModalForm from '@/components/ModalForm';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Station } from '../../../classes/Station';
import './LinePage.scss'

export default function LinePage() {
  const [stations, setStations] = useState([])
  const [line, setLine] = useState()
  const [focusedStation, setFocusedStation] = useState()
  const [showModal, setShowModal] = useState(false)

  const pathname = usePathname()
  const lineId = pathname.replace("/", "")

  function focusStation(id) {
    setShowModal(true)

    const desiredStation = stations.find(station => station.id === id)

    setFocusedStation(desiredStation)
  }

  function closeModal() {
    setShowModal(false)
  }

  const getLine = useCallback(() => {
    const lines = JSON.parse(localStorage.getItem("lines")) || []
    const actualLine = lines.find(savedLine => savedLine.id === lineId)
    
    if (actualLine) setLine(actualLine)
  },[lineId])

  function addStationToDatabase(station) {
    const savedStations = getSavedStations()

    if (savedStations) {
      const allStations = [...savedStations, station]
      
      localStorage.setItem("stations", JSON.stringify(allStations))
    }
  }

  function deleteStationOfDatabase(stationId) {
    const savedStations = getSavedStations()

    if (savedStations) {
      const allStations = savedStations.filter(station => station.id !== stationId)
      const allProblemsOfOtherStations = getProblemsOfDifferentStations(stationId)
  
      localStorage.setItem("stations", JSON.stringify(allStations))
      localStorage.setItem("problems", JSON.stringify(allProblemsOfOtherStations))
    }
  }

  const updateStationFromDatabase = useCallback((station) => {
    const allStations = getSavedStations()
    const allStationsWithoutUpdatedStation = allStations.filter(s => s.id !== station.id)
    const allStationsWithUpdatedStation = [...allStationsWithoutUpdatedStation, station]
    localStorage.setItem("stations", JSON.stringify(allStationsWithUpdatedStation))

    setShowModal(false)
  }, [showModal])

  function createStation() {
    const newStationProperties = {
      number: stations.length + 1,
      lineId: line.id,
      problemsResolved: 0,
      problemsUnresolved: 0
    }

    const newStation = new Station(newStationProperties)

    const stationsWithThisStation = [...stations, newStation]
    setStations(stationsWithThisStation)

    addStationToDatabase(newStation)
  }

  function updateStation(e, stationName) {
    e.preventDefault()

    if (stationName === "") return

    const updatedStation = {
      ...focusedStation,
      name: stationName
    }

    updateStationFromDatabase(updatedStation)
  }

  function deleteStation(id) {
    const stationsWithoutThisStation = stations.filter(station => station.id !== id)

    setStations(stationsWithoutThisStation)

    deleteStationOfDatabase(id)
  }

  function getSavedStations() {
    const savedStations = JSON.parse(localStorage.getItem("stations")) || []
    return savedStations
  }

  function getProblemsOfDifferentStations(stationId) {
    const allProblems = JSON.parse(localStorage.getItem("problems")) || []

    if (allProblems.length > 0) {
      const problemsDifferentOfThisStation = allProblems.filter(
        problem => problem.stationId !== stationId
      )
      return problemsDifferentOfThisStation
    }

    return []
  }

  const getFilteredSavedStations = useCallback(() => {
    const savedStations = getSavedStations()

    if (savedStations.length > 0) {
      const savedStationsOfThisLine = savedStations.filter(station => {
        return station.lineId === lineId
      })
      
      if (savedStationsOfThisLine.length > 0) {
        const stationsWithProblems = savedStationsOfThisLine.map(station => ({
          ...station,
          ...getProblemsQuantityInTheSavedStation(station.id)
        }))

        setStations(stationsWithProblems)
        return savedStationsOfThisLine
      }
    }

    return []

  }, [lineId])

  function getProblemsQuantityInTheSavedStation(stationId) {
    const problems = JSON.parse(localStorage.getItem("problems")) || []

    if (problems.length > 0) {
      const problemsInTheLine = problems.filter(problem => problem.stationId === stationId)
  
      if (problemsInTheLine.length > 0) {
        let problemsResolved = 0
        let problemsUnresolved = 0
        let problemsTotal = 0
    
        problemsInTheLine.forEach(problem => {
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
    }

    return null
  }

  useEffect(() => {
    getLine()
    getFilteredSavedStations()
  },[updateStationFromDatabase, getLine, getFilteredSavedStations])

  return (
    <main className='line-page'>
      <Title>Estações da <span className="highlight">{line?.name}</span></Title>
      <Breadcrumbs />
      <div className="stations">
        {
          stations.map(station => (
            <ProblemsOverviewCard
              name={station.name}
              number={station.number}
              problems={{ 
                unsolved: station.problemsUnresolved, 
                resolved: station.problemsResolved,
                total: station.problemsTotal
              }}
              href={pathname + `/${station.id}`}
              key={station.id}
              id={station.id}
              deleteItem={deleteStation}
              openModal={focusStation}
            />
          ))
        }
        <AddButton onClick={createStation} />
      </div>

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