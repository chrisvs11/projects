import React from 'react';
import './App.css';
import { HomeScreen } from 'modules';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginScreen } from 'modules/pages/log-in-screen/login-screen';
import { useActiveUser } from 'shared/hooks';


function App() {
  const {activeUser} = useActiveUser()


  return (
    
  <div style={{height:"100vh", background:"black"}}>
  <BrowserRouter>
      {!activeUser ? (<LoginScreen/>)
      :(
      <Routes>
      <Route path="/" element={<LoginScreen/>}/>
      <Route path='/home' element={<HomeScreen/>}/>
    </Routes>
      )}
  </BrowserRouter>
  </div>

  );
}

export default App;
