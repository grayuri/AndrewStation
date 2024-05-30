export class Station {
  constructor(data) {
    this.name = `Estação ${data.number}`
    this.number = data.number
    this.lineId = data.lineId
    this.problemsResolved = data.problemsResolved
    this.problemsUnresolved = data.problemsUnresolved
    this.problemsTotal = this.problemsResolved + this.problemsUnresolved
    this.fcWarehouse = data.fcWarehouse
  }
}