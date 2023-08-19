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
    Box
  } from '@chakra-ui/react'

function ReportContainer({data}: {data: any}){
    return (
        <div id="report-container">
                <div className="report-graph">
                    <ResponsiveContainer>
                        <ComposedChart data={data}>
                            <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#8884d8" />
                            <Line yAxisId="right" type="monotone" dataKey="snow" stroke="#82ca9d"/>
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                        </ComposedChart >
                    </ResponsiveContainer>
                </div>
                <div className="report-table">
                    <Box overflowY="auto" maxHeight="30vh">
                        <TableContainer>
                            <Table variant='simple' colorScheme="teal">
                                <TableCaption>Imperial to metric conversion factors</TableCaption>
                                    <Thead bgColor="grey">
                                        <Tr>
                                            <Th>To convert</Th>
                                            <Th>into</Th>
                                            <Th isNumeric>multiply by</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>inches</Td>
                                            <Td>millimetres (mm)</Td>
                                            <Td isNumeric>25.4</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>feet</Td>
                                            <Td>centimetres (cm)</Td>
                                            <Td isNumeric>30.48</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>yards</Td>
                                            <Td>metres (m)</Td>
                                            <Td isNumeric>0.91444</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>inches</Td>
                                            <Td>millimetres (mm)</Td>
                                            <Td isNumeric>25.4</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>feet</Td>
                                            <Td>centimetres (cm)</Td>
                                            <Td isNumeric>30.48</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>yards</Td>
                                            <Td>metres (m)</Td>
                                            <Td isNumeric>0.91444</Td>
                                        </Tr>
                                    </Tbody>
                                    <Tfoot>
                                    <Tr>
                                        <Th>To convert</Th>
                                        <Th>into</Th>
                                        <Th isNumeric>multiply by</Th>
                                    </Tr>
                                    </Tfoot>
                            </Table>
                        </TableContainer>
                    </Box>
                </div>
            </div>
    )
}
export default ReportContainer;