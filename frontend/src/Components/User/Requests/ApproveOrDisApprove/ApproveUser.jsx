import React, { useState } from "react";
import axios from "axios";
import { BiCheck } from "react-icons/bi";
import Button from "react-bootstrap/Button";

import classes from "./ApproveUser.module.css";

const ApproveUser = (props) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const showPopup = () => setPopupVisible(true);
  const hidePopup = () => setPopupVisible(false);

  const handleApprove = async () => {
    try {
      // Make the API request to the delete endpoint using Axios
      console.log(props.id);
      const  userId= props.id
      const storedToken = localStorage.getItem("token");
      console.log(`http://localhost:3000/siteadmin/users/approve_user/${userId}`);
      const body={}
      const response = await axios.post(
        `http://localhost:3000/siteadmin/users/approve_user/${userId}`,
        body,
       
        {
          headers: {
            
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Item Approved successfully!");
      } else {
        console.error("Error approving item:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.response);
      alert(error.response.message);
    }
    props.onApprove();
    hidePopup();
  };
  return (
    <div>
      <button className={classes.popup_button} onClick={showPopup}>
        <BiCheck color="green" />
      </button>
      {isPopupVisible && (
        <div className={classes.popup}>
          <p className={classes.deleteText}>
            Are you sure you want to Approve user?
          </p>
          <div className={classes.buttons}>
            <Button
              className={classes.cancel_button}
              onClick={handleApprove}
              variant="success"
            >
              Approve
            </Button>
            <Button
              className={classes.delete_button}
              onClick={hidePopup}
              variant="danger"
            >
              cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveUser;
