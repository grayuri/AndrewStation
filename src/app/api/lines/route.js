import { createSingleData, getAllData, getFilteredData } from "../../../../database/dbCollectionFeatures";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const fc = searchParams.get("fc")

  let data = []
  
  if (fc) {
    data = await getFilteredData("lines", { fcWarehouse: fc })
  }
  else {
    data = await getAllData("lines")
  }

  if (data.error) {
    if (data.error.statusCode === 404) return Response.json([], { status: data.statusCode })
    const error = { error: data.error }
    return Response.json(error, { status: data.error.statusCode })
  }


  return Response.json(data, { status: 200 })
}

export async function POST(request) {
  const newLine = await request.json()

  if (!newLine) return Response.json({
    message: "Please, add a valid Line data."
  }, { status: 400 })

  const data = await createSingleData("lines", newLine)

  if (data.error) {
    const error = { error: data.error }
    return Response.json(error, { status: data.error.statusCode })
  }

  return Response.json(data, { status: 201 })
}