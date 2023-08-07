function CreateObject(){
    return(
        <div className='modal'>
            <p className='name'>Название объекта</p>
            <input className="obj-input"></input>
            <p className='name'>Комментарий</p>
            <input className="obj-input"></input>
            <button className="green-button">Сохранить</button>
        </div>
    )
}
export default CreateObject;