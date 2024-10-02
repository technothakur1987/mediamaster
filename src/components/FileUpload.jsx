import React, { useState } from 'react';
import axios from 'axios';
import { storage, db } from '../firebase/FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS


const FileUpload = () => {
  // State variables for file handling, previewing, and modal control
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [manipulatedImageUrl, setManipulatedImageUrl] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // Controls modal visibility

  // Handle file selection and set preview URL
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      // Create a preview URL for the selected file
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  // Handle the file upload to Firebase Storage and manipulate the image
  const handleUpload = async () => {
    if (!file) return; // Exit if no file is selected

    const fileRef = ref(storage, `uploads/${file.name}`); // Reference for Firebase Storage

    try {
      setUploading(true); // Set uploading state to true
      setError(null); // Clear any previous errors

      // Upload file to Firebase Storage
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef); // Get download URL

      // Save file metadata to Firestore
      await addDoc(collection(db, 'files'), {
        name: file.name,
        type: file.type,
        url: downloadURL,
        createdAt: new Date(),
      });

      // If the file is an image, call the Remove.bg API
      if (file.type.startsWith('image/')) {
        console.log('yes its an image ')
        const formData = new FormData();
        formData.append('image_file', file); // Append the file to form data
        
       

        
       const apiKey = 'ZCpduQcjVKHs2EG4kg4GmLNe'

        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
          headers: {
            'X-Api-Key': apiKey, // Your API key
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob', // Expect a blob response
        });

        // Create a URL for the manipulated image
        const removedBgUrl = URL.createObjectURL(response.data);
        setManipulatedImageUrl(removedBgUrl); // Set manipulated image URL
        setModalOpen(true); // Open modal when the image is ready
      } else {
        setManipulatedImageUrl(''); // Clear manipulated image URL if not an image
      }

      toast.success('File uploaded successfully!'); // Show success notification
    
    } catch (err) {
      setError(err.message); // Set error message
      console.error('Upload error:', err.message); // Log error to console
      toast.error(err.message); // Show success notification
    
    } finally {
      setUploading(false); // Reset uploading state
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-lg mx-auto">
      <h3 className="text-xl font-semibold mb-4">Upload a File</h3>
      <input
        type="file"
        onChange={handleFileChange} // Handle file change
        accept="image/*,audio/*,video/*,application/pdf" // Allowed file types
        className="block w-full text-sm text-gray-500 file:py-3 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-400 file:text-white hover:file:bg-green-500 mb-4"
        disabled={uploading} // Disable during uploading
      />
      {previewUrl && (
        <div className="mt-4">
          <h3 className="text-lg">Preview:</h3>
          {/* Render preview based on file type */}
          {file.type.startsWith('image/') && (
            <img src={previewUrl} alt="Preview" className="mt-2 w-full h-[50vh] object-contain rounded shadow" />
          )}
          {file.type.startsWith('audio/') && (
            <audio controls className="mt-2 w-full">
              <source src={previewUrl} />
            </audio>
          )}
          {file.type.startsWith('video/') && (
            <video controls className="mt-2 w-full rounded shadow">
              <source src={previewUrl} />
            </video>
          )}
          {file.type === 'application/pdf' && (
            <iframe src={previewUrl} title="PDF Preview" className="mt-2 w-full h-96 rounded shadow" />
          )}
        </div>
      )}
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        onClick={handleUpload} // Trigger upload on click
        disabled={uploading} // Disable button during upload
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
      {/* {error && <p className="text-red-500 mt-2">{error}</p>} Display error message */}

      {/* Modal for the manipulated image */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setModalOpen(false)} // Close modal
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg mb-4">Image with Background Removed:</h3>
            <img src={manipulatedImageUrl} alt="Background Removed" className="w-full h-[70vh] rounded shadow mb-4 object-contain" />

            {/* Download Button */}
            <a
              href={manipulatedImageUrl}
              download="image-without-background.png" // Filename for download
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200 inline-block"
            >
              Download Image
            </a>
          </div>
        </div>
      )}

<ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
   
    </div>
  );
};

export default FileUpload;
