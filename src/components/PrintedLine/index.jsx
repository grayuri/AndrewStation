import PrintedStation from '../PrintedStation'
import './styles.scss'

export default function PrintedLine({ line, confirmLoading }) {
  return (
    <div className="printed-line-container">
      <h3 className="line-name">{line.name}</h3>
      <div className="stations">
        {
          line.stations.map(station => (
            <PrintedStation station={station} key={station.id} confirmLoading={confirmLoading} />
          ))
        }
      </div>
    </div>
  )
}
