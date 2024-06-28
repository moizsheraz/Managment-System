import { useState } from 'react'
import Header from './components/Header/Header'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'

import Login from './Pages/Login'


function App() {

  return (
    <Router>
      <Header />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/logout" element={<Logout />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </Router>
  )
}

export default App
