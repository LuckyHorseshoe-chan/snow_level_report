import { useState } from "react";
import { useParams } from 'react-router-dom'
import axios from 'axios'

function UploadFolder({setActiveStep} : {setActiveStep: any}){
    const [file, setFile] = useState<File[]>()
    const [fileName, setFileName] = useState("")
    const [comment, setComment] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { siteId } = useParams()

    const uploadFile = (e: any) => {
        //const imgUpload = document.getElementById("img-upload")
        setFile(e.target.files)
        //if (!imgUpload) return
        //imgUpload.style.background = "url('/img_uploaded.png')"
        setFileName(e.target.files[0].name)
    }

    const writeComment = (e: any) =>{
        setComment(e.target.value)
    }

    const handleSubmit = () => {
        if (!file){
            return
        }
        setIsLoading(true)
        console.log(file[0].name)
        const formdata = new FormData();
        formdata.append(
          "file",
          file[0],
        )
        axios.post("http://localhost:8000/upload", formdata).then(() => {
            const batch = {
                "site_id": siteId,
                "comment": comment,
                "start_date": "1900-01-01",
                "end_date": "1900-01-01",
                "mapping": [],
                "status": "rejected"
            }
            fetch("http://localhost:8000/batch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(batch)
            }).then(() => {
                setActiveStep(1)
            })
        })  
    }
    return(
        <div className="modal-content">
            <p className="modal-text">Комментарий</p>
            <input className="obj-input" onChange={writeComment}></input>
            <input type="file" id="img-upload" onChange={uploadFile}/>
            <p>{fileName}</p>
            <button className="green-button" onClick={handleSubmit}>
                {isLoading ? "Загрузка..." : "Загрузить"}
            </button>
        </div>
    )
}
export default UploadFolder;