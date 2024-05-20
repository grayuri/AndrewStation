import { generateRandomNumber } from "@/utils/generateRandomNumber"

export class Line {
  constructor(data) {
    this.id = `l${data.number}${generateRandomNumber()}`
    this.name = `Linha ${data.number}`
    this.number = data.number
    this.problemsResolved = data.problemsResolved
    this.problemsUnresolved = data.problemsUnresolved
    this.problemsTotal = this.problemsResolved + this.problemsUnresolved
    
  }
}