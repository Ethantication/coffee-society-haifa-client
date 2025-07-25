import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure this path is correct if your index.css is elsewhere
import App from './App'; // This imports your main App component
import reportWebVitals from './reportWebVitals'; // If you want to keep web vitals reporting

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
