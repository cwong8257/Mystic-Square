import './styles/main.scss'

import App from './components/App'
import React from 'react'
import { createRoot } from 'react-dom/client'

const rootElement = document.querySelector('#root')
if (rootElement) {
  const root = createRoot(rootElement)
  root.render(<App />)
}
