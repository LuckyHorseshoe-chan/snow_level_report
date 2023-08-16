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
            const loadPhoto = () => {
                const imgDiv = document.getElementById("img-edit")
                fetch("http://localhost:8000/img_path", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }).then((response) => {
                    return response.json()
                }).then((data) => {
                    console.log(data.img_url)
                    if (imgDiv){
                        imgDiv.style.backgroundImage = "url('http://localhost:8080/static/" + data.img_url + "')"
                    }
                })
            }
            return (
            <VStack>
                <ImageCoordinates/>
                <HStack>
                    <Button onClick={loadPhoto}>Попробовать случайную фотографию из набора</Button>
                    <Button onClick={() => {setActiveStep(2)}}>Обработать набор данных</Button>
                </HStack>
            </VStack>)
        } else {
            return (<Report />)
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