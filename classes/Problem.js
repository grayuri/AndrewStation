export class Problem {
  constructor(data) {
    this.name = data.name
    this.lineId = data.lineId
    this.stationId = data.stationId
    this.resolved = data.resolved
    this.lastTimeUpdated = data.lastTimeUpdated ? data.lastTimeUpdated : ""
    this.fcWarehouse = data.fcWarehouse
  }
}