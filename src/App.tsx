import { useState } from 'react'
import './App.css'
import { Routing } from './router/Routing.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthProvider";

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
