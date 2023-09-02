import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import {
    VStack,
    HStack,
    Button
  } from '@chakra-ui/react'
import ReportContainer from "./ReportContainer";

function Report({activeStep, setActiveStep} : {activeStep: any, setActiveStep: any}){
    const [status, setStatus] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            if (activeStep == 2) {
                fetch("http://localhost:8000/tasks_status", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }).then((response) => {
                    return response.json()
                }).then((status) => {
                    if (status["status"] == "success"){
                        setActiveStep(3)
                    }
                })
            }
        }, 10000)

        return () => clearInterval(timer)
    })

    const clearFolder = () => {
        fetch("http://localhost:8000/clear_static", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
    }

    const acceptResult = (e: any) => {
        fetch("http://localhost:8000/batch/status?status=accepted", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        })
        clearFolder()
    }

    const rejectResult = (e: any) => {
        clearFolder()
    }

    const downloadMistakes = () => {
        const link = document.createElement('a')
        link.download = 'Mistakes'

        link.href = "http://localhost:8080/static/errors.zip"

        link.click()
    }
    const downloadReport = () => {
        const link = document.createElement('a')
        link.download = 'Report'

        link.href = "http://localhost:8080/static/report.xlsx"

        link.click()
    }

    return (
        <VStack>
            <ReportContainer ids={[-1]}/>
            {activeStep == 2 ? 
            <Button isLoading loadingText="Обработка данных"/> :
            <HStack>
                <Button onClick={downloadMistakes}>Скачать ошибки</Button>
                <Button onClick={downloadReport}>Скачать отчёт</Button>
                <Link to="/">
                    <Button onClick={acceptResult} style={{color: 'white', background: 'green'}}>Принять результат</Button>
                </Link>
                <Link to="/">
                    <Button onClick={rejectResult} style={{color: 'white', background: 'red'}}>Не использовать результат</Button>
                </Link>
            </HStack>
            }
        </VStack>
    )
}
export default Report;