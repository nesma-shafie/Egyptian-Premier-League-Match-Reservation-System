import classes from "./CreateStadium.module.css";
import { BiCalendar, BiCheck, BiX } from "react-icons/bi";
import Button from "react-bootstrap/Button";

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CreateStadium = (props) => {
  

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    numberOfSeats: 0,
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
    // console.log('Form submitted:', formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Close the popup after form submission
    setPopupVisible(false);
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/efamanager/stadium",
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        }
      );
      //refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error.message);
      // alert(error.response.data.error);
    }
  };

  return (
    <div>
      <Button
        className={classes.popup_button}
        variant="success"
        onClick={togglePopup}
      >
        Add
      </Button>

      {isPopupVisible && (
        <div className={classes.popup}>
          {/* <div className="popup-content"> */}
          <div className={classes.headers}>
            {" "}
            <h3>Fill Stadium Details</h3>
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
                      Name:
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
               

                  <div>
                    {" "}
                    <label>
                      nimber of seats:
                      <input
                        type="number"
                        name="numberOfSeats"
                        min="0"
                        value={formData.numberOfSeats}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
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

export default CreateStadium;
