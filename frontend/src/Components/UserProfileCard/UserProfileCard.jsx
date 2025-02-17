import React from "react";
import "./UserProfileCard.css";

const UserProfileCard = (props) => {
  return (
    <div className="upc">
      <div className="profile-down">
        <div className="profile-title">{props.data.username}</div>
        <div className="profile-button">{props.data.email}</div>
        <div className="profile-button">{props.data.firstName} {props.data.lastName}</div>
        <div className="profile-button">{props.data.gender}</div>
        <div className="profile-button">{props.data.address}</div>
        <div className="profile-button">{props.data.city}</div>
        <div className="profile-button">{new Date(props.data.birthDate).getMonth() + 1 < 10 ? '0' : ''}{new Date(props.data.birthDate).getMonth() + 1}/{new Date(props.data.birthDate).getMonth() < 10 ? '0' : ''}{new Date(props.data.birthDate).getDate()}/{new Date(props.data.birthDate).getFullYear()}</div>
      </div>
    </div>
  );
};

export default UserProfileCard;
