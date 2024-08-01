// Import global styles
import '../styles/globals.css';
// Import ToastContainer component from react-toastify
import { ToastContainer } from 'react-toastify';
// Import react-toastify styles
import 'react-toastify/dist/ReactToastify.css';

// Metadata for the application
export const metadata = {
  title: 'Chat UI', // Title of the application
  description: 'A chat application built with Next.js and Tailwind CSS', // Description of the application
};

// Root layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white">
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