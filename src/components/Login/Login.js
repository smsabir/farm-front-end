import React, { useContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { UserContext } from '../../App';
import './Login.css';
import { createUserWithEmailAndPassword, handleGoogleSignIn, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManager';

const Login = () => {

    
    initializeLoginFramework();
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [newUser, setNewUser] = useState(true);
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
    });
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    const [errorMsg, setError] = useState();

    const handleBlurField = (event) => {
        setError('');
        let isFieldValid = true;
        if (event.target.name === 'email') {

            isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
            if (isFieldValid) {
                const newUserInfo = { ...user };
                newUserInfo[event.target.name] = event.target.value;
                setUser(newUserInfo);

            }
        }
        if (event.target.name === 'password') {
            const isPasswordValid = event.target.value.length > 6 && /\d{1}/.test(event.target.value);
            isFieldValid = isPasswordValid;
        }

        const password = document.querySelector('input[name=password]');
        const confirm = document.querySelector('input[name=repeatPassword]');
        
        if (newUser) {


            if (isFieldValid && confirm.value === password.value) {
                confirm.setCustomValidity('');
                const newUserInfo = { ...user };
                newUserInfo[event.target.name] = event.target.value;
                setUser(newUserInfo);
            } else {
                confirm.setCustomValidity('Passwords does not match! Double Check!');
            }
        }
        else {
            const newUserInfo = { ...user };
            newUserInfo[event.target.name] = event.target.value;
            setUser(newUserInfo);
        }

    }

    const handleSubmit = (e) => {
        if (newUser && user.name && user.repeatPassword) {
            createUserWithEmailAndPassword(user.name, user.email, user.repeatPassword)
                .then(res => {
                    handleResponse(res, true);
                })
        }

        if (!newUser && user.email && user.password) {
            signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                })
            e.preventDefault();
        }
        e.preventDefault();
    }

    const googleSignIn = () => {
        handleGoogleSignIn()
            .then(res => {
                handleResponse(res, true);
            });
    }

    const handleResponse = (res, redirect) => {
        setUser(res);
        setLoggedInUser(res);
        let shouldRedirect;
        if (res.error) {
            shouldRedirect = false;
            setError(res.error);
            
        }
        else {
            shouldRedirect = redirect;
        }
        shouldRedirect ? history.replace(from) : history.replace();
    }


    let checked;
    return (
        <div>
            {/* <div className="header-container">
                <Header></Header>
            </div> */}
            <p></p>
            <div className="signup-form">
                {
                    newUser ? <h3>Create an account</h3> : <h3>Login here</h3>
                }
                <div id="error-message">
                    <p className="error-message">{errorMsg}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    {
                        newUser && <input type="text" name="name" onBlur={handleBlurField} placeholder="Name" required />
                    }
                    <input type="email" id="email" name="email" onBlur={handleBlurField} placeholder="Email" required />
                    <input type="password" name="password" onBlur={handleBlurField} placeholder="Password" required />
                    {
                        newUser ? <input type="password" id="repeatPassword" name="repeatPassword" onBlur={handleBlurField} placeholder="Confirm Password" required /> : <><input type="checkbox" name="checkbox" checked={checked} onClick={!checked} /><label htmlFor="checkbox"> Remeber me</label><br /> </>
                    }
                    <input type="submit" value={newUser ? 'Create an account' : 'Sign in'} />
                    <p>{newUser ? 'Have an account?' : 'No account?'}<a onClick={() => setNewUser(!newUser)} style={{ color: "green" }}> {newUser ? 'Sign in' : 'Create an account'}</a></p>
                </form>
            </div>
            <div className="other-signin">
                <p>-------------------- Or --------------------</p>
                <div>
                    <button onClick={googleSignIn} className="signin-button"><i className="fa fa-google fa-2x"></i> Continue with Google</button>
                </div>

            </div>
        </div>
    );
};

export default Login;