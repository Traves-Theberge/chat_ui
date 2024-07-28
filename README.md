# Chat UI
A real-time chat interface enabling users to communicate with multiple AI models, such as OpenAI's GPT models and Mistral AI's language models.

## Home
![Home](<Screenshot 2024-07-28 050736.jpg>) 

## Login
![Login](<Screenshot 2024-07-28 050849.jpg>)

## Chat UI
![ChatUI](<Screenshot 2024-07-28 055119.jpg>)

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Project Structure
```
src/
├── app/
│   ├── chat/
│   │   ├── ChatComponent.jsx
│   │   ├── ModalComponent.jsx
│   │   └── page.jsx
│   ├── login/
│   │   └── page.jsx
│   ├── signup/
│   │   └── page.jsx
│   ├── layout.jsx
│   └── page.jsx
├── components/
│   ├── AuthForm.jsx
│   ├── AuthModal.jsx
│   ├── ChatHeader.jsx
│   ├── ChatMessages.jsx
│   ├── ChatSessions.jsx
│   ├── MessageInput.jsx
│   ├── ModelSelector.jsx
│   └── Sidebar.jsx
├── hooks/
│   └── useSocket.jsx
├── middleware/
│   └── auth.jsx
├── pages/
│   ├── api/
│   │   ├── mistral.jsx
│   │   └── openai.jsx
│   ├── _app.jsx
│   └── _document.jsx
├── store/
│   └── chatStore.jsx
├── styles/
│   └── globals.css
└── utils/
    ├── api.jsx
    ├── modelClients.jsx
    ├── socket.jsx
    └── supabaseClient.jsx
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
- Real-time messaging with Supabase and Socket.io
- Chat session management (create, read, update, and delete chats)
- Model selection for different AI interactions
- Support for multiple AI models:
  - OpenAI models: GPT-4o, GPT-4o-mini, GPT-4-turbo, GPT-3.5-turbo-0125, GPT-3.5-turbo (default)
  - Mistral models: mistral-tiny, mistral-small, mistral-medium, open-mistral-7b, open-mixtral-8x7b, open-mixtral-8x22b, mistral-small-2402, mistral-large-2402, mistral-large-2407, mistral-embed, codestral-2405, codestral-mamba-2407, open-mistral-nemo
- Responsive UI built with Tailwind CSS
- Data storage and retrieval using Supabase

## Tech Stack

- **Next.js**: A React framework for server-side rendering and routing.
- **React**: A JavaScript library for building user interfaces.
- **Supabase**: An open-source Firebase alternative for authentication and database.
- **Tailwind CSS**: A utility-first CSS framework.
- **OpenAI API**: Provides GPT model integration.
- **Mistral AI**: Offers alternative AI models for chat completions.
- **Socket.io**: Enables real-time bidirectional event-based communication.
- **SWR**: A React Hooks library for data fetching.
- **Zustand**: A state management solution.

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

- **Login/Signup**: Users can authenticate using the login and signup modals.
- **Add Chat**: Users can create new chat sessions using the button in the sidebar.
- **Delete Chat**: Users can delete chat sessions by clicking the delete button next to each chat in the sidebar.
- **Select Model**: Users can select different chat models using the dropdown in the chat header.
- **Send Message**: Users can send messages using the input bar at the bottom of the chat area.

## Environment Variables

The following environment variables are required for the project:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `MISTRAL_API_KEY`: Your Mistral API key for chat completions
- `OPENAI_API_KEY`: Your OpenAI API key for additional AI capabilities

Create a `.env.local` file in the root of the project and add the variables as shown below:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MISTRAL_API_KEY=your_mistral_api_key
OPENAI_API_KEY=your_openai_api_key
```

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

## Disclaimer

This application is still in development and may contain bugs or incomplete features. Please be aware that using it in a production environment is not recommended at this stage. We appreciate any feedback or bug reports to help improve the application.
