import React, { useContext } from 'react'; 
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/FirebaseConfig';
import { AppContext } from '../store/Store';
import { useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload'; // Import the FileUpload component

const Main = () => {
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      dispatch({ type: 'LOGOUT' }); // Dispatch a LOGOUT action to update the global state
      navigate('/login'); // Redirect the user to the login page
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
     

      {/* File Upload Component */}
      <FileUpload /> {/* Render the FileUpload component here */}

      <button
        className="absolute top-4 right-4 bg-red-400 text-white font-bold py-2 px-4 rounded shadow hover:bg-red-500 transition duration-200"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Main;
