import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'LoneStarAI',
  description: '...',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-navy text-light-gray">
        {children}
        <ToastContainer 
          position="top-center" 
          toastClassName="bg-navy text-light-gray"
          progressClassName="bg-vibrant-red"
        />
      </body>
    </html>
  );
}