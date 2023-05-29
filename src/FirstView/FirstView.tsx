import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import './FirstView.css'; // Import the CSS file

const FirstView = () => {
    const navigate = useNavigate();

    const handleNavigate = ({path}: { path: any }) => {
        navigate(path);
    };

    return (
        <Box className="first-view-container">
            <Box className="top-bar">
                <Typography variant="h6" className="welcome-text">
                    MovieMeter
                </Typography>
                <Box className="button-container">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleNavigate({path: '/login'})}
                        className="login-button"
                    >
                        Login
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleNavigate({path: '/register'})}
                        className="register-button"
                    >
                        Register
                    </Button>
                </Box>
            </Box>
            <Box className="content-container">
                {/* Content for the rest of the page */}
                <Typography variant="h4" className="main-title">
                    Main Content
                </Typography>
                <Typography variant="body1" className="main-content">
                    This is the main content of the page. You can add more elements and customize it further.
                </Typography>
            </Box>
        </Box>
    );
};

export default FirstView;
