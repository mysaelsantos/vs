import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import BarberApp from './barber/BarberApp.jsx'
import './index.css'
import './admin/admin.css'

function Root() {
    const [route, setRoute] = useState(window.location.hash)

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash)
        }

        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    // Roteamento baseado no hash
    if (route === '#admin') {
        return <AdminApp />
    } else if (route === '#barber' || route.startsWith('#barber/')) {
        return <BarberApp />
    } else {
        return <App />
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
)
