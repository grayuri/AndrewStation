import { generateRandomNumber } from "@/utils/generateRandomNumber"

export class Station {
  constructor(data) {
    this.id = `s${data.number}${data.lineId}${generateRandomNumber()}`
    this.name = `Estação ${data.number}`
    this.number = data.number
    this.lineId = data.lineId
    this.problemsResolved = data.problemsResolved
    this.problemsUnresolved = data.problemsUnresolved
    this.problemsTotal = this.problemsResolved + this.problemsUnresolved
  }
}