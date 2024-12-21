import classes from "./EditMatches.module.css";
import { BiCalendar, BiCheck, BiX } from "react-icons/bi";
import Button from "react-bootstrap/Button";
import { useEffect } from "react";
import React, { useState } from "react";
import axios from "axios";
import { BiPencil } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
const EditMatches = (props) => {
  const navigate = useNavigate();
  if(!localStorage.getItem("userType")||localStorage.getItem("userType")=="guest"){
    navigate("/");
  }
  const [venues, setVenues] = useState([]);
  const apiUrl1="http://localhost:3000/efamanager/stadiums";

useEffect(() => {
  
 
const fetchData = async () => {
try{
  const storedToken = localStorage.getItem("token");
  const response = await axios.get(apiUrl1,{
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json", // Adjust content type as needed
      },
    });
    console.log(response.data.stadiums);
    setVenues(response.data.stadiums);
  }
  catch (error) {
    console.error("Error fetching match details:", error);
    // alert(error.response.data.error);
  }


};
fetchData();
},[apiUrl1]);

  const today = new Date().toISOString().slice(0, 16);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    matchVenueName: undefined,
    dateTime: undefined,
    mainReferee: undefined,
    linesmen1: undefined,
    linesmen2: undefined,
  });

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,

    });
    console.log('Form submitted:', formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Close the popup after form submission
    const body=formData
    setPopupVisible(false);
    try {
      const id = props.matchId;
      const storedToken = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/efamanager/matches/${id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        }
      );
      // props.change(response.data);
      console.log("Server response:", response.data);
      //reload
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
      // alert(error.response.data.error);
    }
  };

  return (
    <div>
      <button className={classes.popup_button} onClick={togglePopup}>
        {" "}
        <BiPencil size={23} />
      </button>
      {isPopupVisible && (
        <div className={classes.popup}>
          <div className={classes.headers}>
            {" "}
            <h3>Fill Matche Details</h3>
            <button className={classes.close_button} onClick={togglePopup}>
              <BiX />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={classes.form_rows}>
              <div className={classes.form_columns}>
                <div className={classes.column1}>
                  <div>
                    
                    <label>
                      Match Venue:
                      <select
                        name="matchVenueName"
                        value={formData.matchVenueName}
                        onChange={handleChange}
                      >
                        <option value="">Select Venue</option>
                        {venues.map((venue) => (
                          <option key={venue.name} value={venue.name}>
                            {venue.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      Date & Time:
                      <input
                        type="datetime-local"
                        name="dateTime"
                        value={formData.dateTime}
                        onChange={handleChange}
                        min={today}
                      />
                    </label>
                  </div>
                  <div>
                 
                    <label>
                      Main Referee:
                      <input
                        type="text"
                        name="mainReferee"
                        value={formData.mainReferee}
                        onChange={handleChange}
                      />
                    </label>
                  </div>

                  <div>
                    <label>
                      Linesman 1:
                      <input
                        type="text"
                        name="linesmen1"
                        value={formData.linesmen1}
                        onChange={handleChange}
                      />
                    </label>
                  </div>

                  <div>
                  
                    <label>
                      Linesman 2:
                      <input
                        type="text"
                        name="linesmen2"
                        value={formData.linesmen2}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              {/* <button className={classes.sumbit_button} type="submit">Submit</button> */}
              <Button
                className={classes.sumbit_button}
                type="submit"
                variant="success"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditMatches;
