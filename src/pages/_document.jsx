import { Html, Head, Main, NextScript } from 'next/document'; // Import necessary components from next/document

// Define the custom Document component
export default function Document() {
  return (
    <Html> {/* Render the Html component */}
      <Head /> {/* Render the Head component */}
      <body> {/* Render the body element */}
        <Main /> {/* Render the Main component */}
        <NextScript /> {/* Render the NextScript component */}
      </body>
    </Html>
  );
}
