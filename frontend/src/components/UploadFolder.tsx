import { useState, useEffect, useRef } from "react";

function UploadFolder(){
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current !== null) {
        ref.current.setAttribute("directory", "");
        ref.current.setAttribute("webkitdirectory", "");
        ref.current.setAttribute("mozdirectory", "");
        }
    }, [ref]);
    return(
        <div className="modal-content">
            <p className='modal-text'>Комментарий</p>
            <input className="obj-input"></input>
            <input type="file" ref={ref} id="img-upload" />
            <button className="green-button">Загрузить</button>
        </div>
    )
}
export default UploadFolder;