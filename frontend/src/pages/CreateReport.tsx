import { HStack, VStack } from '@chakra-ui/react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import Report from '../components/Report';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css'
import ReportContainer from '../components/ReportContainer';

const nodes = [{
    value: 'mars',
    label: 'Mars',
    children: [
      { key: 1, value: 'phobos', label: 'Phobos' },
      { key: 2, value: 'deimos', label: 'Deimos' },
    ],
  }]

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
            </HStack>
            <Link to="/">Назад</Link>
        </VStack>
        
    )
}

export default CreateReport;