import React from 'react'
import ReactDOM from 'react-dom/client'
import ContentApp from './ContentApp'
import styleText from './style.css?inline'

const rootId = 'prompt-vault-root'

function init() {
    const existingRoot = document.getElementById(rootId)
    if (existingRoot) return

    const container = document.createElement('div')
    container.id = rootId
    container.style.position = 'absolute'
    container.style.top = '0'
    container.style.left = '0'
    container.style.zIndex = '2147483647' // Max z-index
    container.style.pointerEvents = 'none' // Let clicks pass through by default

    document.body.appendChild(container)

    const shadowRoot = container.attachShadow({ mode: 'open' })
    const styleElement = document.createElement('style')
    styleElement.textContent = styleText
    shadowRoot.appendChild(styleElement)

    const appRoot = document.createElement('div')
    appRoot.id = 'app-root'
    shadowRoot.appendChild(appRoot)

    ReactDOM.createRoot(appRoot).render(
        <React.StrictMode>
        <ContentApp />
        </React.StrictMode>
    )
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    init()
}
