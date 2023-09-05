import { HStack, VStack, Checkbox, Stack, Box, Button } from '@chakra-ui/react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import {
    useQuery
  } from '@tanstack/react-query'
import axios from 'axios'
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
            checked = checked.filter(function(value, index) {
                return indxs.indexOf(index) == -1;
            })
            setCheckedBatches(checked)
        }
    }

    const downloadReport = () => {
        const link = document.createElement('a')
        link.download = 'Report'

        link.href = "http://localhost:8080/app/report.xlsx"

        link.click()
    }
    
    return(
        <VStack style={{margin: '3vh 0vh'}}>
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
                                <div>{isFetching ? 'Обновление...' : ' '}</div>
                            </Stack>
                        )}
                </div>
                <VStack>
                    <ReportContainer ids={checkedBatches}/>
                    <Button onClick={downloadReport}>Скачать отчёт</Button>
                </VStack>
            </HStack>
            <Link to="/">Назад</Link>
        </VStack>
        
    )
}

export default CreateReport;