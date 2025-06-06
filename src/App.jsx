import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast';
import { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import WelcomeMdl from './components/WelcomeMdl';
import { generateToken, messaging } from './libs/firebase';
import { onMessage } from 'firebase/messaging';

export default function App() {
  const { authUser } = useContext(AuthContext);
  // useEffect(() => {
  //   generateToken();
  //   onMessage(messaging, (payload) => {
  //     console.log('payload', payload)
  //   })
  // }, [])

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker
  //     .register('/firebase-messaging-sw.js')
  //     .then(registration => {
  //       console.log('Service Worker registered with scope:', registration.scope);
  //     })
  //     .catch(error => {
  //       console.error('Service Worker registration failed:', error);
  //     });
  // }

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