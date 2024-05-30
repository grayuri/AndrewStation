import { deleteManyData, deleteSingleData, getSingleData, updateSingleData } from "../../../../../database/dbCollectionFeatures"

export async function GET(request, { params }) {
  const stationId = params.stationId
  const data = await getSingleData("stations", stationId)

  if (data.error) {
    if (data.error.statusCode === 404) return Response.json({}, { status: data.statusCode })
    const error = { error: data.error }
    return Response.json(error, { status: data.error.statusCode })
  }

  return Response.json(data, { status: 200 })
}

export async function PATCH(request, { params }) {
  const stationId = params.stationId
  const updatedStation = await request.json()

  if (!updatedStation) return Response.json({
    message: "Please, add a valid Station data."
  }, { status: 400 })
  
  const data = await updateSingleData("stations", stationId, updatedStation)

  if (data.error) {
    if (data.error.statusCode === 404) return Response.json({}, { status: data.statusCode })
    const error = { error: data.error }
    return Response.json(error, { status: data.error.statusCode })
  }

  return Response.json(data, { status: 200 })
}

export async function DELETE(request, { params }) {
  const stationId = params.stationId

  let deletedData = {}

  const deletedStation = await deleteSingleData("stations", stationId)
  if (deletedStation.error) {
    if (deletedStation.error.statusCode === 404) return Response.json({}, { status: deletedStation.statusCode })
    const error = { error: deletedStation.error }
    return Response.json(error, { status: deletedStation.error.statusCode })
  }
  else deletedData["deletedStation"] = deletedStation

  const deletedProblems = await deleteManyData("problems", { stationId }) 
  if (deletedProblems.error) {
    if (deletedProblems.error.statusCode === 404) return Response.json([], { status: deletedProblems.statusCode })
    const error = { error: deletedProblems.error }
    return Response.json(error, { status: deletedProblems.error.statusCode })
  }
  else deletedData["deletedProblems"] = deletedProblems

  return Response.json(deletedData, { status: 200 })
}