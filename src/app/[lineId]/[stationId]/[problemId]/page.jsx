"use client"

import { useCallback, useEffect, useState, useRef } from "react";
import { notFound, usePathname, useRouter } from "next/navigation";

import StationPage from "../page";
import UpdateProblemForm from "@/components/UpdateProblemForm";
import haveNotEmptyStrings from "@/utils/haveNotEmptyStrings";
import './UpdateProblemPage.scss';

export default function UpdateProblemPage() {
  const nameInputRef = useRef(null)
  const statusInputRef = useRef(null)

  const [problem, setProblem] = useState()
  const [error, setError] = useState(null)

  const router = useRouter()
  const pathname = usePathname()
  const problemId = pathname.split("/")[3]

  const getProblem = useCallback(async () => {
    const response = await fetch("/api/problems/" + problemId, { cache: "no-store" })
    const actualProblem = await response.json()

    if (response.ok) {
      setProblem(actualProblem)
    }
    else {
      setError({ 
        status: response.status, 
        informations: actualProblem.error
      })
    }

  }, [problemId])

  async function updateProblem(e) {
    e.preventDefault()

    const problemData = {}

    if (nameInputRef.current.value) problemData.name = nameInputRef.current.value
    if (statusInputRef.current.value) problemData.resolved = statusInputRef.current.value

    let notEmpty;

    if (problemData.name) notEmpty = haveNotEmptyStrings(problemData.name)
    
    if (!notEmpty) return //toast
    
    if (typeof(problemData.resolved) !== "boolean") {
      if (problemData.resolved === "true") problemData.resolved = true
      else if (problemData.resolved === "false") problemData.resolved = false
      else return
    }

    const problemUpdate = {
      ...problemData,
      lastTimeUpdated: new Date().toString()
    }

    const response = await fetch("/api/problems/" + problemId, {
      method: "PATCH",
      body: JSON.stringify(problemUpdate),
      headers: { "Content-Type":"application/json" }
    }, { cache: "no-store" })

    if (response.ok) router.back()
    else {
      const responseData = await response.json()
      setError({ 
        status: response.status, 
        informations: responseData.error
      })
    }
  }

  useEffect(() => {
    getProblem()
  }, [getProblem])

  useEffect(() => {
    if (error !== null) {
      if (error.status === 404) return notFound()
      else throw error.informations
    }
  },[error])

  return (
    <div className="problem-page">
      <div className="backdrop" onClick={() => router.back()}/>
      <div className="previous-page" >
        <StationPage />
      </div>
      <div className="current-page">
        {
          problem && (
            <UpdateProblemForm 
              problem={problem} 
              id={problemId} 
              updateProblem={updateProblem}
              nameInputRef={nameInputRef}
              statusInputRef={statusInputRef}
            />
          )
        }
      </div>
    </div>
  )
}
