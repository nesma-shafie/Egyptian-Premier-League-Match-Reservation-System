import React, { useState, useEffect } from "react";
import "./ViewMatches.css";
import { Container, Row, Col } from "react-bootstrap";
import { FaLocationDot } from "react-icons/fa6";
import CreateMatches from "../CreateMatches/CreateMatches.jsx";
import EditMatches from "../EditMatches/EditMatches.jsx";
import axios from "axios";
import { PiPersonSimpleRunBold } from "react-icons/pi";
import { FaRunning, FaFootballBall } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function ViewMatches(props) {
  const navigate = useNavigate();
 
  const [matches, setMatchData] = useState([]);
  const apiUrl = "http://localhost:3000/user/matches"; // Replace with your actual API endpoint

  useEffect(() => {
    if(!localStorage.getItem("userType")||localStorage.getItem("userType")==="guest"){
      navigate("/");
    }
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        });

        setMatchData(response.data);
      } catch (error) {
        console.error("Error fetching match details:", error);
        // alert(error.response.data.error);
      }
    };

    fetchData();
  }, [apiUrl]);

  function changeMatches(updatedmatch) {
    console.log("after change", updatedmatch);
    setMatchData((prevMatches) => {
      return prevMatches.map((match) => {
        if (match.id == updatedmatch.match.id) {
          return { ...match, ...updatedmatch.match };
        } else {
          return match;
        }
      });
    });
  }
  function changeMatcheCreate(updatedMatch) {
    setMatchData((prevMatches) => [...prevMatches, updatedMatch.match]);
  }
  const handleChildClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div>
      <Container className="matches-container">
        <Row className="matches-header">
          <Col className="matches-header-column">
            <p>Matches</p>
            {props.userType == "EFAManager" && (
              <CreateMatches change={changeMatcheCreate}></CreateMatches>
            )}
          </Col>
        </Row>
        <Row className="matches justify-content-start">
          {matches.map((item, i) => (
            <Col md={3} key={i}>
              <div className="match">
                <div className="view-match-edit" onClick={handleChildClick}>
                  {props.userType == "EFAManager" && (
                    <EditMatches
                      matchId={item.id}
                      change={changeMatches}
                    ></EditMatches>)
                  }
                </div>
                <a
                  href={
                    localStorage.getItem("userType") == "guest" ||
                    localStorage.getItem("userType") == null
                      ? "/signin"
                      : /MatchDetails/ + item.id
                  }
                >
                  <div className="match-teams">
                    <div className="match-team match-team-left">
                    <div><FaFootballBall size={28} /></div>  

                      <p>{item.homeTeam}</p>
                    </div>
                    <div className="match-day-time">
                      <p className="match-time">
                       {item.dateTime.split('T')[1].substring(0, 5)}
                      </p>
                      <p className="match-day">
                     {  new Date(item.dateTime).toLocaleDateString(undefined, {hour12: true})}
                      </p>
                    </div>

                    <div className="match-team match-team-right">
                    <div><FaFootballBall size={28} /></div>  

                      <p>{item.awayTeam}</p>
                    </div>
                  </div>
                  <div className="match-location">
                  <i class="fa-sharp fa-solid fa-location-dot"></i>
                    <p>
                      {item.venue}
                    </p>
                  
                  </div>
                </a>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
