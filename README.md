# WebSocket Chat Application

A real-time chat application built with Next.js and native WebSocket that allows multiple clients to chat with each other in real-time.

## Features

- Real-time messaging using native WebSocket API
- User join/leave notifications
- Clean and modern UI with Tailwind CSS
- Responsive design
- Connection status indicator
- Message timestamps

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Enter a username to join the chat

4. Start chatting! You can open multiple browser tabs/windows to simulate multiple users

## How to Use

1. **Join the Chat**: Enter your username on the login screen and click "Join Chat"
2. **Send Messages**: Type your message in the input field and press Enter or click "Send"
3. **Real-time Updates**: Messages from other users will appear in real-time
4. **User Notifications**: You'll see when other users join or leave the chat
5. **Connection Status**: The connection indicator shows if you're connected to the server

## Technical Details

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS
- **WebSocket**: Native WebSocket API with `ws` library on server
- **Server**: Custom Node.js server with separate WebSocket server

## Project Structure

```
challenge-web-sockets/
├── server.js              # Custom server with WebSocket support
├── src/
│   ├── app/
│   │   ├── page.tsx       # Main application page
│   │   └── layout.tsx     # App layout
│   └── components/
│       ├── Chat.tsx       # Chat component with WebSocket logic
│       └── Login.tsx      # Login component
└── package.json
```

## WebSocket Challenge in Chat Component

The `Chat.tsx` component contains a WebSocket implementation challenge. The component needs to be completed to handle real-time communication with the server.

### Challenge Requirements

In the `useEffect` hook in `src/components/Chat.tsx`, you need to implement the following WebSocket functionality:

1. **Create WebSocket Connection**:

2. **Handle WebSocket Events**:
   - `onopen`: Set connection status and send join message
   - `onclose`: Update connection status
   - `onerror`: Handle connection errors
   - `onmessage`: Parse incoming messages and update chat

3. **Incoming Message Types to Handle**:
   - `message`: Regular chat messages from users
   - `userJoined`: System announcement when user joins
   - `userLeft`: System announcement when user leaves

4. **Send Messages**:
   - Join message when connecting
   - Chat messages when user sends

### Implementation Details

The WebSocket server runs on `ws://localhost:3001`, implementation can be found in `server.js`

## Development

The application uses a custom server (`server.js`) with two separate servers:
- **Port 3000**: Next.js server for HTTP requests
- **Port 3001**: WebSocket server for real-time communication

This separation prevents conflicts with Next.js's own WebSocket connections for Hot Module Replacement.

To run in production:
```bash
npm run build
npm start
```
