import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import NotFound from './pages/NotFound';
import Header from './Components/Header';
import AuthPage from './pages/AuthPage';
import AuthsForm from './Components/AuthsForm';
import { useAuthentication } from './Auth';


function App() {
  {/*const isAuthorized = useAuthentication
  const ProtectedLogin = ()=>{
    return isAuthorized ? 
    <Navigate to='/'/>:<AuthPage initialMethod='login'/>
  }
  const ProtectedRegister = ()=>{
    return isAuthorized ? 
    <Navigate to='/'/>:<AuthPage initialMethod='Register'/>
  }*/}

  return (
    <>
    <div className='container'>
    <BrowserRouter>
    <Navbar/>
   
     <Routes>
      <Route path='*' element={<NotFound/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/header' element={<Header/>}/>
      {/*<Route path='/' element={<Login/>}/>
      <Route path='/' element={<Register/>}/>*/}

      <Route path='/authsForm' element={<AuthsForm/>}/>




     </Routes>
    
    
    
    
    
    </BrowserRouter>





    </div>
      </>
  )
}

export default App
