import { useState } from 'react';
import styles from '../login/Login.module.css';
import Navigation from '../navigation/Navigation';
import Form from '../ui/forms/Form';

const Signup = (props) => {

    return (
        <>
            <Navigation />
            <Form type='signup' buttonText='Sign Up'/>
        </>
    )
};

export default Signup;