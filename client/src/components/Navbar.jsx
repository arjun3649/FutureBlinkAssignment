import React, { useState } from 'react';
import LoginForm from './LoginForm';
import PortalModal from './PortalModal.jsx';
import SignUpForm from './SignUpForm.jsx';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout, OnLoginSuccess }) => {
  const [isLoggedInPressed, setIsLoggedInPressed] = useState(false);
  const [isSignUpPressed, setIsSignUpPressed] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl text-blue-600">
          FutureBlink
        </Link>

        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Dashboard
              </Link>

              <button
                onClick={onLogout}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsLoggedInPressed(true);
                  setIsSignUpPressed(false);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Login
              </button>

              <button
                onClick={() => {
                  setIsSignUpPressed(true);
                  setIsLoggedInPressed(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Signup
              </button>
            </>
          )}
        </div>
      </nav>

      <PortalModal isOpen={isLoggedInPressed} onClose={() => setIsLoggedInPressed(false)}>
        <LoginForm
          onClose={()=> setIsLoggedInPressed(false)}
          OnLoginSuccess={() => {
            setIsLoggedInPressed(false);
            OnLoginSuccess();
            onClose(()=>setIsLoggedInPressed(false));
          }}
        />
      </PortalModal>

      <PortalModal isOpen={isSignUpPressed} onClose={() => setIsSignUpPressed(false)}>
        <SignUpForm onSignupSuccess={() => setIsSignUpPressed(false)} />
      </PortalModal>
    </>
  );
};

export default Navbar;
