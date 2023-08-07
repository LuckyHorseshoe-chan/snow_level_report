function CreateObject(){
    return(
        <div className='modal'>
            <p className='modal-text'>Название объекта</p>
            <input className="obj-input"></input>
            <p className='modal-text'>Комментарий</p>
            <input className="obj-input"></input>
            <button className="green-button">Сохранить</button>
        </div>
    )
}
export default CreateObject;