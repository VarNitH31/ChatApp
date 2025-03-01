import React from 'react'
import { Route ,BrowserRouter,Routes } from "react-router-dom";
import Home from './components/Home';
import Room from './components/Room';
function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>} >  </Route>
            <Route path='/room/:roomId/:userName' element={<Room/>} >  </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
