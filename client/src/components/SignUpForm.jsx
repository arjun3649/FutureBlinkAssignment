import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';

const SignUpForm = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [email_address, setEmail_address] = useState('');
  const [password, setPassword] = useState('');
 
  const [formError, setFormError] = useState(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (userData) => {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Signup successful:', data);
      
      // Clear form
      setUsername('');
      setEmail_address('');
      setPassword('');
      
      
      // Close modal 
      if (onSignupSuccess) {
        onSignupSuccess();
      }
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to create account');
    },
    onSettled: () => {
      console.log('Signup attempt completed');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    

    
    mutate({ username, email_address, password });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>
      
      <form onSubmit={handleSubmit}>
        {formError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {formError}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 font-medium">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email_address}
            onChange={(e) => setEmail_address(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 font-medium">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            minLength="6"
            required
          />
        </div>
        
       
        
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isPending ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;