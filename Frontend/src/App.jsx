import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ACCESS_TOKEN } from './varibales'

import Login from './Pages/Login'
import Register from './Pages/Register'
import Home from './Pages/Home'
import CreatePost from './Pages/CreatePost'
import UpdatePost from './Pages/UpdatePost'
import UpdatePostRoute from './components/Protected Routes/UpdatePostRoute'
import Profile from './Pages/Profile'
import UpdateProfilePage from './Pages/UpdateProfilePage'
import ForgotPasswordPage from './Pages/ForgotPasswordPage'
import FollowUnFollowPage from './Pages/FollowUnFollowPage'
import UserPage from './Pages/UserPage'
import NotFound from './components/Protected Routes/NotFound'


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
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/follow" element={<FollowUnFollowPage/>} />
        <Route path="/users" element={<UserPage/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  )
}

export default App
