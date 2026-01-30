import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import './index.css'
import './admin/admin.css'

function Root() {
    const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin')

    useEffect(() => {
        const handleHashChange = () => {
            setIsAdmin(window.location.hash === '#admin')
        }

        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    return isAdmin ? <AdminApp /> : <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
)
