import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Companies from './pages/Companies'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const savedLogin = localStorage.getItem("isLoggedIn");

    if (savedLogin) {
        setIsLoggedIn(JSON.parse(savedLogin));
    }
  }, []);

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <Routes>
        <Route path='/' element={
          <Home
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
          }
        />
        <Route path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path='/register' element={<Register />} />
        <Route path='/company' element={<Companies />} />
      </Routes>
    </>
  )
}

export default App