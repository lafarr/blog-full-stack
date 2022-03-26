import { useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import styles from './Profile.module.css';
import Navigation from "../navigation/Navigation";
import Dots from '../ui/dots-dropdown/Dots';
import { useLocation } from 'react-router-dom';
import pic from '../../images/clayfordswrath.jpg';

const Profile = props => {
    const authCtx = useContext(AuthContext);
    const history = useHistory();
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState(null);
    const [followers, setFollowers] = useState(null);
    const [following, setFollowing] = useState(null);
    const [isFollowing, setIsFollowing] = useState(null);
    const [num, setNum] = useState(0);
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const userId = queryParams.get('userId');

    useEffect(() => {
        const fun = async () => {
            const response = await fetch('http://localhost:5000/api/users/posts?userId=' + userId, {
                method: 'POST',
                body: JSON.stringify({
                    "token": authCtx.token,
                    "userId": authCtx.userId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 401) {
                authCtx.logout();
                history.push('/login');
            } else if (response.status !== 200 && response.status !== 401) {
                /* redirect to 404 page */
            } else {
                const data = await response.json();
                setUsername(data.user.username);
                setPosts(data.posts);
                setFollowers(data.user.followers);
                setFollowing(data.user.following);
                setIsFollowing(data.isFollowing);
            }
        };
        fun();
    }, [num, isFollowing, userId]);

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
            /* redirect to 404 */
        } else {
            setNum(prevNum => prevNum + 1);
        }
    };

    const buttonClickHandler = async event => {
        if (isFollowing) {
            try {
                const res = await fetch('http://localhost:5000/api/follow/', {
                    method: 'DELETE',
                    body: JSON.stringify({
                        token: authCtx.token,
                        followeeId: userId,
                        followerId: authCtx.userId
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (res.status === 401) {
                    authCtx.logout();
                    history.push('/login');
                } else if (res.status === 404) {
                    /* render 404 page */
                } else {
                    setIsFollowing(false);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                const response = await fetch('http://localhost:5000/api/follow', {
                    method: 'POST',
                    body: JSON.stringify({
                        token: authCtx.token,
                        followeeId: parseInt(userId),
                        followerId: parseInt(authCtx.userId)
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response);
                if (response.status === 401) {
                    authCtx.logout();
                    history.push('/login');
                } else if (response.status === 404) {
                    /* render 404 page */
                } else {
                    const data = await response.json();
                    setIsFollowing(true);
                    setFollowers(data.followers);
                    setNum(prevState => prevState + 1);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className={styles.container}>
            <Navigation />
            {username &&
                <>
                    <div className={styles.pic_container}>
                        <img className={styles.pic} src={pic} alt='A profile picture' />
                    </div>
                    <h1 className={styles.username}>@{username}</h1>
                    <div className={styles.followers_container}>
                        <div className={styles.followers_container2}>
                            <h5 className={styles.followers_label}>Followers</h5>
                            <h5 className={styles.followers}>{followers}</h5>
                        </div>
                        <div className={styles.following_container}>
                            <h5 className={styles.following_label}>Following</h5>
                            <h5 className={styles.following}>{following}</h5>
                        </div>
                    </div>
                    <div className={styles.button_container}>
                        {isFollowing === false && parseInt(authCtx.userId) !== parseInt(userId) &&
                            <button className={styles.follow_button} onClick={buttonClickHandler}>Follow</button>
                        }
                        {isFollowing === true && parseInt(authCtx.userId) !== parseInt(userId) &&
                            <button className={styles.following_button} onClick={buttonClickHandler}>Following</button>
                        }
                    </div>
                </>
            }
            {posts && posts.map(post => {
                return (
                    <div className={styles.post_container}>
                        {post.userId === parseInt(authCtx.userId) &&
                            <Dots postId={post.id} onDelete={() => deleteHandler(post.id)} />
                        }
                        <h1 className={styles.post_title}>{post.title}</h1>
                        <p className={styles.post_content}>{post.content}</p>
                    </div>
                )
            })}
            {posts.length === 0 && <div className={styles.post_container}><h1>No posts yet!</h1></div>}
        </div>
    )
}
export default Profile;