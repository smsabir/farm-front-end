import React, { useState } from 'react';


const UpdateForm = ({ loggedInUser, farms }) => {
    const [info, setInfo] = useState([]);
    const [message, setMessage] = useState("");
 

    const handleFormBlur = (e) => {
        const value = e.target.value;
        if(value !==""){
        let addInfo = { ...info };
        addInfo[e.target.name] = e.target.value;
        setInfo(addInfo);
        }
        
        console.log(info)
    };

    const handleSelection = (e) => {
        setMessage('');
        const name = e.target.name;
        if (name === "selection") {
            const value = e.target.value;
            const name = e.target.selectedOptions[0].text;
            const sel = farms[1].find( arr => arr._id === value)
            setInfo(sel)
            console.log(sel)
        }
        uploadButtonStatus();
    }
    const uploadButtonStatus = () => {

        if (info?.id) {
            return false;
        }
        else {
            return true;
        }
    }


    loggedInUser.email
        ? (info["creator"] = loggedInUser.email)
        : console.log("user not found");

    // Submitting the Farm registration Update Data
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("https://sleepy-lake-87613.herokuapp.com/v1/farms/update", {
            method: "PUT",
            body: JSON.stringify(info),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                document.forms['updateFarm'].reset();
                setMessage(data.message)
                setInfo([]);
            })
            .catch((error) => {
                console.error(error);
            });
        console.log(info)
    };

    const handleDelete = (e) => {
        e.preventDefault();
        fetch("https://sleepy-lake-87613.herokuapp.com/v1/farms/delete", {
            method: "DELETE",
            body: JSON.stringify(info),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                document.forms['updateFarm'].reset();
                setMessage(data.message)
                setInfo([]);
            })
            .catch((error) => {
                console.error(error);
                setMessage(error)
            });
        console.log(info)
        console.log("clicked")
    }
    return (
        <div className="container">
            <div className="row justify-content-center mt-5 .bg-light.bg-gradient">
            
                <div className="col-md-6 col-sm-6 col-xs-12 border p-3">
                <h4 className='text-center m-3'>Update / Delete Your Farm Data</h4>
                    
                    <form
                        className="row g-3"
                        method="post"
                        name="updateFarm"
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        
                        <div className="form-group mb-2">
                            <label htmlFor="farmSelection">Select your Farm</label>
                            <select className="form-control mt-2" name="selection" id="farmSelection" onChange={handleSelection}>
                                {
                                    farms[1]?.length && farms[1]?.map(farm => <option key={farm.id} value={farm._id}>{farm.name}</option>)
                                }
                            </select>
                            <a  type="text" className="btn btn-outline-danger mt-3" onClick={(e) => handleDelete(e)}>Delete Farm</a>
                            <h5 className='text-center.text-info p-2'>{message}</h5>
                        </div>
                        <div className="">
                            <label htmlFor="inputName" className="form-label"></label>
                            <input
                                onBlur={handleFormBlur}
                                name="name"
                                type="text"
                                className="form-control"
                                id="inputAddress"
                                placeholder={info?.name || "Luca's Farm"}
                                min="2"
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
                                placeholder={info?.city || "City"}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="ID" className="form-label"></label>
                            <input
                                type="text"
                                className="form-control"
                                id="farmID"
                                name="id"
                                placeholder={`Your Farm ID ${info?.id}`}
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
                                placeholder={info?.zip || "ZIP Code"}
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
                                placeholder={info?.country || "Country"}
                                min="3"
                                
                            />
                        </div>
                        <div>
                            <label className="control-label" htmlFor="date"></label>
                            <input
                                onBlur={handleFormBlur}
                                className="form-control"
                                id="date"
                                placeholder={info?.established || "Established in MM/DD/YYY"}
                                type="date"
                                name="established"
                                
                            />
                        </div>
                        <div>
                        <button type="submit" className="btn btn-primary" disabled={uploadButtonStatus()}>
                                Update Farm Data
                        </button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateForm;