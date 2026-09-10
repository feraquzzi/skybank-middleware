import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';

import './index.css';
import App from './App.tsx';
import keycloak from './keycloak.ts';

const eventLogger = (event: string, error?: unknown) => {
    console.log('Keycloak event:', event, error);
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ReactKeycloakProvider
            authClient={keycloak}
            onEvent={eventLogger}
            onInitError={(error) => {
                console.error('Keycloak init error:', error);
            }}
            initOptions={{
                onLoad: 'check-sso',
                checkLoginIframe: false,
            }}
        >
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ReactKeycloakProvider>
    </StrictMode>
);