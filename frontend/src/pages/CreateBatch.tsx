import { useState, useEffect, useRef } from "react";
import { HStack } from '@chakra-ui/react'
import UploadFolder from "../components/UploadFolder";
import ImageCoordinates from "../components/ImageCoordinates";
import Report from "../components/Report";
import Menu from "../components/Menu";

function CreateBatch(){
    return (
        <div id="create-obj-page">
            <div id="obj-text">
                <p id="obj-name">Сопка/Новый набор</p>
            </div>
            <div id="create-obj-content">
                <Menu/>
                <Report/>
                <HStack>
                    <button className="report-btn"></button>
                    <button className="report-btn"></button>
                </HStack>
            </div>
        </div>
    )
}
export default CreateBatch;