"use client"

import { createContext, useContext, useEffect, useState } from "react";

export const FCContext = createContext()

export function FCContextProvider({ children }) {
  const [fc, setFc] = useState("")
  const [loadingFc, setLoadingFc] = useState(true)

  function writeFc (value) {
    setFc(value.toUpperCase())
  }

  useEffect(() => {
    setLoadingFc(true)
    const savedFc = JSON.parse(localStorage.getItem("fc"))

    if (savedFc) {
      setFc(savedFc)
    }
    
    setLoadingFc(false)
  },[])

  return (
    <FCContext.Provider value={{ fc, loadingFc, writeFc }}>
      {children}
    </FCContext.Provider>
  )
}

export function useFCContext() {
  const context = useContext(FCContext)
  if (!context) throw new Error("Please, wrap the FC Context Provider on the App Page.")
  else return context
}