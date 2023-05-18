import React, {useState} from "react";
import {Box, Button, Container, TextField} from "@mui/material";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

interface UserLogin {
    username: string
    email: string
    password: string
}
const Login = (props: any) => {
    const navigate=useNavigate();
    const [user, setUser] = useState<UserLogin>({} as UserLogin);
    //const [loggedInUser, setLoggedInUser] = useState(null);
    const [hasError, setHasError] = useState(false);
    const handleChange = (e: any) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    const handleLogin = () => {
        api
            .post('/ProjectMovies/login', user)
            .then((res) => {
                navigate('/homepage', { state: { userId: res.data.userId } });
            })
            .catch((err) => {
                console.error(err.message || 'Invalid user or password');
            });

    }
    const handleNavigate = () => {
        navigate("/register");
    }
    return <Container maxWidth="md">
        <Box className="login-form">
            <TextField label="Username" name="username" value={user.username || ""} onChange={handleChange}/>
            <TextField type="password" label="Password" name="password" value={user.password || ""} onChange={handleChange}/>


            <Button variant="contained" onClick={handleLogin}>Login</Button>
            <Button variant="contained" onClick={handleNavigate}>Register</Button>
        </Box>
    </Container>;
}
export default Login;