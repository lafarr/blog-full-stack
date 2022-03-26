import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import styles from './Dots.module.css';

const Dots = props => {
    const [clicked, setClicked] = useState(false);
    const [del, setDelete] = useState(false);

    const dotsClickHandler = event => {
        setClicked(prevState => !prevState);
    };

    const mouseOutHandler = event => {
        setClicked(false);
        setDelete(false);
    };

    return (
        <div className={styles.container} onMouseLeave={mouseOutHandler}>
            <button className={styles.dots} onClick={dotsClickHandler}>
                <FontAwesomeIcon icon={faEllipsis} />
            </button>
            {clicked &&
                <div>
                    <div className={styles.dropdown}>
                        <Link to={`/posts/edit-post?postId=${props.postId}`} className={styles.option}>Edit</Link>
                        <button className={styles.option} onClick={() => setDelete(true)}>Delete</button>
                    </div>
                    {del &&
                        <div className={styles.confirm}>
                            <div className={styles.content}>
                                <h4 className={styles.confirm_prompt}>Are you sure?</h4>
                                <button className={styles.confirm_button} onClick={() => {
                                    props.onDelete();
                                    setClicked(false);
                                }}>Confirm
                                </button>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
};

export default Dots;