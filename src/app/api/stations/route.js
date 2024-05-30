import { createSingleData, getAllData, getFilteredData } from "../../../../database/dbCollectionFeatures";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const lineId = searchParams.get("lineId")
  const fc = searchParams.get("fc")
  
  let filter = {}

  if (lineId) filter["lineId"] = lineId
  if (fc) filter["fcWarehouse"] = fc

  let data = []

  if (lineId) {
    data = await getFilteredData("stations", filter)
  }
  else {
    data = await getAllData("stations")
  }

  if (data.error) {
    if (data.error.statusCode === 404) return Response.json([], { status: data.statusCode })
    const error = { error: data.error }
    return Response.json(error, { status: data.error.statusCode })
  }

  return Response.json(data, { status: 200 })
}

export async function POST(request) {
  const newStation = await request.json()

  if (!newStation) return Response.json({
    message: "Please, add a valid Station data."
  }, { status: 400 })
  
  const data = await createSingleData("stations", newStation)
  
  if (data.error) {
    const error = { error: data.error }
    return Response.json(error, { status: data.error.statusCode })
  }

  return Response.json(data, { status: 201 })
}