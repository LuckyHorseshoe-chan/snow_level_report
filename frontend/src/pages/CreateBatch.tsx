import { useState, useEffect, useRef } from "react";
import { HStack } from '@chakra-ui/react'
import { useParams, Link } from 'react-router-dom'
import UploadFolder from "../components/UploadFolder";
import ImageCoordinates from "../components/ImageCoordinates";
import Report from "../components/Report";
import Menu from "../components/Menu";

function CreateBatch(){
    const { siteId } = useParams()

    return (
        <div id="create-obj-page">
            <div id="obj-text">
                <p id="obj-name">Сопка/Новый набор</p>
            </div>
            <div id="create-obj-content">
                <Menu/>
                <UploadFolder/>
            </div>
            <Link to={("/site/" + siteId)}>Назад</Link>
        </div>
    )
}
export default CreateBatch;