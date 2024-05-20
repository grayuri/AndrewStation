import Link from "next/link"
import PrintIcon from '@mui/icons-material/Print';
import './styles.scss'

export default function PrintButton() {
  return (
    <Link className="print-problems-link" href="/print-problems" target="_blank">
      <div className="print-button">
        <PrintIcon className="icon" />
        <span>
          Imprimir Problemas
        </span>
      </div>
    </Link>
  )
}
