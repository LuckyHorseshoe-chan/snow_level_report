import { useState, useEffect, useRef } from "react";
import { 
    Line, 
    CartesianGrid, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ComposedChart, 
    ResponsiveContainer  
} from 'recharts';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Box,
    Select,
    HStack,
    VStack
  } from '@chakra-ui/react'
import {
    useQuery
} from '@tanstack/react-query'
import axios from 'axios'

const getDataPoints = async (ids: number[]) => {
    console.log(JSON.stringify({"batches": ids}))
    const { data } = await axios.post(
        "http://localhost:8000/report/data_points",
        JSON.stringify({"batches": ids}), {
            headers: {
              'Content-Type': 'application/json'
            }
        }
    )
    console.log(ids)
    console.log(data)
    return data.sort(function(a: any, b: any){
        if (a.datetime > b.datetime){
            return 1
        } else if(a.datetime < b.datetime){
            return -1
        }
        return 0;
    })
}
function useDataPoints(ids: number[]){
    return useQuery({
        queryKey: ['dataPoints'],
        queryFn: () => getDataPoints(ids),
    })
}

function ReportContainer({ids}: {ids: number[]}){
    const { status, data, isFetching } = useDataPoints(ids)

    const [minInd, setMinInd] = useState(0)
    const [maxInd, setMaxInd] = useState(0)
    const [dataSlice, setDataSlice] = useState([])
    const [reportType, setReportType] = useState<string>('daily')

    const prec = 3

    useEffect(() => {
        if (data){
            const dailyReport = data.slice(minInd, maxInd)
            const monthReport = monthlyReport(dailyReport)
            if (reportType === 'daily') setDataSlice(dailyReport)
            else setDataSlice(monthReport)
            const report_data = {
                'daily': dailyReport,
                'monthly': monthReport
            }
            fetch("http://localhost:8000/form_report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(report_data)
            })
        }
    }, [minInd, maxInd, data])

    const selectMinDate = (e: any) => {
        console.log(e.target.value)
        setMinInd(Number(e.target.value))
    }

    const selectMaxDate = (e: any) => {
        console.log(e.target.value)
        console.log(data)
        setMaxInd(Number(e.target.value)+1)
    }

    const selectReportType = (e: any) => {
        setReportType(e.target.value)
        if (e.target.value == 'daily'){
            setDataSlice(data.slice(minInd, maxInd))
        } else{
            setDataSlice(monthlyReport(data.slice(minInd, maxInd)))
        }
    }

    const average = (arr: any) => {
        return arr.reduce( ( p: number, c: number) => p + c, 0 ) / arr.length
    }
    const monthlyReport = (report: any) => {
        if (!report) return []
        let newReport : any = []
        let years : any = []
        let reportDict : any = {}
        for (let i = 0; i < report.length; i++){
            let month = report[i].datetime.slice(5, 7)
            let year = report[i].datetime.slice(0, 4)
            if (years.includes(year)){
                if(reportDict[year].months.includes(month)){
                    reportDict[year].monthData[month].temp.push(report[i].temp)
                    if (report[i].ruler === -999){
                        continue
                    }
                    reportDict[year].monthData[month].ruler.push(report[i].ruler)
                    if (report[i].ruler > reportDict[year].monthData[month].maxSnow){
                        reportDict[year].monthData[month].maxSnow = report[i].ruler
                        reportDict[year].monthData[month].maxSnowDate = report[i].datetime
                    }
                    if (report[i].ruler < reportDict[year].monthData[month].minSnow){
                        reportDict[year].monthData[month].minSnow = report[i].ruler
                        reportDict[year].monthData[month].minSnowDate = report[i].datetime
                    }
                } else{
                    reportDict[year].months.push(month)
                    if (report[i].ruler !== -999) reportDict[year].monthData[month] = {temp: [report[i].temp], ruler: [report[i].ruler], 
                        maxSnow: report[i].ruler, minSnow: report[i].ruler, 
                        maxSnowDate: report[i].datetime, minSnowDate: report[i].datetime}
                    else reportDict[year].monthData[month] = {temp: [report[i].temp], ruler: [], 
                        maxSnow: -999, minSnow: 999, 
                        maxSnowDate: report[i].datetime, minSnowDate: report[i].datetime}
                }
            } else {
                years.push(year)
                reportDict[year] = {months: [month], monthData: {}}
                reportDict[year].monthData[month] = {temp: [report[i].temp], ruler: [report[i].ruler], maxSnow: report[i].ruler, 
                    minSnow: report[i].ruler, maxSnowDate: report[i].datetime, minSnowDate: report[i].datetime}
            }
        }
        console.log(data)
        console.log(reportDict)
        for (let i = 0; i < years.length; i++){
            let months = reportDict[years[i]].months
            for (let j = 0; j < months.length; j++) {
                let monthData = reportDict[years[i]].monthData[months[j]]
                newReport.push({datetime: years[i] + '-' + months[j],
                                name: data[0].name,
                                ruler: average(monthData.ruler),
                                temp: average(monthData.temp),
                                maxSnow: monthData.maxSnow,
                                maxSnowDate: monthData.maxSnowDate,
                                minSnow: monthData.minSnow,
                                minSnowDate: monthData.minSnowDate 
                })
            }
        }
        return newReport
    }

    return (
        <VStack>
            {data ? 
                <div>
                    <HStack>
                        <Select size='xs' defaultValue='daily' onChange={selectReportType}>
                            <option value='daily'>По дням</option>
                            <option value='monthly'>По периодам</option>
                        </Select>
                        <Select size='xs' defaultValue="0" onChange={selectMinDate}>
                            {data.map((row: any, i: any) => (
                                row ? <option value={i}>{row.datetime}</option> : <div></div>
                            ))}
                        </Select>
                        <Select size='xs' defaultValue='0' onChange={selectMaxDate}>
                            {data.map((row: any, i: any) => (
                                row ? <option value={i}>{row.datetime}</option> : <div></div>
                            ))}
                        </Select>
                    </HStack>
                    {status === 'loading' ? (
                        'Загрузка...'
                        ) : status === 'error' ? (
                        <span>Не удалось загрузить данные</span>
                        ) : (
                            <div id="report-container">
                                <ResponsiveContainer>
                                    <ComposedChart data={dataSlice}>
                                        <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#8884d8" />
                                        <Line yAxisId="right" type="monotone" dataKey="ruler" stroke="#82ca9d"/>
                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                        <XAxis dataKey="datetime" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                    </ComposedChart >
                                </ResponsiveContainer>
                                <Box overflowY="auto" maxHeight="30vh">
                                    <TableContainer>
                                        <Table variant='simple' colorScheme="teal">
                                            <Thead bgColor="grey">
                                                    {reportType === 'daily' ?
                                                        <Tr>
                                                            <Th>Gauge-Name</Th>
                                                            <Th>Date</Th>
                                                            <Th isNumeric>Snow depth, cm</Th>
                                                            <Th isNumeric>Temperature, ℃</Th>
                                                        </Tr> :
                                                        <Tr>
                                                            <Th>Gauge-Name</Th>
                                                            <Th isNumeric>Month</Th>
                                                            <Th isNumeric>Year</Th>
                                                            <Th isNumeric>Average snow depth, cm</Th>
                                                            <Th isNumeric>Average temperature, ℃</Th>
                                                            <Th isNumeric>Maximum snow depth, cm</Th>
                                                            <Th>Date of maximum snow depth</Th>
                                                            <Th isNumeric>Minimum snow depth, cm</Th>
                                                            <Th>Date of minimum snow depth</Th>
                                                        </Tr>
                                                    }
                                            </Thead>
                                            {reportType === 'daily' ? 
                                                <Tbody>
                                                    {dataSlice.map((row: any) => (
                                                        <Tr>
                                                            <Th>{row.name}</Th>
                                                            <Th>{row.datetime}</Th>
                                                            <Th isNumeric>{row.ruler.toPrecision(prec)}</Th>
                                                            <Th isNumeric>{row.temp.toPrecision(prec)}</Th>
                                                        </Tr>
                                                    ))}
                                                </Tbody>:
                                                <Tbody>
                                                    {dataSlice.map((row: any) => (
                                                        <Tr>
                                                            <Th>{row.name}</Th>
                                                            <Th isNumeric>{row.datetime.slice(5, 7)}</Th>
                                                            <Th isNumeric>{row.datetime.slice(0, 4)}</Th>
                                                            <Th isNumeric>{row.ruler.toPrecision(prec)}</Th>
                                                            <Th isNumeric>{row.temp.toPrecision(prec)}</Th>
                                                            <Th isNumeric>{row.maxSnow.toPrecision(prec)}</Th>
                                                            <Th>{row.maxSnowDate}</Th>
                                                            <Th isNumeric>{row.minSnow.toPrecision(prec)}</Th>
                                                            <Th>{row.minSnowDate}</Th>
                                                        </Tr>
                                                    ))}
                                                </Tbody> 
                                            }
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </div>
                        )}
                    <div>{isFetching ? 'Обновление...' : ' '}</div>
                </div>
                : <span>Загрузка...</span>}
        </VStack>
    )
}
export default ReportContainer;