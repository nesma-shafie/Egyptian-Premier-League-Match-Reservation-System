import React, { useState, useEffect } from "react";
import "./ViewStadium.css";
import { Container, Row, Col } from "react-bootstrap";
import CreateStadium from "../CreateStadium/CreateStadium";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewStadium(props) {
  const navigate = useNavigate();
  //print(type)
// cons

  useEffect(() => {
    console.log(localStorage.getItem("userType"));
    if (!localStorage.getItem("userType") || localStorage.getItem("userType") === "guest") {
      console.log("in");
      navigate("/");
      return;
      // window.location.reload();
    }
  }, [navigate]);
  const [stadiumes, setStadiumData] = useState([]);
  const apiUrl = "http://localhost:3000/efamanager/stadiums"; // Replace with your actual API endpoint

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        });
        setStadiumData(response.data.stadiums);
      } catch (error) {
        console.error("Error fetching match details:", error);
        // alert(error.response.data.error);
      }
    };

    fetchData();
  }, [apiUrl]);

  function changeStadiums(updatedStadium) {
    console.log("inchange");
    console.log(updatedStadium);
    setStadiumData((prevStadiums) => [...prevStadiums, updatedStadium.data]);

  
  }
  return (
    <div>
      <Container className="stadiumes-container">
        <Row className="stadiumes-header">
          <Col className="stadiumes-header-column">
            <h2>Stadium</h2>
            {props.userType == "EFAManager" && (
              <CreateStadium change={changeStadiums}></CreateStadium>
            )}
          </Col>
        </Row>
        <Row className="stadiumes">
          {stadiumes.map((item) => (
            <Col md={3} >
              <div className="stadium">
                <h1>{item.name}</h1>
                <div className="stadium-seats">
                  <p>{item.numberOfSeats} seats</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default ViewStadium;
