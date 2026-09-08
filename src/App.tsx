import { useEffect, useState } from 'react'
import LandingPage from './domains/landing-page/LandingPage'
import RegisterPage from './domains/auth/RegisterPage'
import AdminDashboard from './domains/dashboard/admin/AdminDashboard'
import VendorDashboard from './domains/dashboard/vendor/VendorDashboard'

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return hash
}

function App() {
  const hash = useHashRoute()
  
  if (hash.startsWith('#register')) {
    return <RegisterPage />
  }
  if (hash.startsWith('#admin')) {
    return <AdminDashboard />
  }
  if (hash.startsWith('#vendor')) {
    return <VendorDashboard />
  }
  return <LandingPage />
}

export default App
