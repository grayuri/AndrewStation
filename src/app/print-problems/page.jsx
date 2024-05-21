"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import Title from "@/components/Title"
import PrintedLine from "@/components/PrintedLine"
import setTwoNumbersDigits from "@/utils/setTwoNumbersDigits"
import './styles.scss'

export default function PrintProblemsPage() {
  const [linesWithProblems, setLinesWithProblems] = useState([])
  const [allContentLoad, setAllContentLoad] = useState(false)

  const router = useRouter()
  const date = new Date()
  const actualDate = setTwoNumbersDigits(date.getDate())
  const actualMonth = setTwoNumbersDigits(date.getMonth())
  const actualYear = setTwoNumbersDigits(date.getFullYear())

  function getItemsFromDatabase(item) {
    const items = JSON.parse(localStorage.getItem(item)) || []
    return items
  }

  function mergeProblemsOfThisLine(problems, lineId) {
    const problemsOfThisLine = problems.filter(problem => problem.lineId === lineId)
    if (!problemsOfThisLine.length > 0) return []
    return problemsOfThisLine
  }

  function mergeProblemsOfThisLineStations(problems, stations, lineId) {
    const stationsOfThisLine = stations.filter(station => station.lineId === lineId)
    if (!stationsOfThisLine.length > 0) return []

    const problemsOfThisLineStations = []
    
    stationsOfThisLine.forEach(station => {
      const problemsOfThisStation = problems.filter(problem => problem.stationId === station.id)
      if (!problemsOfThisStation.length > 0) return []

      const desiredData = {
        name: station.name,
        problems: problemsOfThisStation
      }

      problemsOfThisLineStations.push(desiredData)
    })

    return problemsOfThisLineStations
  }

  const getLinesAndStationsWithProblems = useCallback(() => {
    const allLines = getItemsFromDatabase("lines")
    const allStations = getItemsFromDatabase("stations")
    const allProblems = getItemsFromDatabase("problems")

    if (!allProblems.length > 0) router.replace("/")

    const desiredLines = []
    
    allLines.forEach(line => {
      if (!allProblems.some(problem => problem.lineId === line.id)) return
      const problemsOfThisLine = mergeProblemsOfThisLine(allProblems, line.id)
      const stationsWithProblemsOfThisLine = mergeProblemsOfThisLineStations(
        problemsOfThisLine, allStations, line.id
      )

      const desiredData = {
        name: line.name,
        stations: stationsWithProblemsOfThisLine
      }

      desiredLines.push(desiredData)
    })

    setLinesWithProblems(desiredLines)
  }, [router])
  
  useEffect(() => {
    getLinesAndStationsWithProblems()
  }, [getLinesAndStationsWithProblems])

  useEffect(() => {
    if (allContentLoad === true) window.print()
  }, [allContentLoad])

  return (
    <main className="print-problems-page">
      <Title><span className="highlight">Problemas</span> Atuais ({actualDate}/{actualMonth}/{actualYear})</Title>
      <p className="borderline" />
      <div className="lines">
        {
          linesWithProblems?.map(line => (
            <PrintedLine line={line} key={line.id} confirmLoading={() => setAllContentLoad(true)} />
          ))
        }
      </div>
    </main>
  )
}
