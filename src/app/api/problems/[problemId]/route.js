import { deleteSingleData, getSingleData, updateSingleData } from "../../../../../database/dbCollectionFeatures"

export async function GET(request, { params }) {
  const problemId = params.problemId
  const data = await getSingleData("problems", problemId)

  if (data.error) {
    if (data.error.statusCode === 404) return Response.json({}, { status: data.statusCode })
    const error = { error: data.error }
    return Response.json(error, { status: data.error.statusCode })
  }

  return Response.json(data, { status: 200 })
}

export async function PATCH(request, { params }) {
  const problemId = params.problemId
  const updatedProblem = await request.json()

  if (!updatedProblem) return Response.json({
    message: "Please, add a valid Problem data."
  }, { status: 400 })

  const data = await updateSingleData("problems", problemId, updatedProblem)

  if (data.error) {
    if (data.error.statusCode === 404) return Response.json({}, { status: data.statusCode })
    const error = { error: data.error }
    return Response.json(error, { status: data.error.statusCode })
  }

  return Response.json(data, { status: 200 })
}

export async function DELETE(request, { params }) {
  const problemId = params.problemId
  const deletedProblem = await deleteSingleData("problems", problemId)

  if (deletedProblem.error) {
    if (deletedProblem.error.statusCode === 404) return Response.json({}, { status: deletedProblem.statusCode })
    const error = { error: deletedProblem.error }
    return Response.json(error, { status: deletedProblem.error.statusCode })
  }

  return Response.json(deletedProblem, { status: 200 })
}