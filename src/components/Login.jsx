import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { AppContext } from '../store/Store';
import { auth } from '../firebase/FirebaseConfig';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { dispatch } = useContext(AppContext);

  const googleProvider = new GoogleAuthProvider();

  // Handle input change for both email and password
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      dispatch({ type: 'LOGIN', payload: userCredential.user });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch({ type: 'LOGIN', payload: result.user });
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setError("Please enter your email to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setResetEmailSent(true);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            value={formData.email} 
            onChange={handleInputChange} 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required 
            autoComplete="off" 
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password} 
            onChange={handleInputChange} 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required 
            autoComplete="off" 
          />
          <button 
            type="submit" 
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        <div className="my-6 text-center">
          <button 
            onClick={handleGoogleLogin} 
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            Sign in with Google
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">Forgot your password? 
            <button 
              onClick={handlePasswordReset} 
              className="text-indigo-600 hover:underline ml-1"
            >
              Reset it here
            </button>
          </p>
          {resetEmailSent && <p className="text-green-500 text-sm mt-2">Password reset email sent! Check your inbox.</p>}
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">New to the site? 
            <Link to="/signup" className="text-indigo-600 hover:underline ml-1">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
