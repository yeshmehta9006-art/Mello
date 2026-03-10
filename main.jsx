import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'


// Ye line HTML ki 'root' id ko pakadti hai aur wahan App.jsx ko render karti hai
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)