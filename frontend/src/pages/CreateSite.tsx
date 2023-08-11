import { useState } from 'react'

function CreateSite({closeModal}: {closeModal: any}){
    const [name, setName] = useState('')
    const [comment, setComment] = useState('')

    const changeName = (e: any) => {
        setName(e.target.value)
    }
    const changeComment = (e: any) => {
        setComment(e.target.value)
    }

    const addSite = (e: any) => {
        const newSite = {
            "name": name,
            "comment": comment
        }
        console.log(JSON.stringify(newSite))
        fetch("http://localhost:8000/site", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSite)
        })
        closeModal()
    }

    return(
        <div className='modal'>
            <div className="modal-content">
                <p className='modal-text'>Название объекта</p>
                <input className="obj-input" onChange={changeName}></input>
                <p className='modal-text'>Комментарий</p>
                <input className="obj-input" onChange={changeComment}></input>
                <button className="green-button" onClick={addSite}>Сохранить</button>
            </div>
        </div>
    )
}
export default CreateSite;