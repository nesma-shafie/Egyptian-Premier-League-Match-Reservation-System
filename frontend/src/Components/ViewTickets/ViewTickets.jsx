import React, { useState, useEffect } from "react";
import "./ViewTickets.css";
import { Container, Row, Col } from "react-bootstrap";
import { FcCancel } from "react-icons/fc";
import {  FaFootballBall } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios"
;
export default function ViewTickets() {
  const navigate = useNavigate();
  if (!localStorage.getItem("userType") || localStorage.getItem("userType") === "guest") {
    console.log("in");
    navigate("/");
    }
  const apiUrl = `http://localhost:3000/user/tickets`;
  const [matches, setMatches] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await axios.get(
         apiUrl,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json", // Adjust content type as needed
            },
          }
        );
        setMatches(response.data);
        console.log("response", response.data);
      } catch (error) {
        console.error("Error fetching user reservations:", error);
        // alert(error.response.data.error);
      }
    };
    fetchData();
  }, [apiUrl]);
  const cancelReservation = async (seatId,matchId) => {
    console.log(seatId,matchId);
    //prompt to confirm cancelation
    const confirmCancel = window.confirm("Are you sure you want to cancel this reservation?");
    if (!confirmCancel) {
      return;
    } 
    try {
      const storedToken = localStorage.getItem("token");
      const  body={
        matchId:matchId,seatNo:seatId
      };
      console.log(body);
      
      const response = await axios.post(
        `http://localhost:3000/user/cancel`,
        body,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json", // Adjust content type as needed
            },
          }
        );
      //refresh page
      window.location.reload();
      // console.log('Server response:', response.errorMessage);
    } catch (error) {
      console.error( error);

      // alert(error.response.data.error);
    } 
  }


  function isDateWithinThreeDays(date) {
    const matchDate = new Date(date);
    console.log(matchDate);
    const currentDate = new Date();
    const diffDays = Math.ceil((matchDate - currentDate) / (1000 * 3600 * 24));
    return (diffDays >= 3)
  }
  return (
    <div>
      <Container className="matches-container">
        <Row className="matches-header">
          <Col className="matches-header-column">
            <p>Tickets</p>
          </Col>
        </Row>
        <Row className="matches justify-content-start">
          {matches.map((item) => (
            <Col md={3} key={item._id}>
              <div className="match">
                {isDateWithinThreeDays(item.match.dateTime) ? (
                  <FcCancel
                    className="ticket-cancel"
                    onClick={() => cancelReservation(item.seat.seatNo,item.match.id)}
                  />
                ) : null}
                <div className="ticket">ticketNO: {item.id} ,  SeatNO: {item.seat.seatNo}</div>
                <div className="match-teams">
                  <div className="match-team match-team-left">
                    <div><FaFootballBall size={28} /></div>
                    <p>{item.match.homeTeam.name}</p>
                  </div>
                  <div className="match-day-time">
                    <p className="match-time">
                      {(item.match.dateTime).split("T")[1].split(".")[0]}
                    </p>
                    <p className="match-day">
                      {new Date(item.match.dateTime).toLocaleDateString(undefined, { hour12: true })}
                    </p>
                  </div>
                  <div className="match-team match-team-right">
                    <div><FaFootballBall size={28} /></div>
                    <p>{item.match.awayTeam.name}</p>
                  </div>
                </div>
           
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
