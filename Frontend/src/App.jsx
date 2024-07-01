import { useState } from 'react'
import Header from './components/Header/Header'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'

import Login from './Pages/Login'
import Register from './Pages/Register'
import Home from './Pages/Home'
import CreatePost from './Pages/CreatePost'
import UpdatePost from './Pages/UpdatePost'
import UpdatePostRoute from './components/Protected Routes/UpdatePostRoute'
import Profile from './Pages/Profile'
import UpdateProfilePage from './Pages/UpdateProfilePage'


function App() {

  function Logout(){
    localStorage.clear()
    return <Navigate to="/login" />
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/update-profile/:id" element={<UpdateProfilePage />} />
        <Route path="/create_post" element={<UpdatePostRoute component="create"><CreatePost /></UpdatePostRoute>} />
        <Route path="/update_post/:id" element={<UpdatePostRoute component="update"><UpdatePost /></UpdatePostRoute>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
