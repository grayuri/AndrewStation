"use client"

import { useEffect, useState } from "react";

import ProblemsOverviewCard from "@/components/ProblemsOverviewCard";
import Title from "@/components/Title";
import AddButton from "@/components/AddButton";
import ModalForm from "@/components/ModalForm";
import GenericUpdateForm from "@/components/GenericUpdateForm";
import PrintButton from "@/components/PrintButton";
import { Line } from "../../classes/Line";
import './Home.scss';

export default function Home() {
  const [lines, setLines] = useState([])
  const [focusedLine, setFocusedLine] = useState()
  const [showModal, setShowModal] = useState(false)
  
  function focusLine(id) {
    setShowModal(true)

    const desiredLine = lines.find(line => line.id === id)

    setFocusedLine(desiredLine)
  }

  function closeModal() {
    setShowModal(false)
  }

  function createLine() {
    const newLineProperties = {
      number: lines.length + 1,
      problemsResolved: 0,
      problemsUnresolved: 0
    }

    const newLine = new Line(newLineProperties)
    const linesWithThisLine = [...lines, newLine]

    setLines(linesWithThisLine)

    localStorage.setItem("lines", JSON.stringify(linesWithThisLine))
  }

  function updateLineFromDatabase(line) {
    const linesWithoutUpdatedLine = lines.filter(l => l.id !== line.id)
    const linesWithUpdatedLine = [...linesWithoutUpdatedLine, line]

    setLines(linesWithUpdatedLine)

    localStorage.setItem("lines", JSON.stringify(linesWithUpdatedLine))

    setShowModal(false)
  }

  function updateLine(e, lineName) {
    e.preventDefault()

    if (lineName === "") return

    const updatedLine = {
      ...focusedLine,
      name: lineName
    }

    updateLineFromDatabase(updatedLine)
  }

  function deleteLine(id) {
    const allStations = getAllDatabaseItems("stations")
    const allProblems = getAllDatabaseItems("problems")

    const linesWithoutThisLine = lines.filter(line => line.id !== id)
    const stationsWithoutThisLine = allStations.filter(station => station.lineId !== id)
    const problemsWithoutThisLine = allProblems.filter(problem => problem.lineId !== id)

    setLines(linesWithoutThisLine)
    localStorage.setItem("lines", JSON.stringify(linesWithoutThisLine))
    localStorage.setItem("stations", JSON.stringify(stationsWithoutThisLine))
    localStorage.setItem("problems", JSON.stringify(problemsWithoutThisLine))
  }

  function getSavedLines() {
    const savedLines = JSON.parse(localStorage.getItem("lines"))

    if (!savedLines) return

    const linesWithProblems = savedLines.map(line => ({
      ...line,
      ...getProblemsQuantityInTheSavedLine(line.id)
    }))

    setLines(linesWithProblems)
  }

  function getAllDatabaseItems(item) {
    const items = JSON.parse(localStorage.getItem(item))
    if (items) return items
  }

  function getProblemsQuantityInTheSavedLine(lineId) {
    const problemsJson = localStorage.getItem("problems")
    const data = JSON.parse(problemsJson)

    const problemsInTheLine = data.filter(problem => problem.lineId === lineId)

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

  useEffect(() => {
    getSavedLines()
  },[])

  return (
    <main className="home">
      <Title>Todas as <span className="highlight">Linhas</span></Title>
      <PrintButton />
      <div className="lines">
        {
          lines.map(line => (
            <ProblemsOverviewCard
              name={line.name}
              number={line.number}
              problems={{ 
                unsolved: line.problemsUnresolved, 
                resolved: line.problemsResolved,
                total: line.problemsTotal
              }}
              href={`/${line.id}`}
              key={line.id}
              id={line.id}
              deleteItem={deleteLine}
              openModal={focusLine}
            />
          ))
        }
        <AddButton onClick={createLine} />
      </div>

      {
        showModal && (
          <ModalForm 
            form={
              <GenericUpdateForm 
                item={focusedLine}
                updateItem={updateLine}
                type="line"
                closeModal={closeModal}
              />
            } 
            closeModal={closeModal}
          />
        )
      }
    </main>
  );
}
