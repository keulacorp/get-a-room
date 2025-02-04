import React, { StrictMode } from 'react';
import './index.css';
import App from './components/App';
import reportWebVitals from './create-react-app/reportWebVitals';
import { checkEnvVariables } from './util/checkEnvVariables';

// https://mui.com/components/typography/#general
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createRoot } from 'react-dom/client';
import { COLORS } from './theme_2024';

checkEnvVariables();
const element: HTMLElement | null = document.getElementById('root');

if (!element) {
    throw new Error('NO ROOT ELEMENT FOUND');
}

const root = createRoot(element);
root.render(
    <StrictMode>
        <style>
            {`body {
               background-color: ${COLORS.BACKGROUND_PRIMARY};
            }`}
        </style>
        <App />
    </StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
