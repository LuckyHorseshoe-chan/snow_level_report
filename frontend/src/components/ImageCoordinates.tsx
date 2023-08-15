import {Resizable} from 're-resizable'
import Draggable from 'react-draggable'
import {useEffect, useRef, useState} from 'react'

function ImageCoordinates(){
    const [img, setImg] = useState({top: 0, left: 0})
    const [gauge, setGauge] = useState({topLeft: {x: 0, y: 0}, rightBottom: {x: 0, y: 0}})
    const [type, setType] = useState({topLeft: {x: 0, y: 0}, rightBottom: {x: 0, y: 0}})
    const [date, setDate] = useState({topLeft: {x: 0, y: 0}, rightBottom: {x: 0, y: 0}})
    const [temp, setTemp] = useState({topLeft: {x: 0, y: 0}, rightBottom: {x: 0, y: 0}})
    const prec = 4

    const gaugeDragRef = useRef<any>()
    const typeDragRef = useRef<any>()
    const dateDragRef = useRef<any>()
    const tempDragRef = useRef<any>()

    const gaugeResizeRef = useRef<any>()
    const typeResizeRef = useRef<any>()
    const dateResizeRef = useRef<any>()
    const tempResizeRef = useRef<any>()

    const handleResize = (resizeRef: any, setFunc: any) => (e: any, direction: any, ref: any, d: any) => {
        setFunc({topLeft: {x: Number((resizeRef.current.resizableLeft - img.left).toPrecision(prec)), 
            y: Number((resizeRef.current.resizableTop - img.top).toPrecision(prec))}, 
        rightBottom: {x: Number((resizeRef.current.resizableRight - img.left).toPrecision(prec)), 
            y: Number((resizeRef.current.resizableBottom - img.top).toPrecision(prec))}})
    }

    const handleDrag = (ref: any, setFunc: any, elem: any) => (e: any, data: any) => {
        const width = elem.rightBottom.x - elem.topLeft.x
        const height = elem.rightBottom.y - elem.topLeft.y

        setFunc({topLeft: {x: Number(ref.current.state.x.toPrecision(prec)), 
            y: Number(ref.current.state.y.toPrecision(prec))}, 
        rightBottom: {x: Number((ref.current.state.x + width).toPrecision(prec)), 
            y: Number((ref.current.state.y + height).toPrecision(prec))}})
    }

    useEffect(() => {
        const imgDiv = document.getElementById("img-edit")
        if (!imgDiv){ return }
        const rect = imgDiv.getBoundingClientRect()
        setImg({top: rect.top, left: rect.left})
        console.log(rect)
    }, [])

    return (
        <div id="img-window">
            <div id="img-edit">
                <Draggable 
                    bounds={'parent'} 
                    onDrag={handleDrag(gaugeDragRef, setGauge, gauge)} ref={gaugeDragRef}>
                    <Resizable
                        defaultSize={{width: 100, height: 100}}
                        style={{border: "1px solid green"}}
                        bounds={'parent'}
                        ref={gaugeResizeRef}
                        onResize={handleResize(gaugeResizeRef, setGauge)}
                    >
                    </Resizable>
                </Draggable>
                <Draggable bounds={'parent'}>
                    <Resizable
                        defaultSize={{width: 100, height: 100}}
                        style={{border: "1px solid red"}}
                        bounds={'parent'}
                        ref={typeResizeRef}
                    >
                    </Resizable>
                </Draggable>
                <Draggable bounds={'parent'}>
                    <Resizable
                        defaultSize={{width: 100, height: 100}}
                        style={{border: "1px solid yellow"}}
                        bounds={'parent'}
                        ref={dateResizeRef}
                    >
                    </Resizable>
                </Draggable>
                <Draggable bounds={'parent'}>
                    <Resizable
                        defaultSize={{width: 100, height: 100}}
                        style={{border: "1px solid blueviolet"}}
                        bounds={'parent'}
                        ref={tempResizeRef}
                    >
                    </Resizable>
                </Draggable>
            </div>
            <div id="img-info">
                <div className="rect-info" id="rect-gauge">
                    <p className='img-text'>Рейка</p>
                    <p className='img-text'>Верхний левый угол: ({gauge.topLeft.x}, {gauge.topLeft.y})</p>
                    <p className='img-text'>Нижний правый угол: ({gauge.rightBottom.x}, {gauge.rightBottom.y})</p>
                    <p className='img-text'>Высота рейки (см): <input></input></p>
                    <p className='img-text'>Распознанное значение: </p>
                </div>
                <div className="rect-info" id="rect-type">
                    <p className='img-text'>Тип фото</p>
                    <p className='img-text'>Верхний левый угол: ()</p>
                    <p className='img-text'>Нижний правый угол: ()</p>
                    <p className='img-text'>Распознанное значение: </p>
                </div>
                <div className="rect-info" id="rect-date">
                    <p className='img-text'>Дата и время</p>
                    <p className='img-text'>Верхний левый угол: ()</p>
                    <p className='img-text'>Нижний правый угол: ()</p>
                    <p className='img-text'>Распознанное значение: </p>
                </div>
                <div className="rect-info" id="rect-temp">
                    <p className='img-text'>Температура</p>
                    <p className='img-text'>Верхний левый угол: ()</p>
                    <p className='img-text'>Нижний правый угол: ()</p>
                    <p className='img-text'>Распознанное значение: </p>
                </div>
            </div>
        </div>
    )
}
export default ImageCoordinates;