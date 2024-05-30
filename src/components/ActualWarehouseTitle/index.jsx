import Link from 'next/link';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import './styles.scss'

export default function ActualWarehouseTitle({ fc }) {
  return (
    <div className="actual-warehouse-title">
      <h1>Você  está no <span className="highlight">{fc}</span></h1>
      <Link href="/fc-warehouse">
        <CreateOutlinedIcon className='icon' />
      </Link>
    </div>
  )
}
