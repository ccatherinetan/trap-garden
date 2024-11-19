'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../utils/AuthProvider';

export default function SignUp() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    // Define handleSignUp
    try {
      await signUp(email, password);
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <input
        name="email"
        onChange={e => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        onChange={e => setPassword(e.target.value)}
        value={password}
        placeholder="Password"
      />
      <input
        type="password"
        name="Confirm Password"
        onChange={e => setPassword(e.target.value)}
        value={password}
        placeholder="Confirm Password"
      />
      <button type="button" onClick={handleSignUp}>
        Sign up
      </button>{' '}
      {/* Sign up button */}
    </>
  );
}
