import React, { memo } from 'react';
import { Toaster } from 'react-hot-toast';
import './assets/css/index.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Routes from './routes';
import { SidebarProvider } from './context/SidebarContext';
import { PreviewSurveyContext } from './context/PreviewSurveyContext';
import { createRoot } from 'react-dom/client';
import { clarity } from 'react-microsoft-clarity';
clarity.init('nvimzkpq47');
//removing from stage
const MainApp = memo(() => {
  return (
    <SidebarProvider>
      <PreviewSurveyContext>
        <div className="bg-[#f3f4f7] dark:bg-shoorah-darkBgColor">
          <Routes />
        </div>
        <Toaster />
      </PreviewSurveyContext>
    </SidebarProvider>
  );
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((err) => {
      console.log('Service Worker registration failed:', err);
    });
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<MainApp />);
