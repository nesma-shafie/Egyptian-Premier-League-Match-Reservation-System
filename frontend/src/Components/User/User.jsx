import React from "react";
import { Col } from "react-bootstrap";
import { FaLocationDot } from "react-icons/fa6";
import { FaUser, FaTransgender, FaBirthdayCake } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import "./User.css";

export default function User(props) {
  return (
    <div className="delete-user">
      <p className="delete-user-email">
        <MdOutlineEmail />
        {props.user.email}
      </p>
      <p className="delete-user-username">UserName: {props.user.username}</p>
      <p className="delete-user-name">{props.user.firstName} {props.user.lastName}</p>

      <p className="delete-user-location">
        <FaLocationDot />
        {props.user.address}
      </p>
    
      <div className="delete-user-info">
        <p>
          Birthdate:
          {new Date(props.user.birthDate).getMonth() + 1 < 10 ? '0' : ''}{new Date(props.user.birthDate).getMonth() + 1}/{new Date(props.user.birthDate).getMonth() < 10 ? '0' : ''}{new Date(props.user.birthDate).getDate()}/{new Date(props.user.birthDate).getFullYear()}
        </p>
      </div>
        <div>
        <p>
          <FaTransgender className="delete-user-p-icon" />
          {props.user.gender}
        </p>
        </div>
      
    </div>
  );
}
