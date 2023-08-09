import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import logo from './logo.svg';
import Home from './pages/Home';
import Object from './pages/Object';
import CreateBatch from './pages/CreateBatch';
import CreateReport from './pages/CreateReport';
import './App.css';

function App() {
  return (
    <ChakraProvider>
      <CreateBatch/>
    </ChakraProvider>
  );
}

export default App;
