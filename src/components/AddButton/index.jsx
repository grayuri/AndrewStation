import AddIcon from '@mui/icons-material/Add';
import './styles.scss'

export default function AddButton({ onClick }) {
  return (
    <div className="add-button" onClick={onClick}>
      <AddIcon className='icon' />
    </div>
  )
}
