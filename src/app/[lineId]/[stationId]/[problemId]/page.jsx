"use client"

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import StationPage from "../page";
import UpdateProblemForm from "@/components/UpdateProblemForm";
import './UpdateProblemPage.scss';

export default function UpdateProblemPage() {
  const [problem, setProblem] = useState()

  const router = useRouter()
  const pathname = usePathname()
  const problemId = pathname.split("/")[3]

  function getProblemsFromDatabase() {
    const problemsJson = localStorage.getItem("problems")
    const data = JSON.parse(problemsJson)
    return data
  }

  function getProblem() {
    const problems = getProblemsFromDatabase()
    const desiredProblem = problems.find(problem => problem.id === problemId)

    setProblem(desiredProblem)
  }

  function updateProblemFromDatabase(problem) {
    const problems = getProblemsFromDatabase()
    const problemsWithoutThisProblem = problems.filter(p => p.id !== problem.id)
    const problemsWithUpdatedProblem = [ ...problemsWithoutThisProblem, problem ]

    localStorage.setItem("problems", JSON.stringify(problemsWithUpdatedProblem))

    router.back()
  }

  function updateProblem(e, updatedProblem) {
    e.preventDefault()

    if (updatedProblem?.name === "") return
    if (typeof(updatedProblem?.resolved) !== "boolean") return

    const newProblem = {
      ...problem,
      ...updatedProblem
    }

    updateProblemFromDatabase(newProblem)
  }

  useEffect(() => {
    getProblem()
  }, [])

  return (
    <div className="problem-page">
      <div className="backdrop" onClick={() => router.back()}/>
      <div className="previous-page" >
        <StationPage />
      </div>
      <div className="current-page">
        <UpdateProblemForm 
          problem={problem} 
          id={problemId} 
          updateProblem={updateProblem}
        />
      </div>
    </div>
  )
}