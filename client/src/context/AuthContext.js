import React, { useState } from 'react';

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    username: '',
    userId: '',
    login: (token, username, userId) => {},
    logout: () => {},
})

export const AuthContextProvider = props => {
    const initialToken = localStorage.getItem('token');
    const initialUsername = localStorage.getItem('username');
    const initialUserId = localStorage.getItem('userId');
    const [token, setToken] = useState(initialToken);
    const [username, setUsername] = useState(initialUsername);
    const [userId, setUserId] = useState(initialUserId)
    const userIsLoggedIn = !!token;

    const loginHandler = (token, username, userId) => {
        setToken(token);
        setUsername(username);
        setUserId(userId);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);
    }
    const logoutHandler = () => {
        setToken(null);
        setUsername(null);
        setUserId(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
    }
    const changeHandler = (username) => {
        setUsername(username);
        localStorage.setItem('username', username);
    }
    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        username: username,
        userId: userId,
        login: loginHandler,
        logout: logoutHandler,
        change: changeHandler
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
};
export default AuthContext;