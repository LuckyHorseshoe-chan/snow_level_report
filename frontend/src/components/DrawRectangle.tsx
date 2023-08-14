import {useEffect, useRef, useState} from 'react';

const DrawRectangle = () => {
    const canvasRef = useRef<any>(null);
    const contextRef = useRef<any>(null);

    const [isDrawing, setIsDrawing] = useState(false);

    const canvasOffSetX = useRef<any>(null);
    const canvasOffSetY = useRef<any>(null);
    const startX = useRef<any>(null);
    const startY = useRef<any>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 1000;
        canvas.height = 750;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;

        const canvasOffSet = canvas.getBoundingClientRect();
        canvasOffSetX.current = canvasOffSet.left;
        canvasOffSetY.current = canvasOffSet.top;
        console.log(canvasOffSetX.current)
        console.log(canvasOffSetY.current)
    }, []);

    const startDrawingRectangle = ({nativeEvent} : {nativeEvent: any}) => {
        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();

        startX.current = nativeEvent.clientX - canvasOffSetX.current;
        startY.current = nativeEvent.clientY - canvasOffSetY.current;

        setIsDrawing(true);
    };

    const drawRectangle = ({nativeEvent} : {nativeEvent: any}) => {
        if (!isDrawing) {
            return;
        }

        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();

        const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
        const newMouseY = nativeEvent.clientY - canvasOffSetY.current;

        const rectWidht = newMouseX - startX.current;
        const rectHeight = newMouseY - startY.current;

        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        contextRef.current.strokeRect(startX.current, startY.current, rectWidht, rectHeight);
    };

    const stopDrawingRectangle = () => {
        setIsDrawing(false);
    };

    return (
        <div>
            <canvas id="img-edit"
                ref={canvasRef}
                onMouseDown={startDrawingRectangle}
                onMouseMove={drawRectangle}
                onMouseUp={stopDrawingRectangle}
                onMouseLeave={stopDrawingRectangle}>
            </canvas>
        </div>
    )
}

export default DrawRectangle;