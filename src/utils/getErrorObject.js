export default function getErrorObject(error, statusCode) {
  if (process.env.NODE_ENV === "development") {
    const errorObject = {
      statusCode,
      name: error.name,
      message: error.message,
      stack: error.stack
    }

    console.error(errorObject)

    return { error: errorObject }
  }
  else if (process.env.NODE_ENV === "production") {
    let name = ""
    let message = ""

    if (`${statusCode}`.startsWith("4")) {
      name = "Some Fail Ocurred!"
      message = "Unfortunatly, you received a bad request. Try again later..."
    }
    else if (`${statusCode}`.startsWith("5")) {
      name = "Some Fatal Error Ocurred!"
      message = "Sorry. Something serious happened to our server. Try again later..."
    }

    if (statusCode === 404) {
      name = "Data Not Found!"
      message = "This data that you tried to search doesn't exist. Please, try to pick another one."
    }

    return {
      error: {
        statusCode,
        name,
        message
      }
    }
  }
}
