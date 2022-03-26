import Navigation from '../navigation/Navigation';
import styles from './Feed.module.css';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Dots from '../ui/dots-dropdown/Dots';
import AuthContext from '../../context/AuthContext';

const Feed = (props) => {
    const [posts, setPosts] = useState([]);
    const history = useHistory();
    const [num, setNum] = useState(0);
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        fetch('http://localhost:5000/api/posts/get-posts', {
            method: 'GET',
        })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => {
                setPosts(data.posts);
                console.log(posts);
            })
            .catch(err => {
                console.log(err);
            });
    }, [num]);

    const usernameClickHandler = userId => {
        history.push('/users?userId=' + userId);
    };

    const buttonClickHandler = postId => {
        history.push('/posts?postId=' + postId);
    };

    const deleteHandler = async postId => {
        const response = await fetch('http://localhost:5000/api/posts/delete-post?postId=' + postId,
            {
                method: 'DELETE',
                body: JSON.stringify({ "token": authCtx.token }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        if (response.status === 401) {
            authCtx.logout();
            history.push('/login');
        } else if (response.status === 404) {
            console.log(await response.json());
            history.push('/404');
        } else {
            setNum(prevNum => prevNum + 1);
        }
    };

    return (
        <>
            <Navigation />
            {posts.length !== 0 &&
                posts.reverse().map(post => {
                    return (
                        <div className={styles.post_container}>
                            {post.userId === parseInt(authCtx.userId) && <Dots postId={post.id} onDelete={() => deleteHandler(post.id)}/>}
                            <h1 className={styles.post}>{post.title}</h1>
                            <h4> By <strong className={styles.author} onClick={() => usernameClickHandler(post.userId)}>@{post.username}</strong></h4>
                            <p className={styles.post}>{post.content}</p>
                            <button className={styles.button} onClick={() => buttonClickHandler(post.id)}>Full Post</button>
                        </div>)
                }
                )}
            {posts.length === 0 && <div className={styles.post_container}><h1> No posts yet! </h1> </div>}
        </>
    )
};

export default Feed;