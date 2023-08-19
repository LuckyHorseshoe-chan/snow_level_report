import { useState, useEffect, useRef } from "react";
import {
    VStack,
    HStack,
    Button
  } from '@chakra-ui/react'
import ReportContainer from "./ReportContainer";

function Report({setActiveStep} : {setActiveStep: any}){
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        isLoading ? setActiveStep(2) : setActiveStep(3)
    }, [isLoading])
    const data = [
        {name: '13-03-2023', temp: 0, snow: 10}, 
        {name: '14-03-2023', temp: -4, snow: 14},
        {name: '15-03-2023', temp: -8, snow: 14},
        {name: '16-03-2023', temp: -5, snow: 12},
        {name: '17-03-2023', temp: -2, snow: 11},
        {name: '18-03-2023', temp: 0, snow: 9}, 
        {name: '19-03-2023', temp: -3, snow: 14},
        {name: '20-03-2023', temp: -7, snow: 15},
        {name: '30-03-2023', temp: -10, snow: 15},
        {name: '31-03-2023', temp: -10, snow: 16},
    ];
    return (
        <VStack>
            <ReportContainer data={data}/>
            {isLoading ? 
            <Button isLoading loadingText="Обработка данных"/> :
            <HStack>
                <Button>Скачать отчёт</Button>
                <Button>Принять результат</Button>
                <Button>Не использовать результат</Button>
            </HStack>
            }
        </VStack>
    )
}
export default Report;