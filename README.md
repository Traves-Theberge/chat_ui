# Chat UI
# Chat UI

## Use at your own caution

This application is still in development and may contain bugs or incomplete features. Please be aware that using it in a production environment is not recommended at this stage. We appreciate any feedback or bug reports to help improve the application.

This application is a real-time chat interface that allows users to interact with different AI models. Here's a detailed breakdown of how it works and the available models:

## User Authentication

- Users can sign up or log in using Supabase authentication.
- The authentication flow is handled in the HomePage component (`src/app/page.js`, lines 8-62).

## Chat Interface

- After authentication, users are directed to the chat page (`src/app/chat/page.js`).
- The chat interface allows users to send messages and receive responses from AI models.

## Model Selection

- Users can select different AI models using the ModelSelector component (`src/components/ModelSelector.js`, lines 1-35).
- The available models include:

### OpenAI models:

- `gpt-4o`
- `gpt-4o-mini`
- `gpt-4-turbo`
- `gpt-3.5-turbo-0125`
- `gpt-3.5-turbo` (default)

### Mistral models:

- `mistral-tiny`
- `mistral-small`
- `mistral-medium`
- `open-mistral-7b`
- `open-mixtral-8x7b`
- `open-mixtral-8x22b`
- `mistral-small-2402`
- `mistral-large-2402`
- `mistral-large-2407`
- `mistral-embed`
- `codestral-2405`
- `codestral-mamba-2407`
- `open-mistral-nemo`

## Message Handling

- When a user sends a message, it's processed by the `handleSendMessage` function in the ChatPage component (`src/app/chat/page.js`, lines 19-74).
- The message is stored in Supabase and then sent to the appropriate AI model for a response.

## AI Model Integration

- The application uses two main AI providers: OpenAI and Mistral.
- The `modelClients.js` file (`src/utils/modelClients.js`) handles the initialization and communication with these AI services.
- For OpenAI models, the request is sent to `src/pages/api/openai.js` (lines 1-22).
- For Mistral models, the request is sent to `src/pages/api/mistral.js` (lines 1-23).

## Real-time Communication

- The application uses Socket.io for real-time communication (`src/utils/socket.js`, lines 1-26).
- This allows for immediate updates to the chat interface when messages are sent or received.

## UI Components

- The chat interface includes components like `ChatHeader` (`src/components/ChatHeader.js`) for displaying the current chat session and model selector.
- Messages are rendered using a `MessageHandler` component (referenced in `src/utils/socket.js`).

## State Management

- The application uses React's `useState` and `useCallback` hooks for local state management.
- It also uses Zustand (as seen in `package.json` dependencies) for more complex state management, although the specific implementation is not shown in the provided code snippets.

## API Keys and Environment Variables

- The application requires API keys for OpenAI and Mistral, as well as Supabase credentials, which are stored as environment variables (as described in the `README.md`, lines 65-68).

This chat application provides a flexible interface for interacting with various AI models, allowing users to switch between different models and engage in conversations. The combination of Next.js, React, Supabase, and Socket.io creates a robust, real-time chat experience with AI-powered responses.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

- **Next.js**: React framework for server-side rendering and routing
- **React**: JavaScript library for building user interfaces
- **Supabase**: Open-source Firebase alternative for authentication and database
- **Tailwind CSS**: Utility-first CSS framework
- **OpenAI API**: For GPT-3.5 model integration
- **Mistral AI**: Alternative AI model for chat completions
- **Socket.io**: Real-time bidirectional event-based communication
- **SWR**: React Hooks library for data fetching
- **Zustand**: State management solution


## Features

- User authentication (signup, login, and logout) with Supabase
- Real-time messaging with Supabase
- Chat session management (create, read, update, and delete chats)
- Model selection for different chat interactions
- Responsive UI built with Tailwind CSS
- Data storage and retrieval using Supabase

## Installation

To get started with the Chat UI project, follow these steps:

1. Clone the repository:

    ```
    git clone https://github.com/your-username/chat_ui.git
    cd chat_ui
    ```

2. Install the dependencies:

    ```
    npm install
    ```

3. Set up the environment variables:

    Create a `.env.local` file in the root of the project and add the necessary environment variables. See the [Environment Variables](#environment-variables) section for more details.

4. Run the development server:

    ```
    npm run dev
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage
- **Login/Signup**: Authenticate users using the login and signup modals.
- **Add Chat**: Add new chat sessions using the button in the sidebar.
- **Delete Chat**: Remove chat sessions by clicking the delete button next to each chat in the sidebar.
- **Select Model**: Choose different chat models using the dropdown in the chat header.
- **Send Message**: Send messages using the input bar at the bottom of the chat area.

## Environment Variables

The following environment variables are required for the project:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key.
- `MISTRAL_API_KEY`: Your Mistral API key for chat completions.
- `OPENAI_API_KEY`: Your OpenAI API key for additional AI capabilities.

Create a `.env.local` file in the root of the project and add the variables as shown below:


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


### Summary

This `README.md` provides a clear and concise overview of your project, including installation instructions, usage guidelines, and details on environment variables. It also invites contributions and provides licensing information.

Would you like to proceed with this `README.md`, or is there anything specific you'd like to add or modify?






