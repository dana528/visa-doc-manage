import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { storage } from './firebase';
import { toast } from 'react-toastify'; // Import react-toastify
import './userProfile.css';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify

const UserProfile = () => {
  const { userId } = useParams(); // Extract userId from URL parameter
  const [userData, setUserData] = useState(null);
  const [visaType, setVisaType] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isVisaTypeSelected, setIsVisaTypeSelected] = useState(false);
  const [visaTypeValidationError, setVisaTypeValidationError] = useState('');
  const [documentValidationError, setDocumentValidationError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userQuerySnapshot = await db.collection('users').doc(userId).get(); // Fetch user by userId
        if (userQuerySnapshot.exists) {
          setUserData(userQuerySnapshot.data());
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFileChange = (event) => {
    // Update the selectedFiles state with the selected files
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };

  const handleVisaTypeChange = (event) => {
    // Update the visaType state with the selected visa type
    setVisaType(event.target.value);
    // Update the isVisaTypeSelected state based on whether a visa type is selected
    setIsVisaTypeSelected(!!event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if visa type and documents are selected/uploaded
    if (!isVisaTypeSelected) {
      setVisaTypeValidationError('Please select a visa type.');
      return;
    } else {
      setVisaTypeValidationError('');
    }

    if (selectedFiles.length === 0) {
      setDocumentValidationError('Please upload at least one document.');
      return;
    } else {
      setDocumentValidationError('');
    }

    try {
      const fileUploadPromises = selectedFiles.map(file => {
        const storageRef = storage.ref(`user-docs/${userId}/${file.name}`);
        return storageRef.put(file);
      });

      const uploadSnapshots = await Promise.all(fileUploadPromises);

      const downloadUrls = await Promise.all(uploadSnapshots.map(snapshot => snapshot.ref.getDownloadURL()));

      // Update user profile in the database with the new details
      await db.collection('users').doc(userId).set({
        visaType: visaType,
        documentUrls: downloadUrls,
      }, { merge: true });
      
      console.log('User profile updated successfully!');
      toast.success('User profile updated successfully!');

      // Show success toast message when documents are uploaded
     
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Show error toast message if there's an error
      toast.error('Error uploading documents. Please try again later.');
    }
  };

  return (
    <div className="user-profile">
      {userData ? (
        <form onSubmit={handleSubmit}>
          <h1>Your Details</h1>
          <div>
            <label htmlFor="fullName">Full Name:</label>
            <input className="input2" type="text" id="fullName" value={userData.fullName} readOnly />
          </div>
          <div>
            <label htmlFor="email">Email Address:</label>
            <input type="email" className="input2" id="email" value={userData.email} readOnly />
          </div>
          <div>
            <label htmlFor="visaType">Visa Type:</label>
            <input type="text" id="visaType" value={visaType} onChange={handleVisaTypeChange} required />
            {visaTypeValidationError && <div className="error">{visaTypeValidationError}</div>}
          </div>
          <div>
            <label htmlFor="documents">Upload Documents:</label>
            <input type="file" id="documents" multiple accept=".doc, .docx, .png, .jpg, .jpeg, .pdf" onChange={handleFileChange} required />
            {documentValidationError && <div className="error">{documentValidationError}</div>}
          </div>
          <button className="btn" type="submit">Save</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
