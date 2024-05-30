"use client"

import { useCallback, useEffect, useState } from "react";
import { useFCContext } from "@/contexts/FCContext";
import { notFound } from "next/navigation";

import ProblemsOverviewCard from "@/components/ProblemsOverviewCard";
import Title from "@/components/Title";
import AddButton from "@/components/AddButton";
import ModalForm from "@/components/ModalForm";
import GenericUpdateForm from "@/components/GenericUpdateForm";
import PrintButton from "@/components/PrintButton";
import AddFCWarning from "@/components/AddFCWarning";
import ActualWarehouseTitle from "@/components/ActualWarehouseTitle";
import GenericLoading from "@/components/GenericLoading";
import haveNotEmptyStrings from "@/utils/haveNotEmptyStrings";
import { Line } from "../../classes/Line";
import './Home.scss';

export default function Home() {
  const { fc, loadingFc } = useFCContext()

  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [focusedLine, setFocusedLine] = useState()
  const [showModal, setShowModal] = useState(false)
  
  function focusLine(id) {
    setShowModal(true)
    const desiredLine = lines.find(line => line._id === id)
    setFocusedLine(desiredLine)
  }

  function closeModal() {
    setShowModal(false)
  }

  async function createLine() {
    const newLineProperties = {
      number: lines.length + 1,
      problemsResolved: 0,
      problemsUnresolved: 0,
      fcWarehouse: fc
    }

    const newLine = new Line(newLineProperties)
    
    const response = await fetch("/api/lines/", {
      method: "POST",
      body: JSON.stringify(newLine),
      headers: { "Content-Type":"application/json" }
    }, { cache: "no-store" })
    const createdLine = await response.json()
    
    if (response.ok) {
      newLine._id = createdLine.insertedId
      setLines(currentLines => [...currentLines, newLine])
    }
    else {
      setError({ 
        status: response.status, 
        informations: createdLine.error
      })
    }
  }

  const updateLine = useCallback(async (e, lineName) => {
    e.preventDefault()

    const notEmpty = haveNotEmptyStrings(lineName)

    if (!notEmpty) return // toast

    const lineUpdate = {
      name: lineName
    }

    const response = await fetch("/api/lines/" + focusedLine._id, {
      method: "PATCH",
      body: JSON.stringify(lineUpdate),
      headers: { "Content-Type":"application/json" }
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

  },[showModal])

  async function deleteLine(id) {
    const response = await fetch("/api/lines/" + id, { 
      method: "DELETE",
      headers: { "Content-Type":"application/json" }
    }, { cache: "no-store" })

    if (response.ok) {
      const linesWithoutThisLine = lines.filter(line => line._id !== id)
      setLines(linesWithoutThisLine)
    }
    else {
      const responseData = await response.json()
      setError({ 
        status: response.status, 
        informations: responseData.error
      })
    }
  }

  const getProblems = useCallback(async () => {
    const response = await fetch("/api/problems?fc=" + fc, { cache: "no-store" })
    const savedProblems = await response.json()
    if (response.ok) return savedProblems
    else {
      setError({ 
        status: response.status, 
        informations: savedProblems.error
      })
    }
  },[fc])

  function getProblemsQuantityInTheSavedLine(savedProblems, lineId) { 
    if (!savedProblems.length > 0) return {}

    const problemsInTheLine = savedProblems.filter(problem => problem.lineId === lineId)

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

    return {}
  }

  const getLines = useCallback(async () => {
    setLoading(true)

    const problems = await getProblems()
    const response = await fetch("/api/lines?fc=" + fc, { cache: "no-store" })
    const savedLines = await response.json()
    
    if (response.ok) {
      if (savedLines.length > 0) {
        const linesWithProblems = savedLines.map(line => ({
          ...line,
          ...getProblemsQuantityInTheSavedLine(problems, line._id)
        }))
        
        setLines(linesWithProblems)
      }
      setLoading(false)
    }
    else {
      setError({ 
        status: response.status, 
        informations: savedLines.error
      })
    }

  },[fc])

  useEffect(() => {
    if (fc) {
      getLines()
    }
    
  },[updateLine, getProblems, getLines, fc])

  useEffect(() => {
    if (error !== null) {
      if (error.status === 404) return notFound()
      else throw error.informations
    }
  },[error])

  if (loadingFc) return <GenericLoading />
  
  if (!fc && !loadingFc) return <AddFCWarning />

  return (
    <main className="home">
      <ActualWarehouseTitle fc={fc} />
      <Title>Todas as <span className="highlight">Linhas</span></Title>
      <PrintButton />
      {
        loading
        ? (
          <GenericLoading />
        )
        : (
          <div className="lines">
            {
              lines?.map((line, index) => (
                <ProblemsOverviewCard
                  name={line.name}
                  number={line.number}
                  problems={{ 
                    unsolved: line.problemsUnresolved || 0, 
                    resolved: line.problemsResolved || 0,
                    total: line.problemsTotal || 0
                  }}
                  href={`/${line._id}`}
                  key={index}
                  id={line._id}
                  deleteItem={deleteLine}
                  openModal={focusLine}
                />
              ))
            }
            <AddButton onClick={createLine} />
          </div>
        )
      }
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
