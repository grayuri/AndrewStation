import { deleteManyData, deleteSingleData, getSingleData, updateSingleData } from "../../../../../database/dbCollectionFeatures"

export async function GET(request, { params }) {
  const lineId = params.lineId
  const data = await getSingleData("lines", lineId)

  if (data.error) {
    if (data.error.statusCode === 404) return Response.json({}, { status: data.error.statusCode })
    const error = { error: data.error }
    return Response.json(error, { status: data.error.statusCode })
  }
  
  return Response.json(data, { status: 200 })
}

export async function PATCH(request, { params }) {
  const lineId = params.lineId
  const updatedLine = await request.json()

  if (!updatedLine) return Response.json({
    message: "Please, add a valid Line data."
  }, { status: 400 })
  
  const data = await updateSingleData("lines", lineId, updatedLine)

  if (data.error) {
    if (data.error.statusCode === 404) return Response.json({}, { status: data.statusCode })
    const error = { error: data.error }
    return Response.json(error, { status: data.error.statusCode })
  }

  return Response.json(data, { status: 200 })
}

export async function DELETE(request, { params }) {
  const lineId = params.lineId
  
  let deletedData = {}

  const deletedLine = await deleteSingleData("lines", lineId)
  if (deletedLine.error) {
    if (deletedLine.error.statusCode === 404) return Response.json({}, { status: deletedLine.statusCode })
    return Response.json(deletedLine.error, { status: deletedLine.error.statusCode })
  }
  else deletedData["deletedLine"] = deletedLine

  const deletedStations = await deleteManyData("stations", { lineId })
  if (deletedStations.error) {
    if (deletedStations.error.statusCode === 404) return Response.json([], { status: deletedStations.statusCode })
    return Response.json(deletedStations.error, { status: deletedStations.error.statusCode })
  }
  else deletedData["deletedStations"] = deletedStations

  const deletedProblems = await deleteManyData("problems", { lineId })
  if (deletedProblems.error) {
    if (deletedProblems.error.statusCode === 404) return Response.json([], { status: deletedProblems.statusCode })
    return Response.json(deletedProblems.error, { status: deletedProblems.error.statusCode })
  }
  else deletedData["deletedProblems"] = deletedProblems

  return Response.json(deletedData, { status: 200 })
}