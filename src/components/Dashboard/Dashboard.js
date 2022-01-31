import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import Navbar from "../NavBar/Navbar";

const Dashboard = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [farms, setFarms] = useState([{ gID: 1 }]);
    const [file, setFile] = useState(null);
    const [selection, setSelection] = useState({});
    const [info, setInfo] = useState([]);

    // Fetching all the farms created by this user
    useEffect(() => {
        fetch("http://localhost:4000/v1/farms/", {
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
                data[1].length && setFarms(data);
            })
            .catch((error) => {
                console.error(error);
            });
        console.log(farms)
    }, []);

    const handleSelection = (e) => {
        const name = e.target.name;

        if (name === "selection") {
            const id = e.target.value;
            const name = e.target.selectedOptions[0].text;
            setSelection({ id, name })
        }
        else {
            const newFile = e.target.files[0];
            setFile(newFile)
        }

    }

    const uploadButtonStatus = () => {
    
        if (file?.size && selection?.id) {
            return false;
        }
        else {
            return true;
        }
    }

    const handleFileUpload = (e) => {
        e.preventDefault();
        console.log(selection, file)

        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', selection.id);
        formData.append('name', selection.name);


        fetch("http://localhost:4000/v1/farms/convert_csv", {
            method: "POST",
            body: formData,
            
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                document.forms['fileUpload'].reset();
                setFile(null);
                setSelection("");
            })
            .catch((error) => {
                console.log(error);
            });
        // console.log(formData.file);
    }


    const handleFormBlur = (e) => {
        let addInfo = { ...info };
        addInfo[e.target.name] = e.target.value;
        setInfo(addInfo);
        console.log(info)
    };


    loggedInUser.email
        ? (info["creator"] = loggedInUser.email)
        : console.log("user not found");

    // Submitting the Farm registration Data
    const handleSubmit = (e) => {
        e.preventDefault();

        //assigning the generated ID
        info.id = farms[0]?.gID;

        fetch("http://localhost:4000/v1/farms/add", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(info),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                document.forms['addFarm'].reset();
                setInfo([]);
            })
            .catch((error) => {
                console.error(error);
            });
        console.log(info)
    };

    return (
        <div>
            <div>
                <Navbar></Navbar>
            </div>
            <div className="container">
                <div className="col-md-6 col-sm-6 col-xs-12 mb-5">
                    <form method="POST" name="fileUpload" onSubmit={(e) => handleFileUpload(e)}>
                        <div className="form-group mb-2">
                            <label htmlFor="farmSelection">Select your Farm</label>
                            <select className="form-control" name="selection" id="farmSelection" onChange={handleSelection}>
                                {
                                    farms[1]?.length && farms[1]?.map(farm => <option key={farm.id} value={farm.id}>{farm.name}</option>)
                                }
                            </select>
                        </div>
                        <div className="form-group mb-2">
                            <input name="file" onChange={handleSelection} type="file" className="form-control" id="inputFile" />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary" disabled={uploadButtonStatus()}>
                                Insert all Data
                            </button>
                        </div>
                    </form>

                </div>
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <form
                        className="row g-3"
                        method="post"
                        name="addFarm"
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        <div className="">
                            <label htmlFor="inputName" className="form-label"></label>
                            <input
                                onBlur={handleFormBlur}
                                name="name"
                                type="text"
                                className="form-control"
                                id="inputAddress"
                                placeholder="Luca's Farm"
                                min="2"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputCity" className="form-label"></label>
                            <input
                                onBlur={handleFormBlur}
                                type="text"
                                className="form-control"
                                id="inputCity"
                                name="city"
                                min="2"
                                placeholder="City"

                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="ID" className="form-label"></label>
                            <input
                                type="text"
                                className="form-control"
                                id="farmID"
                                name="id"
                                placeholder={`Your Farm ID ${farms[0]?.gID}`}
                                readOnly={true}
                                disabled={true}
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputZip" className="form-label"></label>
                            <input
                                onBlur={handleFormBlur}
                                type="text"
                                className="form-control"
                                id="inputZip"
                                name="zip"
                                placeholder="ZIP Code"
                                required
                                min="2"
                                
                            />
                        </div>
                        <div>
                            <label htmlFor="inputCountry" className="form-label"></label>
                            <input
                                onBlur={handleFormBlur}
                                type="text"
                                className="form-control"
                                id="inputCity"
                                name="country"
                                placeholder="Country"

                                min="3"
                                required
                            />
                        </div>
                        <div>
                            <label className="control-label" htmlFor="date"></label>
                            <input
                                onBlur={handleFormBlur}
                                className="form-control"
                                id="date"
                                placeholder="Established in MM/DD/YYY"
                                type="date"
                                name="established"
                                required
                            />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary">
                                Register the farm
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>

    );
};

export default Dashboard;
