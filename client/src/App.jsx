import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './components/HomePage.jsx'
import Navbar from './components/Navbar.jsx'
import Reactflow from './components/Reactflow.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Workflow from './pages/WorkFlow.jsx'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const handleLogin = () => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
 

  return (
    <div className=' h-screen flex flex-col items-center justify-center'>
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
        OnLoginSuccess={handleLogin}
      />
      
      <Routes>
        <Route path="/" element={<HomePage isAuthenticated={isAuthenticated}/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-workflow" element={<Reactflow />} />
        <Route path="/workflow/:id" element={<Workflow />} />
        
      </Routes>
    
    </div>
  )
}

export default App
