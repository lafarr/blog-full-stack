import { useState, useContext } from 'react';
import AuthContext from '../../../context/AuthContext';
import styles from './Form.module.css';
import { useHistory, Link } from 'react-router-dom';

const Form = props => {
    /* States */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [title, setTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [invalidInput, setInvalidInput] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [created, setCreated] = useState(false);

    /* Hooks */
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    /* State setting functions for keeping track of input */
    const emailChangeHandler = event => {
        setEmail(event.target.value);
    };

    const passwordChangeHandler = event => {
        setPassword(event.target.value);
    };

    const confirmPasswordChangeHandler = event => {
        setConfirmPassword(event.target.value);
    };

    const titleChangeHandler = event => {
        setTitle(event.target.value);
    };

    const postContentChangeHandler = event => {
        setPostContent(event.target.value);
    };

    /* Submit handler for login form */
    const loginSubmitHandler = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                "email": email,
                "password": password,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        if (response.status !== 200) {
            setInvalidInput(true);
            setErrorMessage('Invalid username or password');
        } else if (response.status === 200) {
            authCtx.login(data.token, data.username, data.id);
            history.push('/');
        }
    };

    /* Submit handler for sign up form */
    const signupSubmitHandler = async event => {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                "email": email,
                "password": password,
                "confirmPassword": confirmPassword
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        const data = await response.json();
        if (response.status !== 201) {
            setInvalidInput(true);
            setErrorMessage(data.message);
        } else {
            setCreated(true)
            setInvalidInput(false);
        }
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    /* Submit handler for creating a post */
    const postSubmitHandler = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/api/posts/make-post', {
            method: 'POST',
            body: JSON.stringify({
                content: postContent,
                title: title,
                token: authCtx.token
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.status === 401) {
            authCtx.logout();
            history.push('/login');
        } else if (response.status === 404) {
            setInvalidInput(true);
        } else {
            history.push('/');
        }
    };

    /* Determining which submit handler to use */
    let submitFunction;
    if (props.type === 'login') submitFunction = loginSubmitHandler;
    else if (props.type === 'signup') submitFunction = signupSubmitHandler;
    else submitFunction = postSubmitHandler;

    /* Rendered component */
    return (
        <div className={styles.container}>
            {invalidInput &&
                <div className={styles.invalid_input_container}>
                    <h5 className={styles.invalid_input}> {errorMessage} </h5>
                </div>
            }
            {created &&
                <div className={styles.created_container}>
                    <h5 className={styles.created}>Account Created!</h5>
                </div>
            }
            <form className={styles.form} onSubmit={submitFunction}>
                {(props.type === 'login' || props.type === 'signup') &&
                    <>
                        <input className={styles.input} type='text' placeholder='Email' onChange={emailChangeHandler} />
                        <input className={styles.input} type='password' placeholder='Password' onChange={passwordChangeHandler} />
                    </>
                }
                {props.type === 'post' &&
                    <>
                        <input className={styles.input} type='text' placeholder='Title' onChange={titleChangeHandler} />
                        <textarea className={styles.post} placeholder='Write something profound...' onChange={postContentChangeHandler} />
                    </>
                }
                {props.type === 'signup' &&
                    <>
                        <input className={styles.input} type='password' placeholder='Confirm Password' onChange={confirmPasswordChangeHandler} />
                    </>
                }
                <div className={styles.button_container}>
                    <button className={styles.button} type='submit'>{props.buttonText}</button>
                </div>
            </form>
            {props.type === 'signup' &&
                <Link className={styles.link} to="/login"><strong> Log in to an existing account</strong></Link>
            }
            {props.type === 'login' &&
                <Link className={styles.link} to='/signup'><strong>Don't have an account? Sign up!</strong></Link>
            }
        </div>
    )
};


export default Form;