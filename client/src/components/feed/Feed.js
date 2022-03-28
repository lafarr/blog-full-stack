import Navigation from '../navigation/Navigation';
import styles from './Feed.module.css';
import './Feed.css';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Dots from '../ui/dots-dropdown/Dots';
import AuthContext from '../../context/AuthContext';

const Feed = (props) => {
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [num, setNum] = useState(0);

    const history = useHistory();
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/posts/get-posts?userId=' + authCtx.userId, {
                    method: 'GET',
                });
                const r = await fetch('http://localhost:5000/api/likes?userId=' + authCtx.userId);
                const d = await r.json();
                const data = await res.json();
                setPosts(data.posts);
                setLikes(d.likes);
            } catch (err) {
                console.log(err);
            }
        }
        fun();
    }, [num, localStorage.getItem('token')]);

    const usernameClickHandler = userId => {
        history.push('/users?userId=' + userId);
    };

    const buttonClickHandler = postId => {
        history.push('/posts?postId=' + postId);
    };

    /* Handler for deleting a post */
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
            setNum(prev => prev + 1);
        } else if (response.status === 404) {
            console.log(await response.json());
            history.push('/404');
        } else {
            setPosts(prev => prev.filter(post => post.id !== postId));
        }
    };

    /* Handler for clicking the like/unlike button */
    const thumbClickHandler = async (post, likes) => {
        const like = likes.find(like => like.postId === post.id);
        if (!like) {
            const response = await fetch('http://localhost:5000/api/likes?postId=' + post.id, {
                method: 'POST',
                body: JSON.stringify({
                    userId: authCtx.userId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                setNum(prevState => prevState + 1);
            } else {
                authCtx.logout();
                history.push('/login');
            }
        } else {
            const response = await fetch('http://localhost:5000/api/likes?postId=' + post.id, {
                method: 'DELETE',
                body: JSON.stringify({
                    userId: authCtx.userId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 204) {
                setNum(prev => prev + 1);
            } else {
                authCtx.logout();
                history.push('/login');
            }
        }
    };

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <Navigation />
            {posts.length !== 0 &&
                posts.reverse().map(post => {
                    return (
                        <div className={styles.post_container}>
                            {post.userId === parseInt(authCtx.userId) && <Dots postId={post.id} onDelete={() => deleteHandler(post.id)} />}
                            <h1 className={styles.post}>{post.title}</h1>
                            <h4> By <strong className={styles.author} onClick={() => usernameClickHandler(post.userId)}>@{post.username}</strong></h4>
                            <p className={styles.post}>{post.content}</p>
                            <div className={styles.button_container}>
                                <button className={styles.button} onClick={() => buttonClickHandler(post.id)}>Full Post</button>
                            </div>
                            {!(likes.find(ele => ele.postId === post.id)) &&
                                <i className="fa fa-thumbs-up" onClick={() => thumbClickHandler(post, likes)}></i>
                            }
                            {likes.find(ele => ele.postId === post.id) &&
                                <>
                                    <i className="fa fa-thumbs-up liked" onClick={() => thumbClickHandler(post, likes)}></i>
                                </>
                            }
                            <h5 className={styles.likes}>{post.numLikes} likes</h5>
                            <i className="fa fa-comment"></i>
                            <h5 className={styles.comments}>{post.numComments} comments</h5>
                        </div>)
                }
                )}
            {posts.length === 0 && <div className={styles.post_container}><h1> No posts yet! </h1> </div>}
        </>
    )
};

export default Feed;