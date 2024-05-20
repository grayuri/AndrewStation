import './styles.scss'

export default function ModalForm({ form, closeModal }) {
  return (
    <div className="modal-page">
      <div className="backdrop" onClick={closeModal} />
      <div className="current-page">
        { form }
      </div>
    </div>
  )
}
