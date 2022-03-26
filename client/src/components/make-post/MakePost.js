import Navigation from '../navigation/Navigation';
import Form from '../ui/forms/Form';
import styles from './MakePost.module.css';
import AuthContext from '../../context/AuthContext';
import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

const MakePost = (props) => {
    return (
        <>
            <Navigation />
            <Form type='post' buttonText='Submit'/>
        </>
    )
};

export default MakePost;