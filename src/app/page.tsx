'use client';

import { useState } from 'react';
import Login from '../components/Login';
import Chat from '../components/Chat';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);

  const handleLogin = (newUsername: string) => {
    setUsername(newUsername);
  };

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return <Chat username={username} />;
}
