import './App.css'
import { Routing } from './router/Routing.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthProvider";

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routing />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
