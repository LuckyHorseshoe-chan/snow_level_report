import { useState, useEffect, useRef } from "react";
import UploadFolder from "../components/UploadFolder";
import ImageCoordinates from "../components/ImageCoordinates";
import Menu from "../components/Menu";

function CreateBatch(){
    return (
        <div id="create-obj-page">
            <div id="obj-text">
                <p id="obj-name">Сопка/Новый набор</p>
            </div>
            <div id="create-obj-content">
                <Menu/>
                <ImageCoordinates/>
                <button className="report-btn"></button>
            </div>
        </div>
    )
}
export default CreateBatch;