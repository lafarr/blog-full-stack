import { useContext, useState } from 'react';
import styles from './MyAccount.module.css';
import Navigation from "../navigation/Navigation";
import authContext from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

const MyAccount = () => {
    const authCtx = useContext(authContext);
    const history = useHistory();
    const [username, setUsername] = useState(authCtx.username);
    const [invalidUsername, setInvalidUsername] = useState(false);
    let res;
    fetch('http://localhost:5000/api/auth/account', {
        method: 'POST',
        body: JSON.stringify({
            token: authCtx.token
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            res = response;
            return response.json();
        })
        .then(data => {
            if (res.status !== 200) {
                authCtx.logout();
                history.push('/login');
            }
        })

    const usernameChangeHandler = event => {
        setUsername(event.target.value);
    };

    const submitHandler = async event => {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/account-details', {
            method: 'PUT',
            body: JSON.stringify(({
                "token": authCtx.token,
                "username": username
            })),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 200) {
            setInvalidUsername(true);
        } else {
            const data = await response.json();
            authCtx.change(data.user.username);
            history.push('/account');
        }
    };
    return (
        <>
            <Navigation />
            <div className={styles.container}>
                <form className={styles.form} onSubmit={submitHandler}>
                    {invalidUsername && <h5 className={styles.invalid_input}>Username already taken!</h5>}
                    <label htmlFor='username'>Username </label>
                    <input className={styles.input} type='text' name='username' value={username} onChange={usernameChangeHandler} />
                    <button className={styles.button} type='submit'>Submit</button>
                </form>
            </div>
        </>
    )
};

export default MyAccount;