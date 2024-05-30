export class Line {
  constructor(data) {
    this.name = `Linha ${data.number}`
    this.number = data.number
    this.problemsResolved = data.problemsResolved
    this.problemsUnresolved = data.problemsUnresolved
    this.problemsTotal = this.problemsResolved + this.problemsUnresolved
    this.fcWarehouse = data.fcWarehouse
  }
}