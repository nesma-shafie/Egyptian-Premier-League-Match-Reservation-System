import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "./ProfilePage.css";
import DatePicker from "react-datepicker";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ProfilePage = (props) => {
  const navigate = useNavigate();
  if (!localStorage.getItem("userType") || localStorage.getItem("userType") === "guest") {
    console.log("in");
    navigate("/");
    // window.location.reload();
    }
  const [fname, setFName] = useState(props.data.firstName);
  const [lname, setLName] = useState(props.data.lastName);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedDate, setSelectedDate] = useState(props.data.birthDate);
  const [gender, setGender] = useState(props.data.gender);
  const [city, setCity] = useState(props.data.city);
  const [address, setAddress] = useState(props.data.address);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("token");
    const body = {
      firstName: fname,
      lastName: lname,
      gender: gender,
      address: address,
      city: city,
      birthDate: selectedDate,
    };
    console.log(body);
    try {
      const response = await axios.put(
        "http://localhost:3000/user/",
        body,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        }
      );
      if (response.status === 200) {
        console.log("Updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // alert(error.response.data.errorMessage);
    }
  };

  return (
    <div>
      <Container className="profileContainer">
        <h1>EDIT PROFILE</h1>
        <Row>
          <Col md={6}>
            <Form>
             
              <Form.Label>First Name</Form.Label>
              <Form.Control
                className="form-control"
                type="text"
                placeholder="Enter Name"
                value={fname}
                required
                onChange={(e) => setFName(e.target.value)}
              ></Form.Control>
             
              <Form.Group
                controlId="dateControl"
                className="date-picker-control"
              >
                <Form.Group controlId="cityControl">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <Form.Group controlId="addressControl">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Form.Group>
                </Form.Group>
                <Form.Label>Birthdate</Form.Label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="MM/dd/yyyy"
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                />
              </Form.Group>
            </Form>
          </Col>
          <Col md={6}>
            <Form>
              
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={lname}
                onChange={(e) => setLName(e.target.value)}
              ></Form.Control>
                
              <Form.Group controlId="genderControl">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="roleControl">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  className="form-control"
                  type="text"
                  placeholder="Enter Name"
                  value={props.data.role}
                  disabled
                ></Form.Control>
              </Form.Group>
              <Button type="submit" varient="primary" onClick={handleSubmit}>
                Update
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;
