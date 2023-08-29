import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Home from './pages/Home';
import Site from './pages/Site';
import CreateBatch from './pages/CreateBatch';
import CreateReport from './pages/CreateReport';
import './App.css';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
