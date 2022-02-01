import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import Navbar from "../NavBar/Navbar";
import RegistrationForm from "./RegistrationForm";
import UpdateForm from "./UpdateForm";

const Dashboard = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [farms, setFarms] = useState([{ gID: 1 }]);
    const [view, setView] = useState(true);
    
    // Fetching all the farms created by this user
    useEffect(() => {
        fetch("https://sleepy-lake-87613.herokuapp.com/v1/farms/", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({ email: loggedInUser.email }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setFarms(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [loggedInUser || view]);


    return (
        <div>
            <div>
                <Navbar></Navbar>
            </div>
            <div className="container">
                <div class="row justify-content-md-center mt-5">
                    <div class="col col-lg-2">
                        <button type="button" className="btn btn-outline-primary" onClick={() => setView(true)} >Register</button>
                    </div>
                    <div class="col col-lg-1">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setView(false)} >Update</button>
                    </div>
                </div>
            </div>
            <div style={{ display: view ? "block" : "none" }}>
                <RegistrationForm loggedInUser={loggedInUser} farms={farms}></RegistrationForm>
            </div>
            <div style={{ display: view ? "none" : "block" }}>
                <UpdateForm loggedInUser={loggedInUser} farms={farms}></UpdateForm>
            </div>
        </div>
    


    );
};

export default Dashboard;
