import Link from 'next/link';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import './styles.scss';

export default function ProblemsOverviewCard({ 
  name, problems, href, deleteItem, id, openModal
}) {
  return (
    <div className="problems-overview-card">
        <div className="top">
          <span className="name">{name}</span>
          <div className="icons">
            <CreateOutlinedIcon className='icon' onClick={() => openModal(id)} />
            <DeleteOutlineOutlinedIcon className='icon' onClick={() => deleteItem(id)} />
          </div>
        </div>
        <Link href={href}>
          <div className="informations">
            <div className="problem-quantity">{
              problems.total === 0 ? "0" : `${problems.total}`
            } Problemas</div>
            <ul className="problem-status">
              <li>
                <span className="circle"></span>
                <span>{problems.unsolved}</span>
              </li>
              <li>
                <span className="circle"></span>
                <span>{problems.resolved}</span>
              </li>
            </ul>
          </div>
        </Link>
      </div>
  )
}
