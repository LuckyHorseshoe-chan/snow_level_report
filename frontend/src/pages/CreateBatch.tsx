import { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom'
import UploadFolder from "../components/UploadFolder";
import ImageCoordinates from "../components/ImageCoordinates";
import Report from "../components/Report";
import Menu from "../components/Menu";

function CreateBatch(){
    const { siteId } = useParams()
    const [siteName, setSiteName] = useState("")
    const [ activeStep, setActiveStep ] = useState(0)

    useEffect(() => {
        fetch("http://localhost:8000/site?site_id=" + siteId, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            return response.json();
        }).then((site) => {
            setSiteName(site["name"])    
        })
    }, [])

    const ProcessingStep = ({activeStep} : {activeStep: any}) => {
        if (activeStep == 0){
            return (<UploadFolder setActiveStep={setActiveStep} />)
        } else if (activeStep == 1) {
            return (<ImageCoordinates setActiveStep={setActiveStep}/>)
        } else {
            return (<Report activeStep={activeStep} setActiveStep={setActiveStep} />)
        }
    }
    return (
        <div id="create-obj-page">
            <div id="obj-text">
                <p id="obj-name">{siteName}/Новый набор</p>
            </div>
            <div id="create-obj-content">
                <Menu activeStep={activeStep} setActiveStep={setActiveStep} />
                <ProcessingStep activeStep={activeStep} />
            </div>
            <Link to={("/site/" + siteId)}>Объект</Link>
        </div>
    )
}
export default CreateBatch;