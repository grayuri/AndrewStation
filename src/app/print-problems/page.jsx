"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import Title from "@/components/Title"
import PrintedLine from "@/components/PrintedLine"
import setTwoNumbersDigits from "@/utils/setTwoNumbersDigits"
import GenericLoading from "@/components/GenericLoading"
import AddFCWarning from "@/components/AddFCWarning"
import './PrintProblemsPage.scss'
import { useFCContext } from "@/contexts/FCContext"

export default function PrintProblemsPage() {
  const { fc, loadingFc } = useFCContext()

  const [linesWithProblems, setLinesWithProblems] = useState([])
  const [error, setError] = useState(null)
  const [allContentLoad, setAllContentLoad] = useState(false)

  const router = useRouter()
  const date = new Date()
  const actualDate = setTwoNumbersDigits(date.getDate())
  const actualMonth = setTwoNumbersDigits((date.getMonth() + 1))
  const actualYear = setTwoNumbersDigits(date.getFullYear())

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
      const problemsOfThisStation = problems.filter(problem => problem.stationId === station._id)
      if (!problemsOfThisStation.length > 0) return []

      const desiredData = {
        name: station.name,
        problems: problemsOfThisStation
      }

      problemsOfThisLineStations.push(desiredData)
    })

    return problemsOfThisLineStations
  }

  const getLinesAndStationsWithProblems = useCallback(async () => {
    const allLinesResponse = await fetch("/api/lines?fc=" + fc, { cache: "no-store" })
    const allStationsResponse = await fetch("/api/stations?fc=" + fc, { cache: "no-store" })
    const allProblemsResponse = await fetch("/api/problems?fc=" + fc, { cache: "no-store" })
    const allLines = await allLinesResponse.json()
    const allStations = await allStationsResponse.json()
    const allProblems = await allProblemsResponse.json()

    if (
      allLinesResponse.ok &&
      allStationsResponse.ok &&
      allProblemsResponse.ok
    ) {
      if (!allProblems.length > 0) router.replace("/")

      const desiredLines = []

      allLines.forEach(line => {
        if (!allProblems.some(problem => problem.lineId === line._id)) return
        const problemsOfThisLine = mergeProblemsOfThisLine(allProblems, line._id)
        const stationsWithProblemsOfThisLine = mergeProblemsOfThisLineStations(
          problemsOfThisLine, allStations, line._id
        )

        const desiredData = {
          name: line.name,
          stations: stationsWithProblemsOfThisLine
        }

        desiredLines.push(desiredData)
      })

      setLinesWithProblems(desiredLines)
    }
    else {
      if (allLines.error) {
        setError({ 
          status: allLinesResponse.status, 
          informations: allLines.error
        })
        return
      }

      if (allStations.error) {
        setError({ 
          status: allStationsResponse.status, 
          informations: allStations.error
        })
        return
      }

      if (allProblems.error) {
        setError({ 
          status: allProblemsResponse.status, 
          informations: allProblems.error
        })
        return
      }
    }
  }, [fc, router])

  useEffect(() => {
    if (fc) getLinesAndStationsWithProblems()
  }, [fc])

  useEffect(() => {
    if (allContentLoad === true) window.print()
  }, [allContentLoad])

  useEffect(() => {
    if (error !== null) {
      if (error.status === 404) return notFound()
      else throw error.informations
    }
  },[error])

  if (loadingFc) return <GenericLoading />

  if (!fc && !loadingFc) return <AddFCWarning />

  return (
    <main className="print-problems-page">
      <Title><span className="highlight">Problemas</span> Atuais ({actualDate}/{actualMonth}/{actualYear})</Title>
      <p className="borderline" />
      {
        linesWithProblems.length === 0
          ? (
            <GenericLoading />
          )
          : (
            <div className="lines">
              {
                linesWithProblems?.map((line, index) => (
                  <PrintedLine line={line} key={index} confirmLoading={() => setAllContentLoad(true)} />
                ))
              }
            </div>
          )
      }
    </main>
  )
}
