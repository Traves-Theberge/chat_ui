# Chat UI

This chat application is built on Next.js and incorporates AI capabilities. It leverages Supabase for user authentication and data management, while OpenAI and Mistral AI are utilized for response generation and can be selected interchangeably in the chat.

🔑 ** Just Add API Keys for Open AI, Mistral & Supabase**


## Disclaimer

This application is still in development and may contain bugs or incomplete features. Please be aware that using it in a production environment is not recommended at this stage. We appreciate any feedback or bug reports to help improve the application.

## Table of Contents

- [Disclaimer](#disclaimer)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Performance Considerations](#performance-considerations)
- [Error Handling and Notifications](#error-handling-and-notifications)
- [Key Dependencies](#key-dependencies)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)

## Project Structure
```
src/
┣ app/
┃ ┣ chat/
┃ ┃ ┗ page.jsx
┃ ┣ login/
┃ ┃ ┗ page.jsx
┃ ┣ signup/
┃ ┃ ┗ page.jsx
┃ ┣ layout.jsx
┃ ┗ page.jsx
┣ components/
┃ ┣ sidebar/
┃ ┃ ┣ SidebarContainer.jsx
┃ ┃ ┣ SidebarChatItem.jsx
┃ ┃ ┣ SidebarChatList.jsx
┃ ┃ ┣ SidebarHeader.jsx
┃ ┃ ┗ SidebarNewChatModal.jsx
┃ ┣ AuthForm.jsx
┃ ┣ AuthModal.jsx
┃ ┣ ChatHeader.jsx
┃ ┣ ChatMessages.jsx
┃ ┣ MessageInput.jsx
┃ ┗ ModelSelector.jsx
┣ hooks/
┃ ┗ useAuth.jsx
┣ middleware/
┃ ┗ auth.jsx
┣ pages/
┃ ┣ api/
┃ ┃ ┣ mistral.jsx
┃ ┃ ┣ openai.jsx
┃ ┃ ┗ upload.jsx
┃ ┣ _app.jsx
┃ ┗ _document.jsx
┣ store/
┃ ┗ chatStore.jsx
┣ styles/
┃ ┗ globals.css
┗ utils/
  ┣ modelClients.jsx
  ┣ sidebarHandlers.jsx
  ┗ supabaseClient.jsx
  .env.local
  .eslintrc.json
  .gitignore
  jsconfig.json
  LICENSE
  next.config.mjs
  package-lock.json
  package.json
  postcss.config.js
  README.md
  tailwind.config.js
```

## Features

- User authentication (signup, login, and logout) with Supabase
- Real-time messaging with AI models
- Chat session management (create, read, and delete chats)
- Model selection for different AI interactions
- Support for multiple AI models:
  - OpenAI models: GPT-4o, GPT-3.5-turbo, GPT-4-turbo, GPT-4o-mini (default)
  - Mistral models: mistral-tiny-latest, mistral-small-latest, mistral-medium-latest, mistral-large-latest, open-mistral-nemo, codestral-latest
- Responsive UI with collapsible sidebar for mobile devices
- Markdown support in chat messages, including code syntax highlighting
- Emoji picker integration
- File upload functionality
- Dark mode UI

## Tech Stack

- **Next.js**: React framework for server-side rendering and routing
- **React**: JavaScript library for building user interfaces
- **Supabase**: Open-source Firebase alternative for authentication and database
- **Tailwind CSS**: Utility-first CSS framework
- **OpenAI API**: Provides GPT model integration
- **Mistral AI**: Offers alternative AI models for chat completions
- **Framer Motion**: Production-ready motion library for React
- **Zustand**: State management solution
- **React Markdown**: Markdown rendering for chat messages
- **React Syntax Highlighter**: Code syntax highlighting in chat messages
- **React Toastify**: Toast notifications for user feedback
- **Lodash**: Utility library for functions like debounce

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/chat_ui.git
   cd chat_ui
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section).

4. Build the application:
   ```
   npm run build
   ```

5. Run the development server:
   ```
   npm run dev
   ```

6. Open `http://localhost:3000` in your browser.

## Usage

- **Login/Signup**: Use the authentication forms to create an account or log in.
- **Create Chat**: Click the "+" button in the sidebar to start a new chat session.
- **Select Model**: Choose an AI model from the dropdown in the chat header.
- **Send Message**: Type your message in the input bar and press Enter to send.
- **Upload File**: Click the paperclip icon to upload and include files in your messages.
- **Use Emojis**: Click the emoji icon to open the emoji picker and add emojis to your messages.
- **Delete Chat**: Click the trash icon next to a chat in the sidebar to delete it.

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MISTRAL_API_KEY=your_mistral_api_key
OPENAI_API_KEY=your_openai_api_key
```

## Database Setup

To set up the necessary tables in your Supabase database, run the following SQL commands:

```sql
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    session_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender text NOT NULL, -- 'user' or 'bot'
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
```

These SQL commands will create the necessary tables for users, chat sessions, and conversations in your Supabase database.

## Performance Considerations

- Debouncing is used for certain operations like message fetching to prevent excessive API calls.
- React's `useMemo` and `useCallback` are utilized in components for optimization.
- The sidebar is collapsible to improve UI performance on mobile devices.
- File uploads are handled asynchronously to prevent UI blocking.

## Error Handling and Notifications

- Toast notifications are used for user feedback on actions like login, signup, and chat operations.
- Error handling is implemented in async operations with appropriate error messages displayed to the user.
- API errors are logged to the console for debugging purposes.


## Key Dependencies

This project relies on several key dependencies to provide its functionality:

- **React**: ^18.3.1
- **Next.js**: ^14.2.5
- **Supabase**: ^2.44.4
- **OpenAI**: ^4.53.2
- **Mistral AI**: ^0.5.0
- **Framer Motion**: ^11.3.19
- **React Markdown**: ^9.0.1
- **React Syntax Highlighter**: ^15.5.0
- **React Toastify**: ^10.0.5
- **SWR**: ^2.2.5
- **Zustand**: ^4.5.4
- **Lodash**: ^4.17.21
- **Emoji Picker React**: ^4.11.1
- **Font Awesome**: ^6.6.0

These dependencies provide essential functionality for state management, UI animations, markdown rendering, syntax highlighting, notifications, data fetching, and integration with AI services.

For a complete list of dependencies and their versions, please refer to the `package.json` file in the project root.

## API Routes

The application includes API routes for interacting with AI models:

- `/api/openai.jsx`: Handles requests to the OpenAI API
- `/api/mistral.jsx`: Handles requests to the Mistral AI API
- `/api/upload.jsx`: Handles file uploads

These routes are used to securely communicate with external AI services and manage file uploads.

## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Open a pull request.

Please ensure your code adheres to the project's coding conventions and standards.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.