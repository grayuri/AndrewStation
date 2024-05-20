import { generateRandomNumber } from "@/utils/generateRandomNumber"

export class Problem {
  constructor(data) {
    this.id = `p${data.number}${data.lineId}${data.stationId}${generateRandomNumber()}`
    this.name = data.name
    this.lineId = data.lineId
    this.stationId = data.stationId
    this.resolved = data.resolved
  }
}