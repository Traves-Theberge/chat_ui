import '../styles/globals.css';

export const metadata = {
  title: 'Chat UI',
  description: 'A chat application built with Next.js and Tailwind CSS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}
