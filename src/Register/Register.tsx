import React, {useEffect, useState} from "react";
import {Box, Button, Container, TextField} from "@mui/material";

import "./Register.css";
import api from "../api/api";
import {useNavigate} from "react-router-dom";



interface UserRegister {
    userName: string
    email: string
    password: string
    confirmPassword: string
}

const Register = (props: any) => {
    const [user, setUser] = useState<UserRegister>({} as UserRegister);
    const [hasPasswordError, setHasPasswordError] = useState(false);
    const [hasUserError, setHasUserError] = useState(false);
    const navigate=useNavigate();
    useEffect(() => {
        setHasPasswordError(user.password !== user.confirmPassword);
    }, [user.password, user.confirmPassword]);
    useEffect( ()=> {
        setHasUserError(user.userName==="");
    },[user.userName]);

    const handleChange = (e: any) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    const handleRegister = () => {
        api.post("/ProjectMovies/adduser",user)
            .then((res)=>{
                navigate("/login")
            })
            .catch((err)=>{
                console.error(err.message || "Fields are not filled properly");
            })
    }
    const handleClick = () => {
        console.log(user);
    }

    return <Container maxWidth="md">
        <Box className="register-form">
            <TextField
                helperText={hasUserError ? "Empty field" : ""}
                error={hasUserError}
                label="Username"
                name="userName"
                value={user.userName || ""}
                onChange={handleChange}/>
            <TextField label="Email" name="email" value={user.email || ""} onChange={handleChange}/>
            <TextField type="password" label="Password" name="password" value={user.password || ""} onChange={handleChange}/>
            <TextField
                type="password"
                error={hasPasswordError}
                helperText={hasPasswordError ? "Passwords do not match" : ""}
                label="Confirm password"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleChange}
            />

            <Button variant="contained" onClick={handleRegister}>Register</Button>
        </Box>
    </Container>;
}

export default Register;