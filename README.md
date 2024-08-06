# Chat UI

This chat application is built on Next.js and incorporates AI capabilities. It leverages Supabase for user authentication, data management, and real-time messaging. OpenAI and Mistral AI are utilized for response generation and can be selected interchangeably in the chat.

🔑 **Just Add API Keys for Open AI, Mistral & Set Up Supabase**


🚨 **Disclaimer**

This project is for educational and demonstration purposes only. It is not intended for production use without proper security measures and compliance with applicable laws and regulations. The use of AI models and third-party services may be subject to their respective terms of service and privacy policies.


- [Disclaimer](#disclaimer)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Prompt Templates](#prompt-templates)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Performance Considerations](#performance-considerations)
- [Error Handling and Notifications](#error-handling-and-notifications)
- [Key Dependencies](#key-dependencies)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)
- [TO DO](#to-do)

## Features

- User authentication (signup, login, and logout) with Supabase
- Real-time messaging with AI models
- Chat session management (create, read, and delete chats)
- Model selection for different AI interactions
- Support for multiple AI models:
  - OpenAI models: GPT-4o, GPT-3.5-turbo, GPT-4-turbo, GPT-4o-mini (default)
  - Mistral models: mistral-tiny-latest, mistral-small-latest, mistral-medium-latest, mistral-large-latest, 
  open-mistral-nemo, codestral-latest
- Markdown support in chat messages, including code syntax highlighting
- Emoji picker integration
- File upload functionality
- Prompt templates for quick message generation
    - Placeholder system for dynamic content in templates
    - File upload support for placeholders
- Chat history download in multiple formats (TXT, JSON, CSV)
- Real-time typing indicators
- Improved loading states for better user feedback
- Smoother animations for message additions and removals
- AI-powered chat responses from OpenAI and Mistral AI
- Customizable prompt templates
- File uploads and sharing
- Message editing and deletion with real-time updates
- Responsive design for mobile and desktop
- Manage chat logs with options to delete, copy, and download individual messages or the entire chat history in .json, .csv, and .txt formats

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
┃ ┃ ┣ promptTemplates/
┃ ┃ ┃ ┣ overview.mdx
┃ ┃ ┃ ┣ PlaceholderFillModal.jsx
┃ ┃ ┃ ┣ PromptTemplateButton.jsx
┃ ┃ ┃ ┗ PromptTemplateModal.jsx
┃ ┃ ┣ SidebarButton.jsx
┃ ┃ ┣ SidebarChatItem.jsx
┃ ┃ ┣ SidebarChatList.jsx
┃ ┃ ┣ SidebarContainer.jsx
┃ ┃ ┣ SidebarFooter.jsx
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
┃ ┣ chatStore.jsx
┃ ┗ promptTemplateStore.js
┣ styles/
┃ ┗ globals.css
┣ uploads/
┃ ┗ file.example
┗ utils/
  ┣ apiUtils.js
  ┣ modelClients.jsx
  ┣ promptTemplates.js
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
- **Download Chat History**: Click the "Download Chat" button in the chat header to download the chat history in various formats.
- **Prompt Templates**: Click the "Prompt Templates" button in the sidebar to access the Prompt Templates modal.
- **Apply Template**: Select a template and fill in any placeholders in the PlaceholderFillModal. This modal allows you to input text for placeholders marked as `{{placeholder_name}}` in the template content.
- **File Placeholders**: For placeholders marked as `{{file_reference}}`, you can upload text-based files. The content of the uploaded file will replace the placeholder in the template. Supported file formats include .txt, .html, .css, .js, .json, .xml, and .md.

## Prompt Templates

The Prompt Templates feature allows users to create, manage, and apply pre-defined text structures to their messages. This enhances the chat experience by providing quick access to commonly used prompts and allowing for customization through placeholders.

### How to Use:

1. Click the "Prompt Templates" button in the sidebar.
2. In the modal, you can:
   - Select an existing template
   - Create a new template
   - Edit or delete existing templates
3. When applying a template with placeholders, fill in the required information in the PlaceholderFillModal.
4. The filled template will be inserted into your message input.

### Placeholder Types:

- Basic placeholders: `{{placeholder_name}}`
- File placeholders: Allows uploading text-based files

### Performance Considerations:

- Templates are stored in the database and fetched on-demand to reduce initial load time.
- File uploads for placeholders are handled asynchronously to prevent UI blocking.

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

CREATE TABLE IF NOT EXISTS prompt_templates (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create an index on the name column for faster lookups
CREATE INDEX IF NOT EXISTS idx_prompt_templates_name ON prompt_templates(name);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_prompt_templates_modtime
BEFORE UPDATE ON prompt_templates
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
```

These SQL commands will create the necessary tables for users, chat sessions, and conversations in your Supabase database.

## Performance Considerations

- Debouncing is used for certain operations like message fetching to prevent excessive API calls.
- React's `useMemo` and `useCallback` are utilized in components for optimization.
- The sidebar is collapsible to improve UI performance on mobile devices.
- File uploads are handled asynchronously to prevent UI blocking.
- Templates are stored in the database and fetched on-demand to reduce initial load time.
- File uploads for placeholders are handled asynchronously to prevent UI blocking.

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

## TO DO

```
./src/app/chat/page.jsx
37:34  Warning: React Hook useCallback received a function whose dependencies are unknown. Pass an inline function instead.  react-hooks/exhaustive-deps

./src/components/MessageInput.jsx
30:32  Warning: React Hook useCallback received a function whose dependencies are unknown. Pass an inline function instead.  react-hooks/exhaustive-deps

./src/components/sidebar/promptTemplates/PlaceholderFillModal.jsx
81:6  Warning: React Hook useEffect has a missing dependency: 'validateInputs'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
```