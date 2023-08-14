import {Resizable} from 're-resizable'
import Draggable from 'react-draggable'
import { Image, _ScrollView } from 'react-native'
import {useEffect, useRef, useState} from 'react'

function ImageCoordinates(){
    const [boxSize, setBoxSize] = useState({ width: 200, height: 200 })
    const onResize = (e: any, direction: any, ref: any, d: any) => {
        setBoxSize({width: boxSize.width + d.width, height: boxSize.height + d.height});
    }

    return (
        <div id="img-window">
            <div id="img-edit">
                
                <Draggable>
                    <Resizable
                        defaultSize={boxSize}
                        style={{border: "5px solid green"}}
                    >
                    </Resizable>
                </Draggable>
            </div>
            <div id="img-info">
                <div className="rect-info"></div>
                <div className="rect-info"></div>
                <div className="rect-info"></div>
                <div className="rect-info"></div>
            </div>
        </div>
    )
}
export default ImageCoordinates;