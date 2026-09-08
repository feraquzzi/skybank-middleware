import { useEffect, useState } from 'react'
import LandingPage from './domains/landing-page/LandingPage'
import RegisterPage from './domains/auth/RegisterPage'

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
  return <LandingPage />
}

export default App
