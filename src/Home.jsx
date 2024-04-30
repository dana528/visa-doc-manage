import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import './Home.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Home = () => {
    const [data, setData] = useState([]);
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dbRef = db.collection('users');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await dbRef.get();
                const fetchedData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return [data.fullName, data.email, data.visaType, data.documents, data.documentUrls, doc.id]; // Include doc.id as userId and documentUrls
                });
                setData(fetchedData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('An error occurred while fetching data.');
            }
        };
                    
        fetchData();
    }, []);
    

    const options = {
        selectableRows: "none",
        elevation: 0,
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 20, 30],
    };

    const theme = createTheme({
        typography: {
            fontFamily: ['Poppins', 'sans-serif'].join(',')
        },
        palette: {
            background: {
                paper: '#1e293b',
            },
            mode: 'dark',
        },
        components: {
            styleOverrides: {
                head: {
                    padding: '10px 4px',
                },
                body: {
                    padding: '7px 15px',
                    color: '#e2ef0',
                },
                footer: {},
                MuiTableCell: {
                    body: {
                        color: '#FFFFFF', 
                    },
                },
                MuiTableBodyCell: {
                    root: {
                        '&:nth-child(2), &:nth-child(3)': {
                            color: '#FF0000', 
                        },
                    },
                },
            },
        },
    });
    
    const handleDownloadDocuments = (documentUrls) => {
    console.log('Downloading document:', documentUrls);
    if (documentUrls && documentUrls.length > 0) {
        
        documentUrls.forEach(documentUrl => {
            console.log('Download link:', documentUrl); 
        
            window.open(documentUrl, '_blank');
        });
    } else {
        
        console.log('No documents to download.');
    }
};

const handleDownloadDocument = (documentUrl) => {
    console.log('Downloading document:', documentUrl);
    // Open the URL in a new tab/window to initiate the download
    window.open(documentUrl, '_blank');
};



    const addNewUser = async () => {
        if (!fullname || !email) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            toast.error('This Email address already exists.');
        } else {
            try {
                await dbRef.add({ fullName: fullname, email: email });
                toast.success('User added successfully!');
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error adding user:', error);
                toast.error('An error occurred while adding the user.');
            }
        }
    };

    const checkEmailExists = async (email) => {
        const querySnapshot = await dbRef.where('email', '==', email).get();
        return !querySnapshot.empty;
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    

    const generateLink = (userId) => {
        return `http://localhost:3000/${userId}`;
    };

    const handleCopyLink = (userId) => {
        const link = generateLink(userId);
        navigator.clipboard.writeText(link)
            .then(() => toast.success('Link copied to clipboard'))
            .catch(() => toast.error('Failed to copy link'));
    };

    
    const columns = [
        {
            name: 'Full Name', 
            options: {
                className: 'cell',
                
            }
        },
    {
        name: 'Email',
        options:{
            className:"cell-1",
        }

    },{
        name: 'Visa Type',
        options:{
            className:"cell",
        }
    },{
    name: 'Profile Link',
    options: {
        customBodyRender: (value, tableMeta, updateValue) => {
            const userId = data[tableMeta.rowIndex][5]; 
            return (
                <button className="btn1" onClick={() => handleCopyLink(userId)}>Link</button>
            );
        }
    }
}, {
    name: 'Documents',
    options: {
        customBodyRender: (value, tableMeta, updateValue) => {
            const documentUrls = data[tableMeta.rowIndex][4]; 
            console.log("Document URLs:", documentUrls); 
            if (documentUrls && documentUrls.length > 0) {
                return (
                    <ul>
                        {documentUrls.map((docUrl, index) => (
                            <li key={index}>
                                <button onClick={() => handleDownloadDocument(docUrl)}>Document {index + 1}</button>
                            </li>
                        ))}
                    </ul>
                );
            } else {
                return '-';
            }
        }
    }
}];

    return (
        <>
            <div className="bg-slate-700 py-10 min-h-screen grid place-items-center">
                <div className="flex justify-end">
                    <button
                        onClick={toggleModal}
                        className="top-right-button block text-white bg-purple-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button"
                    >
                        Add User
                    </button>
                </div>
                
                    <ThemeProvider theme={theme}>
                    <div className="w-10/12 max-w-4xl">
                    <div className="header">Users' Details</div>
                        <MUIDataTable
                            title={""}
                            data={data}
                            columns={columns}
                            options={options}
                        />
                        </div>
                    </ThemeProvider>
                
            </div>
            {isModalOpen && (
    <div className="modal-container">
        <div className="modal">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-x"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#000000"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
            <div className="form">
                <h1>User's Details</h1>
                <div className="box">
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullname}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                <div className="box">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button className="btn" onClick={addNewUser}>Add</button>
            </div>
        </div>
    </div>
)}


            <ToastContainer />
        </>
    );
};

export default Home;
