import React, { FC } from 'react';
import './App.css';
import {   AuthPage, InformationBar, PageManagementBar, ShopPage } from './modules';
import { FaCopyright } from 'react-icons/fa';
import { PagesSwitch } from './types';
import { usePageState } from './shared/hooks';
import { CartPage } from './modules/pages/cart-page/cart-page';
import { OtherPage } from './modules/pages/other-page/other-page';



const PageHash:{[key in PagesSwitch]:FC}= {
  shopping: ShopPage,
  cart: CartPage,
  login: AuthPage,
  other: OtherPage
}

function App() {

  const {page,setPage} = usePageState()

  const Component = PageHash[page]

  return (
    <div className="App" style={{maxWidth:"1000px", minWidth:"550px", marginInline:"auto"}}>
      <InformationBar/>
      <PageManagementBar/>
      <Component/>
      <div style={{height:"100%", background:"red", color:"white", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", marginTop:"30px"}}>
          <FaCopyright/> Christian Gabriel Vargas Solano Full Stack Developer
      </div>
    </div>
  );
}

export default App;
