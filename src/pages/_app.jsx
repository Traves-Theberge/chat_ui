import '../styles/globals.css'; // Import global CSS styles

// Define the custom App component
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />; // Render the current page component with its props
}

export default MyApp; // Export the custom App component as the default export