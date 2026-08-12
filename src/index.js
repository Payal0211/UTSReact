import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ClearBrowserCacheBoundary } from 'react-clear-browser-cache';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<ClearBrowserCacheBoundary auto={true} fallback='' duration={300000} clearCacheAndReload = {true}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ClearBrowserCacheBoundary>
);

reportWebVitals();
