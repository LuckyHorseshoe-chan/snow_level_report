import { Button, HStack, VStack } from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import Konva from 'konva'

function ImageCoordinates({setActiveStep} : {setActiveStep: any}){
    const [imgSize, setImgSize] = useState({width: 0, height: 0})
    const [info, setInfo] = useState({type: '', date: '', time: '', temperature: ''})
    const [snowHeight, setSnowHeight] = useState(0)
    const [ruler, setRuler] = useState({topLeft: {x: 0, y: 0}, rightBottom: {x: 0, y: 0}})
    const [type, setType] = useState({topLeft: {x: 0, y: 0}, rightBottom: {x: 0, y: 0}})
    const [date, setDate] = useState({topLeft: {x: 0, y: 0}, rightBottom: {x: 0, y: 0}})
    const [temp, setTemp] = useState({topLeft: {x: 0, y: 0}, rightBottom: {x: 0, y: 0}})
    const [imgPath, setImgPath] = useState("")
    const [rulerHeight, setRulerHeight] = useState(0)

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
        setImgSize({width: rect.width, height: rect.height})
        console.log(imgSize)

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
                rightBottom: {x: rectType.x() + rectType.width() * rectType.scaleX(), 
                    y: rectType.y() + rectType.height() * rectType.scaleY()}});
            });
            rectType.on('transform', function () {
                setType({topLeft: {x: rectType.x(), y: rectType.y()}, 
                rightBottom: {x: rectType.x() + rectType.width() * rectType.scaleX(),
                     y: rectType.y() + rectType.height() * rectType.scaleY()}});
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
                rightBottom: {x: rectTemp.x() + rectTemp.width() * rectTemp.scaleX(), 
                    y: rectTemp.y() + rectTemp.height() * rectTemp.scaleY()}});
            });
            rectTemp.on('transform', function () {
                setTemp({topLeft: {x: rectTemp.x(), y: rectTemp.y()}, 
                rightBottom: {x: rectTemp.x() + rectTemp.width() * rectTemp.scaleX(), 
                    y: rectTemp.y() + rectTemp.height() * rectTemp.scaleY()}});
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
            rightBottom: {x: rectRuler.x() + rectRuler.width() * rectRuler.scaleX(), 
                y: rectRuler.y() + rectRuler.height() * rectRuler.scaleY()}});
          });
        rectRuler.on('transform', function () {
            setRuler({topLeft: {x: rectRuler.x(), y: rectRuler.y()}, 
            rightBottom: {x: rectRuler.x() + rectRuler.width() * rectRuler.scaleX(), 
                y: rectRuler.y() + rectRuler.height() * rectRuler.scaleY()}});
        });

        rectDate.on('dragmove', function () {
            setDate({topLeft: {x: rectDate.x(), y: rectDate.y()}, 
            rightBottom: {x: rectDate.x() + rectDate.width() * rectDate.scaleX(), 
                y: rectDate.y() + rectDate.height() * rectDate.scaleY()}});
        });
        rectDate.on('transform', function () {
            setDate({topLeft: {x: rectDate.x(), y: rectDate.y()}, 
            rightBottom: {x: rectDate.x() + rectDate.width() * rectDate.scaleX(), 
                y: rectDate.y() + rectDate.height() * rectDate.scaleY()}});
        });

    }, [isType, isTemp])

    const loadPhoto = () => {
        const imgDiv = document.getElementById("img-edit")
        fetch("http://localhost:8000/img_path", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            return response.json()
        }).then((data) => {
            setImgPath(data.img_url)
            console.log(data.img_url)
            if (imgDiv){
                imgDiv.style.backgroundImage = "url('http://localhost:8080/static/" + data.img_url + "')"
            }
        })
    }

    const recognizeData = () => {
        const textCoordinates = {
            "img_path": imgPath,
            "strip_size": ori_height - calculateY(Math.max(type.topLeft.y, date.topLeft.y, temp.topLeft.y)),
            "type": [calculateX(type.topLeft.x), calculateX(type.rightBottom.x)],
            "datetime": [calculateX(date.topLeft.x), calculateX(date.rightBottom.x)],
            "temperature": [calculateX(temp.topLeft.x), calculateX(temp.rightBottom.x)]
        }
        console.log(textCoordinates)
        console.log(textCoordinates)
        fetch("http://localhost:8000/text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(textCoordinates)
        }).then((response) => {
            return response.json()
        }).then((data) => {
            setInfo({type: data['type'], date: data['date'] , time: data['time'], temperature: data['temperature']})
        })

        const rulerCoordinates = {
            "img_path": imgPath,
            "topLeft": [calculateX(ruler.topLeft.x), calculateY(ruler.topLeft.y)],
            "rightBottom": [calculateX(ruler.rightBottom.x), calculateY(ruler.rightBottom.y)],
            "rulerHeight": rulerHeight
        }
        console.log(rulerCoordinates)
        console.log(JSON.stringify(rulerCoordinates))
        fetch("http://localhost:8000/ruler_height", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rulerCoordinates)
        }).then((response) => {
            return response.json()
        }).then((data) => {
            setSnowHeight(data["snow_height"])
        })
    }

    const onChange = (e: any) => {
        setRulerHeight(e.target.value)
    }

    const ori_width = 4032
    const ori_height = 3024

    const calculateX = (x: number) => {
        return x * ori_width / imgSize.width
    }

    const calculateY = (y: number) => {
        return y * ori_height / imgSize.height
    }

    return (
        <VStack>
            <div id="img-window">
            <div id="img-edit"></div>
            <div id="img-info">
                <div className="rect-info" id="rect-gauge">
                    <p className='img-text'>Рейка</p>
                    <p className='img-text'>
                        Верхний левый угол: ({calculateX(ruler.topLeft.x).toPrecision(prec)}, {calculateY(ruler.topLeft.y).toPrecision(prec)})
                    </p>
                    <p className='img-text'>
                        Нижний правый угол: ({calculateX(ruler.rightBottom.x).toPrecision(prec)}, {calculateY(ruler.rightBottom.y).toPrecision(prec)})
                    </p>
                    <p className='img-text'>Высота рейки (см): <input onChange={onChange}></input></p>
                    <p className='img-text'>Распознанное значение (см): {Number(snowHeight).toPrecision(prec)}</p>
                </div>
                <div className="rect-info" id="rect-type">
                    <p className='img-text'>Тип фото</p>
                    {isType ? 
                    <div>
                        <p className='img-text'>
                            Верхний левый угол: ({calculateX(type.topLeft.x).toPrecision(prec)}, {calculateY(type.topLeft.y).toPrecision(prec)})
                        </p>
                        <p className='img-text'>
                            Нижний правый угол: ({calculateX(type.rightBottom.x).toPrecision(prec)}, {calculateY(type.rightBottom.y).toPrecision(prec)})
                        </p>
                        <p className='img-text'>Распознанное значение: {info.type}</p>
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
                    <p className='img-text'>
                        Верхний левый угол: ({calculateX(date.topLeft.x).toPrecision(prec)}, {calculateY(date.topLeft.y).toPrecision(prec)})
                    </p>
                    <p className='img-text'>
                        Нижний правый угол: ({calculateX(date.rightBottom.x).toPrecision(prec)}, {calculateY(date.rightBottom.y).toPrecision(prec)})
                    </p>
                    <p className='img-text'>Распознанное значение: {info.date} {info.time}</p>
                </div>
                <div className="rect-info" id="rect-temp">
                    <p className='img-text'>Температура</p>
                    {isTemp ? 
                    <div>
                        <p className='img-text'>
                            Верхний левый угол: ({calculateX(temp.topLeft.x).toPrecision(prec)}, {calculateY(temp.topLeft.y).toPrecision(prec)})
                        </p>
                        <p className='img-text'>
                            Нижний правый угол: ({calculateX(temp.rightBottom.x).toPrecision(prec)}, {(temp.rightBottom.y).toPrecision(prec)})
                        </p>
                        <p className='img-text'>Распознанное значение: {info.temperature}</p>
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
            <HStack>
                <Button onClick={loadPhoto}>Попробовать случайную фотографию из набора</Button>
                <Button onClick={recognizeData}>Распознать</Button>
                <Button onClick={() => {setActiveStep(2)}}>Обработать набор данных</Button>
            </HStack>
        </VStack>
    )
}
export default ImageCoordinates;