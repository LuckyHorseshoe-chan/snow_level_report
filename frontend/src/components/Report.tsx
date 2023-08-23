import { useState, useEffect, useRef } from "react";
import { useParams, Link } from 'react-router-dom'
import {
    VStack,
    HStack,
    Button
  } from '@chakra-ui/react'
import ReportContainer from "./ReportContainer";

function Report({activeStep, setActiveStep} : {activeStep: any, setActiveStep: any}){
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<any>([])
    const [graph, setGraph] = useState(0)
    const { siteId } = useParams()

    useEffect(() => {
        //isLoading ? setActiveStep(2) : setActiveStep(3)
        //activeStep == 2 ? setIsLoading(true) : setIsLoading(false)
    }, [activeStep])

    useEffect(() => {
        fetch("http://localhost:8000/batches?site_id=" + siteId, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            return response.json();
        }).then((batches_list) => {
            console.log(batches_list)
            //return batches_list[batches_list.length-1][0]
            return 38
        }).then((batchId) => {
            //const timer = setInterval(() => {
        
            fetch("http://localhost:8000/data_points?batch_id=" + batchId, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }).then((response) => {
                return response.json()
            }).then((data_points) => {
                console.log(data_points)
                let data : any[] = []
                fetch("http://localhost:8000/site?site_id=" + siteId, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }).then((response) => {
                    return response.json();
                }).then((site) => {
                    for (let i = 0; i < data_points.length; i++){
                        data_points[i][2]["name"] = site["name"]
                        data.push(data_points[i][2])
                    }
                    setData(data.sort(function(a: any, b: any){
                        if (a.datetime > b.datetime){
                            return 1
                        } else if(a.datetime < b.datetime){
                            return -1
                        }
                        return 0;
                    }))
                })
                console.log(data)
            })
            return

            //}, 10000)
            //return () => clearInterval(timer);
        }) 
    }, [graph])

    const acceptResult = (e: any) => {
        fetch("http://localhost:8000/batch/status?status=accepted", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        })
    }

    const downloadMistakes = () => {
        const link = document.createElement('a')
        link.download = 'Mistakes'

        link.href = "http://localhost:8080/static/CALM.zip"

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
            <ReportContainer data={data}/>
            {isLoading ? 
            <Button isLoading loadingText="Обработка данных"/> :
            <HStack>
                <Button onClick={downloadMistakes}>Скачать ошибки</Button>
                <Button onClick={downloadReport}>Скачать отчёт</Button>
                <Link to="/">
                    <Button onClick={acceptResult}>Принять результат</Button>
                </Link>
                <Link to="/">
                    <Button>Не использовать результат</Button>
                </Link>
            </HStack>
            }
        </VStack>
    )
}
export default Report;