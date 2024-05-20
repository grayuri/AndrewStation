import PrintedProblems from '../PrintedProblems'
import './styles.scss'

export default function PrintedStation({ station, confirmLoading }) {
  return (
    <div className="printed-station-container">
      <h3 className="station-name">{station.name}</h3>
      <div className="problems">
        <PrintedProblems problems={station.problems} confirmLoading={confirmLoading} />
      </div>
    </div>
  )
}
