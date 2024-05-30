"use client"

import GenericErrorPage from "@/components/GenericErrorPage"

export default function Error({ error, reset }) {
  return (
    <GenericErrorPage 
      title={error.name}
      message={error.message}
      statusCode={error.statusCode}
      reset={reset}
    />
  )
}
