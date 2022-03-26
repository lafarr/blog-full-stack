import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styles from "./IndividualPost.module.css";
import Navigation from '../navigation/Navigation';

const IndividualPost = props => {
    const [post, setPost] = useState(null);
    const history = useHistory();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const postId = queryParams.get('postId');

    const usernameClickHandler = userId => {
        history.push('/users?userId=' + userId);
    };

    useEffect(() => {
        const fun = async (postId) => {
            const response = await fetch('http://localhost:5000/api/posts?postId=' + postId, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 404) {
                /* render 404 page */
            } else {
                const data = await response.json();
                console.log(data);
                setPost(data.post);
            }
        }
        fun(postId);
    }, []);

    return (
        <>
            <Navigation />
            <div className={styles.post_container}>
                {post !== null &&
                    <div>
                        <h1 className={styles.title}>{post.title}</h1>
                        <h4> By <strong className={styles.author} onClick={() => usernameClickHandler(post.userId)}>@{post.username}</strong></h4>
                        <p className={styles.content}>{post.content}</p>
                    </div>
                }
            </div>
        </>
    )
};

export default IndividualPost;