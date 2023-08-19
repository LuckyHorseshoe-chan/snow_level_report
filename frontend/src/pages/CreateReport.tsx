import { HStack, VStack } from '@chakra-ui/react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import Report from '../components/Report';
import CheckboxTree from 'react-checkbox-tree';
import ReportContainer from '../components/ReportContainer';

const nodes = [{
    value: 'mars',
    label: 'Mars',
    children: [
        { value: 'phobos', label: 'Phobos' },
        { value: 'deimos', label: 'Deimos' },
    ],
}];

function CreateReport(){
    const [checked, setChecked] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string[]>([]);
    return(
        <VStack>
            <HStack>
                <div id="file-tree">
                    <CheckboxTree
                        nodes={nodes}
                        checked={checked}
                        expanded={expanded}
                        onCheck={(checked) => setChecked(checked)}
                        onExpand={(expanded) => setExpanded(expanded)}
                    />
                </div>
                <ReportContainer data={""}/>
            </HStack>
            <Link to="/">Назад</Link>
        </VStack>
        
    )
}

export default CreateReport;