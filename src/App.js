import React from 'react';
import Routs from './Routs';
import { BrowserRouter } from 'react-router-dom';


const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routs />
    </BrowserRouter>      
    </>
  );
}
// 
export default App;
