import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx' // AuthProvider එක import කරන්න

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* මුළු App එකම මෙන්න මෙහෙම වට කරන්න */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)