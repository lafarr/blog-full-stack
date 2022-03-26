// import './App.css';
import Login from './components/login/Login';
import Feed from './components/feed/Feed';
import Signup from './components/signup/Signup';
import MakePost from './components/make-post/MakePost';
import Profile from './components/profile/Profile';
import EditPost from './components/edit-post/EditPost';
import { Redirect, Route, Switch } from 'react-router-dom';
import MyAccount from "./components/account-details/MyAccount";
import Error from './components/error-page/Error';
import IndividualPost from './components/individual-post/IndividualPost';

function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path="/">
                    <Feed />
                </Route>
                <Route exact path='/home'>
                    <Redirect to='/' />
                </Route>
                <Route exact path='/feed'>
                    <Redirect to='/' />
                </Route>
                <Route exact path="/login">
                    <Login />
                </Route>
                <Route exact path="/signup">
                    <Signup />
                </Route>
                <Route exact path='/account'>
                    <MyAccount />
                </Route>
                <Route exact path='/make-post'>
                    <MakePost />
                </Route>
                <Route exact path='/users'>
                    <Profile />
                </Route>
                <Route exact path='/posts/edit-post'>
                    <EditPost />
                </Route>
                <Route exact path='/posts'>
                    <IndividualPost />
                </Route>
                <Route path='/'>
                    <Error />
                </Route>
            </Switch>
        </div>
    )
}

export default App;
