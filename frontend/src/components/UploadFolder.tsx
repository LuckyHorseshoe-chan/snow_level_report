import { useState, useEffect, useRef } from "react";
import axios from 'axios'

function UploadFolder({setActiveStep} : {setActiveStep: any}){
    const [file, uploadFile] = useState<File[]>()

    const handleChange = (e: any) => {
        uploadFile(e.target.files)
    }

    const handleSubmit = () => {
        console.log("undefined")
        if (!file){
            return
        }
        console.log(file[0].name)
        const formdata = new FormData();
        formdata.append(
          "file",
          file[0],
        )
        axios.post("http://localhost:8000/upload", formdata)
        setActiveStep(1)
          
    }
    return(
        <div className="modal-content">
            <p className="modal-text">Комментарий</p>
            <input className="obj-input"></input>
            <input type="file" id="img-upload" onChange={handleChange}/>
            <button className="green-button" onClick={handleSubmit}>Загрузить</button>
        </div>
    )
}
export default UploadFolder;