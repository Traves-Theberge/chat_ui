import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'LonestarAI',
  description: '...',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-navy text-light-gray">
        {children}
        <ToastContainer 
          position="top-center" 
          toastClassName="custom-toast"
          progressClassName="custom-toast-progress-bar"
        />
      </body>
    </html>
  );
}