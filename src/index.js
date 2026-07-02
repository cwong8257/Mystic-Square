import { createRoot } from 'react-dom/client'
import React from 'react'

import './styles/main.scss'

import App from './components/App'

const root = createRoot(document.querySelector('#root'))
root.render(<App />)
