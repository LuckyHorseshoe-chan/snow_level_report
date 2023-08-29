import { HStack, VStack, Checkbox, Stack, Box, Button } from '@chakra-ui/react'
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom'
import {
    useQuery,
    useQueryClient
  } from '@tanstack/react-query'
import axios from 'axios'
import Report from '../components/Report';
import ReportContainer from '../components/ReportContainer';

const getBatchTree = async () => {
    const { data } = await axios.get("http://localhost:8000/batch_tree")
    return data  
}

function useBatchTree() {
    return useQuery({
        queryKey: ['batchTree'],
        queryFn: () => getBatchTree(),
    })
}

function CreateReport(){
    const { status, data, isFetching } = useBatchTree()

    const [checkedSites, setCheckedSites] = useState<number[]>([])
    const [checkedBatches, setCheckedBatches] = useState<number[]>([])
    const [reportData, setReportData] = useState<any>([])

    const checkBatch = (batchId: number) => (e: any) => {
        e.target.checked ? 
        setCheckedBatches([...checkedBatches, batchId]) :
        setCheckedBatches([
            ...checkedBatches.slice(0, checkedBatches.indexOf(batchId)), 
            ...checkedBatches.slice(checkedBatches.indexOf(batchId) + 1)
        ])
    }

    const checkSite = (batches: any, siteId: number) => (e: any) => {
        let checked: number[] = []
        if(e.target.checked){
            setCheckedSites([...checkedSites, siteId])
            for (let i = 0; i < batches.length; i++){
                if(checkedBatches.indexOf(batches[i].batch_id) < 0) checked.push(batches[i].batch_id)
            }
            //console.log(checkedBatches)
            setCheckedBatches([...checkedBatches, ...checked])
        } 
        else{
            checked = checkedBatches
            setCheckedSites([
                ...checkedSites.slice(0, checkedSites.indexOf(siteId)), 
                ...checkedSites.slice(checkedSites.indexOf(siteId) + 1)
            ])
            let indxs: number[] = []
            for (let i = 0; i < batches.length; i++){
                indxs.push(checked.indexOf(batches[i].batch_id))
            }
            //console.log(indxs)
            checked = checked.filter(function(value, index) {
                return indxs.indexOf(index) == -1;
            })
            //console.log(checked)
            setCheckedBatches(checked)
        }
        //console.log(checkedBatches)
    }

    const showReport = (e: any) => {
        fetch("http://localhost:8000/report/data_points", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"batches": checkedBatches})
        })
        .then((res) => res.json())
        .then((report_data) => setReportData(report_data.sort(function(a: any, b: any){
            if (a.datetime > b.datetime){
                return 1
            } else if(a.datetime < b.datetime){
                return -1
            }
            return 0;
        })))
        console.log(reportData)
    }

    const downloadReport = () => {
        const link = document.createElement('a')
        link.download = 'Report'

        link.href = "http://localhost:8080/static/report.xlsx"

        link.click()
    }
    // useEffect(() => {
    //     if(data){
    //         for(let i = 0; i < data.length; i++){
    //             setCheckedSites([...checkedSites.slice(0, i), false, ...checkedSites.slice(i + 1)])
    //             let checked = []
    //             for (let j = 0; j < data[i]["batches"].length; j++){
    //                 checked.push(false)
    //             }
    //             setCheckedBatches([...checkedBatches.slice(0, i), checked, ...checkedBatches.slice(i + 1)])
    //         }
    //     }
    // }, [data])

    // const checkSite = (i: number) => (e: any) => {
    //     console.log(checkedSites)
    //     setCheckedSites([
    //         ...checkedSites.slice(0, i),
    //         e.target.checked,
    //         ...checkedSites.slice(i + 1)
    //     ])
    //     console.log(checkedSites)
    // }

    // const checkBatch = (i: number) => (e: any) => {
    //     console.log(checkedBatches)
    //     setCheckedBatches([
    //         ...checkedBatches.slice(0, i),
    //         e.target.checked,
    //         ...checkedBatches.slice(i + 1)
    //     ])
    //     console.log(checkedBatches)
    // }
    
    return(
        <VStack>
            <HStack>
                <div id="file-tree">
                {status === 'loading' ? (
                    'Loading...'
                    ) : status === 'error' ? (
                    <span>Error</span>
                    ) : (
                        <Stack>
                            {data.map((site: any, i: number) => (
                                <Box key={i}>
                                    <Checkbox 
                                        key={i}
                                        isChecked={checkedSites.indexOf(site.site_id) > -1}
                                        onChange={checkSite(site.batches, site.site_id)}>
                                        {site.name}
                                    </Checkbox>
                                    <Stack pl={6}>
                                        {site.batches.map((batch: any, j: number) => (
                                            <Checkbox 
                                                key={batch.batch_id}
                                                isChecked={checkedBatches.indexOf(batch.batch_id) > -1}
                                                onChange={checkBatch(batch.batch_id)}>
                                                {batch.name}
                                            </Checkbox>
                                        ))}
                                    </Stack>
                                </Box>
                            ))}
                            <div>{isFetching ? 'Tree Updating...' : ' '}</div>
                        </Stack>
                    )}
                </div>
                <VStack>
                    <ReportContainer data={reportData}/>
                    <HStack>
                        <Button onClick={showReport}>Вывести отчёт</Button>
                        <Button onClick={downloadReport}>Скачать отчёт</Button>
                    </HStack>
                </VStack>
            </HStack>
            <Link to="/">Назад</Link>
        </VStack>
        
    )
}

export default CreateReport;