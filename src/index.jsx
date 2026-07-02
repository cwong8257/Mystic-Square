import './styles/main.scss'

import App from './components/App'
import React from 'react'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.querySelector('#root'))
root.render(<App />)
