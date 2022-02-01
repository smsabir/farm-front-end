import React, { useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';
import { handleSignOut, initializeLoginFramework } from '../Login/LoginManager';
import './Navbar.css';
initializeLoginFramework();

const Navbar = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    let history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    
    
    
    const signOut = () => {
        handleSignOut()
        .then(res => {
            handleResponse(res, false);
        });
    }

    const handleResponse = (res, redirect) => {
        setLoggedInUser(res);
        redirect ? history.replace(from) : history.replace();
    }
    
    return (
        <div className="header-part">
                {/* <img src={logo} className="logo" alt=""/> */}
            <div className="menu">
                <Link to="/home">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="#">Blog</Link>
                <Link to="#">Contact</Link>
                {
                  loggedInUser.email? <Link onClick={signOut} id="button">{loggedInUser.displayName || loggedInUser.name || "New User"} &nbsp; 
                  </Link> : <Link to="/login" id="button"><i className="bi bi-box-arrow-left"></i> Login</Link>
                }
            </div>
            
        </div>
    );
};

export default Navbar;