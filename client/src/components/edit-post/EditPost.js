import { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";
import styles from './EditPost.module.css';
import Navigation from "../navigation/Navigation";

const EditPost = props => {
    const history = useHistory();
    const authCtx = useContext(AuthContext);
    const [newTitle, setTitle] = useState('');
    const [newContent, setContent] = useState('');
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const postId = queryParams.get('postId');
    const [increment, setIncrement] = useState(0);

    useEffect(() => {
        const fun = async () => {
            const response = await fetch('http://localhost:5000/api/posts?postId=' + postId, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 401) {
                authCtx.logout();
                history.push('/login');
            } else if (response.status === 200) {
                const data = await response.json();
                setTitle(data.post.title);
                setContent(data.post.content);
                setIncrement(prevState => prevState + 1);
            } else {
                /* render 404 page */
            }
        };
        fun()
    }, [increment])

    const titleChangeHandler = event => {
        setTitle(event.target.value);
    };

    const contentChangeHandler = event => {
        setContent(event.target.value);
    };

    const submitHandler = async event => {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/api/posts/edit-post?postId=' + postId, {
            method: 'PUT',
            body: JSON.stringify({
                title: newTitle,
                content: newContent,
                token: authCtx.token
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 401) {
            authCtx.logout();
            history.push('/login');
        } else if (response.status === 200) {
            history.push('/users?userId=' + authCtx.userId);
        } else {
            console.log('wrong');
        }
    };

    return (
        <div className={styles.container}>
            <Navigation />
            <form className={styles.form} onSubmit={submitHandler}>
                <div className={styles.title_container}>
                    <input className={styles.title} type='text' value={newTitle} onChange={titleChangeHandler} />
                </div>
                <input className={styles.post} type='text' value={newContent} onChange={contentChangeHandler} />
                <div className={styles.button_container}>
                    <button className={styles.button} type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
};

export default EditPost;

/**
 * Submission of edited information does not work!
 */