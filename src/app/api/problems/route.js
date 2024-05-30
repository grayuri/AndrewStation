import { createSingleData, getFilteredData, getAllData } from "../../../../database/dbCollectionFeatures";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const lineId = searchParams.get("lineId")
  const stationId = searchParams.get("stationId")
  const fc = searchParams.get("fc")

  let filter = {}

  if (lineId) filter["lineId"] = lineId
  if (stationId) filter["stationId"] = stationId
  if (fc) filter["fcWarehouse"] = fc

  let data = []
  
  if (lineId && stationId) {
    data = await getFilteredData("problems", filter)
  }
  else {
    data = await getAllData("problems")
  }

  if (data.error) {
    if (data.error.statusCode === 404) return Response.json([], { status: data.statusCode })
    const error = { error: data.error }
    return Response.json(error, { status: data.error.statusCode })
  }

  return Response.json(data, { status: 200 })
}

export async function POST(request) {
  const newProblem = await request.json()

  if (!newProblem) return Response.json({
    message: "Please, add a valid Problem data."
  }, { status: 400 })

  const data = await createSingleData("problems", newProblem)

  if (data.error) {
    const error = { error: data.error }
    return Response.json(error, { status: data.error.statusCode })
  }
  return Response.json(data, { status: 201 })
}