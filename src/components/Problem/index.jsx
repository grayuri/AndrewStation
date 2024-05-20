"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import './styles.scss';

export default function Problem({ id, name, deleteProblem, resolved }) {
  const pathname = usePathname()

  return (
    <div className='problem'>
      <div className="left">
        <div className={"status " + (resolved ? "resolved" : "unresolved")} />
        <p>
          {name}
        </p>
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
