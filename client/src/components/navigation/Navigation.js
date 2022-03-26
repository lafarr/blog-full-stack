import styles from './Navigation.module.css';
import authContext from "../../context/AuthContext";
import { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import pic from '../../images/clayfordswrath.jpg';

const Navigation = props => {
    const history = useHistory();
    const options = ['Profile', 'Edit Account Details', 'Log out']
    let i = 0
    const authCtx = useContext(authContext);
    const isLoggedIn = authCtx.isLoggedIn;
    const [dropdownIsActive, setDropdownIsActive] = useState(false);

    const logoutHandler = event => {
        authCtx.logout();
    };

    const dropdownClickHandler = event => {
        setDropdownIsActive((prevState) => !prevState);
    };

    const profileClickHandler = event => {
        setDropdownIsActive((prevState) => !prevState);
        history.push('/users?userId=' + authCtx.userId);
    };

    const accountClickHandler = event => {
        setDropdownIsActive((prevState) => !prevState);
        history.push('/account?userId=' + authCtx.userId)
    };

    const logoutClickHandler = event => {
        setDropdownIsActive((prevState) => !prevState);
        authCtx.logout();
    };

    const mouseOutHandler = event => {
        setDropdownIsActive((prevState) => !prevState);
    }

    const funs = [profileClickHandler, accountClickHandler, logoutClickHandler];
    return (
        <div className={styles.container}>
            <ul>
                <NavLink className={styles.link} to='/' activeStyle={{ color: 'dodgerblue' }}><FontAwesomeIcon icon={faHouse} /></NavLink>
                {!isLoggedIn && <NavLink className={styles.link} to='/login' exact activeStyle={{ color: 'dodgerblue' }}>Log
                    in </NavLink>}
                {isLoggedIn &&
                    <>
                        <NavLink className={styles.link} id={styles.link_three} to='/make-post' exact
                            activeStyle={{ color: 'dodgerblue' }}><FontAwesomeIcon
                                icon={faPenToSquare} /></NavLink>
                        <button onClick={dropdownClickHandler} className={styles.link}><img src={pic}
                            className={styles.profile} />
                        </button>
                        {dropdownIsActive
                            &&
                            <div className={styles.dropdown_container}>
                                <ul className={styles.dropdown} onMouseLeave={mouseOutHandler}>
                                    {options.map(option => {
                                        const curr = funs[i++];
                                        return <button className={styles.item} onClick={curr}>{option}</button>
                                    })
                                    }
                                </ul>
                            </div>
                        }
                    </>
                }
            </ul>
        </div>
    )
};

export default Navigation;