import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import logo from './logo.svg';
import Home from './pages/Home';
import Site from './pages/Site';
import CreateBatch from './pages/CreateBatch';
import CreateReport from './pages/CreateReport';
import './App.css';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create_report" element={<CreateReport/>} />
          <Route path="/site/:siteId/createBatch" element={<CreateBatch/>} />
          <Route path="/site/:siteId" element={<Site/>} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
