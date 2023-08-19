import { useState, useEffect, useRef } from "react";
import { VStack, HStack, Button } from '@chakra-ui/react'
import { useParams, Link } from 'react-router-dom'
import UploadFolder from "../components/UploadFolder";
import ImageCoordinates from "../components/ImageCoordinates";
import Report from "../components/Report";
import Menu from "../components/Menu";

function CreateBatch(){
    const { siteId } = useParams()
    const [ activeStep, setActiveStep ] = useState(0)

    const ProcessingStep = ({activeStep} : {activeStep: any}) => {
        if (activeStep == 0){
            return (<UploadFolder setActiveStep={setActiveStep} />)
        } else if (activeStep == 1) {
            return (<ImageCoordinates setActiveStep={setActiveStep}/>)
        } else {
            return (<Report setActiveStep={setActiveStep} />)
        }
    }
    return (
        <div id="create-obj-page">
            <div id="obj-text">
                <p id="obj-name">Сопка/Новый набор</p>
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