import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import styles from '../login/Login.module.css';
import Navigation from '../navigation/Navigation';
import Form from '../ui/forms/Form';
import { useHistory } from "react-router-dom";

const Login = (props) => {
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    if (authCtx.token) history.push('/');

    return (
        <>
            <Navigation />
            <Form type='login' buttonText='Log in' />
        </>
    )
};

export default Login;