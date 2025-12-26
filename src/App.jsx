import React from 'react'
import {Route, Routes} from 'react-router-dom'
import AdminDashboard from './admin/AdminDashboard.jsx'
import Home from './Home.jsx'
import RoleRoute from './ProtectedRoute.jsx'
import AdminLogin from './AdinLoginPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/admin" element={
        <RoleRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </RoleRoute>
      } />
      <Route path="/" element={<Home />} />
      <Route path="/admin-login" element={<AdminLogin />} />
    </Routes>
  )
}

export default App
