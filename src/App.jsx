import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast';
import { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';

export default function App() {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="">
      <Toaster />
      {/* <WelcomeMdl /> */}
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} />
      </Routes>
    </div>
  )
}