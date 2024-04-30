import React, { useState } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import { db } from './firebase';
import './emailVerification.css';
import FormInput from "./components/FormInput";


const EmailVerification = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
const segments = pathname.split('/'); // Split the pathname by forward slashes
const userIdFromLink = segments[segments.length - 1]; // Get the last segment



const inputs = [
  // {
  //   id: 1,
  //   name: "username",
  //   type: "text",
  //   placeholder: "Username",
  //   errorMessage:
  //     "Username should be 3-16 characters and shouldn't include any special character!",
  //   label: "Username",
  //   pattern: "^[A-Za-z0-9]{3,16}$",
  //   required: true,
  // },
  {
    id: 1,
    name: "email",
    type: "email",
    placeholder: "Email",
    errorMessage: "It should be a valid email address!",
    label: "Email",
    required: true,
  },
  // {
  //   id: 3,
  //   name: "birthday",
  //   type: "date",
  //   placeholder: "Birthday",
  //   label: "Birthday",
  // },
  // {
  //   id: 4,
  //   name: "password",
  //   type: "password",
  //   placeholder: "Password",
  //   errorMessage:
  //     "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
  //   label: "Password",
  //   pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
  //   required: true,
  // },
  // {
  //   id: 5,
  //   name: "confirmPassword",
  //   type: "password",
  //   placeholder: "Confirm Password",
  //   errorMessage: "Passwords don't match!",
  //   label: "Confirm Password",
  //   pattern: values.password,
  //   required: true,
  // },
];



    const getUserData = async (userId) => {
        try {
          const userQuerySnapshot = await db.collection('users').doc(userId).get(); // Fetch user by userId
          if (userQuerySnapshot.exists) {
            return userQuerySnapshot.data();
          } else {
            throw new Error('User not found');
          }
        } catch (error) {
          throw new Error('Error fetching user data: ' + error.message);
        }
      };
      

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            console.log('userIdFromLink:', userIdFromLink); // Log userIdFromLink
            // Fetch user data from the database
            const userData = await getUserData(userIdFromLink);
            
            // Verify if the entered email matches the user's email
            if (userData.email === values.email) {
                // If it matches, navigate to the UserProfile component with userId and email
                navigate(`/${userIdFromLink}/${values.email}`);
            } else {
                // If it doesn't match, show an error message or handle it accordingly
                alert('Email does not match the user ID.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle error fetching user data
            alert('Error fetching user data. Please try again.');
        }
    };

    const onChange = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value });
    };
    
  return (
    <div className='emailVerification'>
      <form onSubmit={handleSubmit}>
      <h1>Please Enter your Email to continue</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button className="btn" type="submit">Verify</button>
      </form>
    </div>
  );
};

export default EmailVerification;
