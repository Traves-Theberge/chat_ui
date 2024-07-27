# Chat UI

Chat UI is a real-time chat application built with Next.js and Tailwind CSS. It features user authentication, chat session management, and the ability to select different chat models. The application is integrated with Supabase for storing chat sessions and message history.


## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

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






