import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ConfigProvider } from "antd"
import App from './App.jsx'
import { Provider } from 'react-redux'


createRoot(document.getElementById('root')).render(
  
  <ConfigProvider
      theme={{
        Button: {
          colorPrimary: "#007BFF", 
          colorPrimaryHover: "#0056b3", 
          borderRadius: '2px',
        },
      }}
    >
      <App />
    </ConfigProvider>
  
)
