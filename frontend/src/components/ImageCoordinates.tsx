import { Button } from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import Konva from 'konva'

function ImageCoordinates(){
    const [ruler, setRuler] = useState({topLeft: {x: 0, y: 0}, rightBottom: {x: 0, y: 0}})
    const [type, setType] = useState({topLeft: {x: 0, y: 0}, rightBottom: {x: 0, y: 0}})
    const [date, setDate] = useState({topLeft: {x: 0, y: 0}, rightBottom: {x: 0, y: 0}})
    const [temp, setTemp] = useState({topLeft: {x: 0, y: 0}, rightBottom: {x: 0, y: 0}})

    const [isType, setIsType] = useState(true)
    const [isTemp, setIsTemp] = useState(true)

    const prec = 4

    const switchIsType = () =>{
        const typeBtn = document.getElementById("type-btn")
        if(!typeBtn){
            return
        }
        if (isType) {
            setIsType(false)
            typeBtn.style.backgroundImage = "url('/add_btn.png')"
        }
        else {
            setIsType(true)
            typeBtn.style.backgroundImage = "url('/del_btn.png')"
        }
    }
    const switchIsTemp = () =>{
        const tempBtn = document.getElementById("temp-btn")
        if(!tempBtn){
            return
        }
        if (isTemp) {
            setIsTemp(false)
            tempBtn.style.backgroundImage = "url('/add_btn.png')"
        }
        else {
            setIsTemp(true)
            tempBtn.style.backgroundImage = "url('/del_btn.png')"
        }
    }

    useEffect(() => {
        const imgDiv = document.getElementById("img-edit")
        if (!imgDiv){ return }
        const rect = imgDiv.getBoundingClientRect()

        const stage = new Konva.Stage({
        container: 'img-edit',
        width: rect.width,
        height: rect.height,
        });

        const layer = new Konva.Layer();

        const rectRuler = new Konva.Rect({
            width: 100,
            height: 100,
            stroke: 'green',
            draggable: true
        });

        const rectDate = new Konva.Rect({
            width: 100,
            height: 100,
            stroke: 'yellow',
            draggable: true
        });


        if (isType){
            const rectType = new Konva.Rect({
                width: 100,
                height: 100,
                stroke: 'red',
                draggable: true
            });

            layer.add(rectType);

            var tr2 = new Konva.Transformer();
            layer.add(tr2);
            tr2.nodes([rectType]);

            rectType.on('dragmove', function () {
                setType({topLeft: {x: rectType.x(), y: rectType.y()}, 
                rightBottom: {x: rectType.x() + rectType.width(), y: rectType.y() + rectType.height()}});
            });
            rectType.on('transform', function () {
                setType({topLeft: {x: rectType.x(), y: rectType.y()}, 
                rightBottom: {x: rectType.x() + rectType.width(), y: rectType.y() + rectType.height()}});
            });
        }

        if(isTemp){
            const rectTemp = new Konva.Rect({
                width: 100,
                height: 100,
                stroke: 'blue',
                draggable: true
            });

            layer.add(rectTemp);

            var tr4 = new Konva.Transformer();
            layer.add(tr4);
            tr4.nodes([rectTemp]);

            rectTemp.on('dragmove', function () {
                setTemp({topLeft: {x: rectTemp.x(), y: rectTemp.y()}, 
                rightBottom: {x: rectTemp.x() + rectTemp.width(), y: rectTemp.y() + rectTemp.height()}});
            });
            rectTemp.on('transform', function () {
                setTemp({topLeft: {x: rectTemp.x(), y: rectTemp.y()}, 
                rightBottom: {x: rectTemp.x() + rectTemp.width(), y: rectTemp.y() + rectTemp.height()}});
            });
        }

        layer.add(rectRuler);
        layer.add(rectDate);
        stage.add(layer);

        var tr1 = new Konva.Transformer();
        layer.add(tr1);
        tr1.nodes([rectRuler]);

        var tr3 = new Konva.Transformer();
        layer.add(tr3);
        tr3.nodes([rectDate]);

        rectRuler.on('dragmove', function () {
            setRuler({topLeft: {x: rectRuler.x(), y: rectRuler.y()}, 
            rightBottom: {x: rectRuler.x() + rectRuler.width(), y: rectRuler.y() + rectRuler.height()}});
          });
        rectRuler.on('transform', function () {
            setRuler({topLeft: {x: rectRuler.x(), y: rectRuler.y()}, 
            rightBottom: {x: rectRuler.x() + rectRuler.width(), y: rectRuler.y() + rectRuler.height()}});
        });

        rectDate.on('dragmove', function () {
            setDate({topLeft: {x: rectDate.x(), y: rectDate.y()}, 
            rightBottom: {x: rectDate.x() + rectDate.width(), y: rectDate.y() + rectDate.height()}});
        });
        rectDate.on('transform', function () {
            setDate({topLeft: {x: rectDate.x(), y: rectDate.y()}, 
            rightBottom: {x: rectDate.x() + rectDate.width(), y: rectDate.y() + rectDate.height()}});
        });

    }, [isType, isTemp])

    return (
        <div id="img-window">
            <div id="img-edit"></div>
            <div id="img-info">
                <div className="rect-info" id="rect-gauge">
                    <p className='img-text'>Рейка</p>
                    <p className='img-text'>Верхний левый угол: ({ruler.topLeft.x.toPrecision(prec)}, {ruler.topLeft.y.toPrecision(prec)})</p>
                    <p className='img-text'>Нижний правый угол: ({ruler.rightBottom.x.toPrecision(prec)}, {ruler.rightBottom.y.toPrecision(prec)})</p>
                    <p className='img-text'>Высота рейки (см): <input></input></p>
                    <p className='img-text'>Распознанное значение: </p>
                </div>
                <div className="rect-info" id="rect-type">
                    <p className='img-text'>Тип фото</p>
                    {isType ? 
                    <div>
                        <p className='img-text'>Верхний левый угол: ({type.topLeft.x.toPrecision(prec)}, {type.topLeft.y.toPrecision(prec)})</p>
                        <p className='img-text'>Нижний правый угол: ({type.rightBottom.x.toPrecision(prec)}, {type.rightBottom.y.toPrecision(prec)})</p>
                        <p className='img-text'>Распознанное значение: </p>
                    </div> :
                    <p className='img-text'>Отсутствует</p>
                    }
                    <Button id="type-btn" style={{
                        height: 20,
                        background: "url('/del_btn.png')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat"
                    }} onClick={switchIsType}></Button>
                </div>
                <div className="rect-info" id="rect-date">
                    <p className='img-text'>Дата и время</p>
                    <p className='img-text'>Верхний левый угол: ({date.topLeft.x.toPrecision(prec)}, {date.topLeft.y.toPrecision(prec)})</p>
                    <p className='img-text'>Нижний правый угол: ({date.rightBottom.x.toPrecision(prec)}, {date.rightBottom.y.toPrecision(prec)})</p>
                    <p className='img-text'>Распознанное значение: </p>
                </div>
                <div className="rect-info" id="rect-temp">
                    <p className='img-text'>Температура</p>
                    {isTemp ? 
                    <div>
                        <p className='img-text'>Верхний левый угол: ({temp.topLeft.x.toPrecision(prec)}, {temp.topLeft.y.toPrecision(prec)})</p>
                        <p className='img-text'>Нижний правый угол: ({temp.rightBottom.x.toPrecision(prec)}, {temp.rightBottom.y.toPrecision(prec)})</p>
                        <p className='img-text'>Распознанное значение: </p>
                    </div> :
                    <p className='img-text'>Отсутствует</p>
                    }
                    <Button id="temp-btn" style={{
                        height: 20,
                        background: "url('/del_btn.png')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat"
                    }} onClick={switchIsTemp}></Button>
                </div>
            </div>
        </div>
    )
}
export default ImageCoordinates;