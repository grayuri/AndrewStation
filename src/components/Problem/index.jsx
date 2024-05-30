"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import setTwoNumbersDigits from '@/utils/setTwoNumbersDigits';
import './styles.scss';

export default function Problem({ id, name, deleteProblem, resolved, lastTimeUpdated }) {
  const pathname = usePathname()

  function getFormatedDateAndHours() {
    const date = new Date(lastTimeUpdated)
    const actualDate = setTwoNumbersDigits(date.getDate())
    const actualMonth = setTwoNumbersDigits((date.getMonth() + 1))
    const actualYear = setTwoNumbersDigits(date.getFullYear())
    const hours = setTwoNumbersDigits(date.getHours())
    const minutes = setTwoNumbersDigits(date.getMinutes())

    return `${actualDate}/${actualMonth}/${actualYear} às ${hours}:${minutes}`
  }

  return (
    <div className='problem'>
      <div className="left">
        <div className={"status " + (resolved ? "resolved" : "unresolved")} />
        <div className="informations">
          <p className='name'>
            {name}
          </p>
          {
            lastTimeUpdated && (
              <p className='last-update'>
                Última atualização no dia {getFormatedDateAndHours()}
              </p>
            )
          }
        </div>
      </div>
      <div className="buttons">
        <Link href={pathname + `/${id}`}>
          <CreateOutlinedIcon className='icon' />
        </Link>
        <DeleteOutlineOutlinedIcon 
          className='icon' 
          onClick={() => deleteProblem(id)}
        />
      </div>
    </div>
  )
}
