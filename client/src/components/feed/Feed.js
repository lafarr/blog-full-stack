import Navigation from '../navigation/Navigation';
import Dots from '../ui/dots-dropdown/Dots';
import AuthContext from '../../context/AuthContext';
import Modal from '../ui/modal/Modal';

import styles from './Feed.module.css';
import './Feed.css';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';


const Feed = (props) => {
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [num, setNum] = useState(0);
    const [modalActive, setModalActive] = useState(false);
    const [commentsModalActive, setCommentsModalActive] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

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


    const commentChangeHandler = (event) => {
        setComment(event.target.value);
    };

    /* Handler for adding a comment */
    const commentClickHandler = async () => {
        setModalActive(true);
    };

    const getCommentsHandler = async (post) => {
        const res = await fetch('http://localhost:5000/api/comments/get-comments?postId=' + post.id);
        if (res.status === 200) {
            const data = await res.json();
            setComments(data.comments);
            setCommentsModalActive(true);
        } else {
            /* do something */
        }
    };


    const commentSubmitHandler = async (event, post) => {
        event.preventDefault();
        const res = await fetch('http://localhost:5000/api/comments/make-comment?postId=' + post.id, {
            method: 'POST',
            body: JSON.stringify({
                creator: authCtx.userId,
                content: comment
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.status === 200) {
            setComment('');
            setModalActive(false);
            setNum(prev => prev + 1);
        } else {
            /* do something */
        }
    };


    const xClickHandler = async () => {
        setModalActive(false);
        setCommentsModalActive(false);
    };

    return (
        <div className={modalActive ? styles.hidden : ''}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <div className={modalActive || commentsModalActive ? styles.overlay : ''}>
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
                                <div className={styles.comment_container}>
                                    <i className="fa fa-comment" onClick={commentClickHandler} />
                                    <h5 className={styles.comments} onClick={() => getCommentsHandler(post)}>{post.numComments} comments</h5>
                                </div>
                                {modalActive &&
                                    <Modal className={styles.modal}>
                                        <FontAwesomeIcon icon={faXmark} className={styles.x} onClick={xClickHandler} />
                                        <div className={styles.modal_content}>
                                            <form className={styles.comment_form} onSubmit={(event) => commentSubmitHandler(event, post)}>
                                                <textarea className={styles.comment_area} placeholder='Write a meaningful comment...' value={comment} onChange={commentChangeHandler} />
                                                <div className={styles.button_container}>
                                                    <button className={styles.button} type='submit'>Submit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </Modal>
                                }
                                {commentsModalActive && comments &&
                                    <Modal className={styles.modal}>
                                        <FontAwesomeIcon icon={faXmark} className={styles.x} onClick={xClickHandler} />
                                        <div className={styles.modal_comment_content}>
                                            {comments.map(comment => {
                                                return (
                                                    <div className={styles.list_comment}>
                                                        <h3 className={styles.comment_username}>@{comment.username}</h3>
                                                        <p className={styles.comment_content}>{comment.content}</p>
                                                        <hr className={styles.hr}></hr>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </Modal>
                                }
                            </div>
                        )
                    }
                    )}
                {posts.length === 0 && <div className={styles.post_container}><h1> No posts yet! </h1> </div>}
            </div>
        </div>
    )
};

export default Feed;