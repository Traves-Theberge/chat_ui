# Chat UI

Chat UI is a real-time chat application built with Next.js and Tailwind CSS. It features user authentication, chat session management, and the ability to select different chat models. The application is integrated with Supabase for storing chat sessions and message history.

## Project Structure
```
chat_ui/
├── node_modules/
├── public/
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── chat/
│   │   │   ├── page.js
│   │   │   ├── ChatComponent.js
│   │   │   └── ModalComponent.js
│   ├── components/
│   │   ├── Sidebar.js
│   │   ├── ChatHeader.js
│   │   ├── ChatMessages.js
│   │   ├── MessageInput.js
│   │   ├── ChatSessions.js
│   │   ├── MessageHandler.js
│   │   ├── AuthModal.js
│   │   ├── AuthForm.js 
│   │   └── ModelSelector.js
│   ├── middleware/
│   │   └── auth.js
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   ├── api.js
│   │   ├── socket.js
│   │   └── supabaseClient.js
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login.js
│   │   │   │   └── signup.js
│   │   ├── auth/
│   │   │   ├── login.js
│   │   │   └── signup.js
│   │   ├── _app.js
│   │   └── _document.js
├── jsconfig.json
├── .gitignore
├── postcss.config.js
├── postcss.config.mjs
├── .eslintrc.json
├── tailwind.config.js
├── package.json
├── package-lock.json
├── README.md
└── .env.local
```

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (signup, login, and logout)
- Real-time messaging
- Chat session management (add and delete chats)
- Model selection for different chat interactions
- Responsive UI with Tailwind CSS
- Data storage with Supabase

## Installation

To get started with the Chat UI project, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/chat_ui.git
    cd chat_ui
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up the environment variables:

    Create a `.env.local` file in the root of the project and add the necessary environment variables. See the [Environment Variables](#environment-variables) section for more details.

4. Run the development server:

    ```bash
    npm run dev
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Login/Signup**: Use the login and signup modals to authenticate users.
- **Add Chat**: Use the sidebar button to add new chat sessions.
- **Delete Chat**: Click the delete button next to each chat session in the sidebar to remove it.
- **Select Model**: Use the dropdown in the chat header to select different chat models.
- **Send Message**: Use the message input bar at the bottom of the chat area to send messages.

## Environment Variables

The following environment variables are required for the project:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key.

Create a `.env.local` file in the root of the project and add the variables as shown below:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

ontributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch: git checkout -b feature-branch-name
Make your changes and commit them: git commit -m 'Add some feature'
Push to the branch: git push origin feature-branch-name
Open a pull request.
Please ensure your code follows the project's coding conventions and standards.

License
This project is licensed under the MIT License. See the LICENSE file for more information.


### Summary

This `README.md` provides a clear and concise overview of your project, including installation instructions, usage guidelines, and details on environment variables. It also invites contributions and provides licensing information.

Would you like to proceed with this `README.md`, or is there anything specific you'd like to add or modify?






