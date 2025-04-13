import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';

const LoginForm = ({ onClose, OnLoginSuccess }) => {
  const [email_address, setEmail_address] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (userData) => {
      const response = await fetch('http://localhost:4000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      return response.json();
    },

    onSuccess: (data) => {
      localStorage.setItem('token', data.token);

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        try {
          const tokenParts = data.token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          localStorage.setItem('userId', payload.id);
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      }

      if (OnLoginSuccess) OnLoginSuccess();
    },

    onError: (error) => {
      setFormError(error.message || 'Invalid email or password');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    mutate({ email_address, password });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="relative w-full max-w-md mx-4 bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Login to your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-2 bg-red-100 text-red-700 rounded text-center text-sm">
              {formError}
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={email_address}
              onChange={(e) => setEmail_address(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
