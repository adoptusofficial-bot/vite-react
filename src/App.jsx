import React, {useEffect, useState} from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Instructions from './pages/Instructions'
import Exam from './pages/Exam'
import Result from './pages/Result'
import usersData from './data/users.json'

export default function App(){
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('jee_user')
      return s ? JSON.parse(s) : null
    } catch(e){ return null }
  })
  const navigate = useNavigate()

  useEffect(() => {
    if(!user) navigate('/')
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={u=>{ setUser(u); localStorage.setItem('jee_user', JSON.stringify(u)); navigate('/instructions') }} users={usersData.users} />} />
      <Route path="/instructions" element={<Instructions user={user} />} />
      <Route path="/exam" element={<Exam user={user} />} />
      <Route path="/result" element={<Result user={user} />} />
    </Routes>
  )
}
