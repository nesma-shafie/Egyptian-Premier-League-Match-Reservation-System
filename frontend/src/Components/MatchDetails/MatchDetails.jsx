import React, { useEffect, useState } from "react";
import "./MatchDetails.css";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PiPersonSimpleRunBold } from "react-icons/pi";
import { FaRunning, FaFootballBall } from "react-icons/fa";
import { IoIosArrowForward as NavigationArrow } from "react-icons/io";
import { FiMapPin as MapPin } from "react-icons/fi";

export default function MatchDetails(props) {
  const navigate = useNavigate();

  if(!localStorage.getItem("userType")||localStorage.getItem("userType")==="guest"){
    navigate("/");
  }
  console.log("usertype in match details" + props.userType);
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [purchase, setPurchase] = useState(false);

  const handleSeatClick = (seatId,matchId) => {
   
      purchase_request(seatId,matchId);
    
  };
 
  const purchase_request = async (seatId,matchId) => {
  
    // Center the prompt on the screen
    const centerPrompt = (message, defaultValue) => {
      return new Promise((resolve) => {
      const promptContainer = document.createElement("div");
      promptContainer.style.position = "fixed";
      promptContainer.style.top = "50%";
      promptContainer.style.left = "50%";
      promptContainer.style.transform = "translate(-50%, -50%)";
      promptContainer.style.backgroundColor = "white";
      promptContainer.style.padding = "20px";
      promptContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
      promptContainer.style.zIndex = "1000";

      const label = document.createElement("label");
      label.textContent = message;

      const input = document.createElement("input");
      input.type = "text";
      input.value = defaultValue;
      input.style.fontSize = "1.2em";
      input.style.marginTop = "10px";

      const buttonContainer = document.createElement("div");
      buttonContainer.style.marginTop = "10px";
      buttonContainer.style.display = "flex";
      buttonContainer.style.justifyContent = "space-between";

      const okButton = document.createElement("button");
      okButton.textContent = "OK";
      okButton.onclick = () => {
        resolve(input.value);
        document.body.removeChild(promptContainer);
      };

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.onclick = () => {
        resolve(null);
        document.body.removeChild(promptContainer);
      };

      buttonContainer.appendChild(okButton);
      buttonContainer.appendChild(cancelButton);
      promptContainer.appendChild(label);
      promptContainer.appendChild(input);
      promptContainer.appendChild(buttonContainer);
      document.body.appendChild(promptContainer);
      });
    };

    const cardNumber = await centerPrompt("💳 Please enter your credit card number:", "1234-5678-9012-3456");
    if (cardNumber === null) {
      console.log("User canceled entering credit card information.");
      return;
    }

    const pin = await centerPrompt("🔒 Please enter your PIN:", "****");
    if (pin === null) {
      console.log("User canceled entering PIN.");
      return;
    }

      try {

        const id = props.matchId;
        const storedToken = localStorage.getItem("token");
       const  body={
          matchId:matchId,
           seatNumber:seatId, 
           creditCard:"123-456",
            pin: "1234"
        };
        console.log(body);

        console.log(storedToken);
        const response = await axios.post(
          `http://localhost:3000/user/reserve`,
          body,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json", // Adjust content type as needed
            },
          }
        );
        //alert user with their ticket number
        alert("Your ticket number is: " + response.data.id);
        //refresh page
        window.location.reload();
        // console.log('Server response:', response.errorMessage);
      } catch (error) {
        console.error("Error submitting form:", error);
        // alert(error.response.data.errorMessage);
      }
    
  };
  const cancelReservation = async (seatId,matchId) => {
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

  const [match, setMatch] = useState({});
  const { matchid } = useParams();
  const apiUrl = `http://localhost:3000/user/matches/${matchid}`;
  const storedToken = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl,{
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        });
        console.log("response", response.data);

        setMatch(response.data);
        console.log("response", response.data);
      } catch (error) {
        console.error("Error fetching match details:", error);
      }
    };

    fetchData();
  }, [apiUrl]);
  return (
    <div className="match-details">
      {purchase ? (
        <div className="overlay">
        
        </div>
      ) : null}
      <Container className="container-fluid match-details-container">
      <Row className="match-details-row">
          <Col>
            <p className="venue"><MapPin size={32} weight="thin" />

    {match.venue}</p>
          </Col>
        </Row>
        <Row className="match-details-row">
          <Col>
            <p className="official">{match.linesman1}</p>
          </Col>
          <Col>
            <p className="official">{match.mainReferee}</p>
          </Col>
          <Col>
            <p className="official">{match.linesman2}</p>
          </Col>
        </Row>
        <Row className="match-details-row">
          <Col className="match-details-teams">
            <div className="team-name">

              <p>  <FaFootballBall size={28} />{match.homeTeam}</p>
            </div>
            <div className="match-details-day-time">
              <p className="match-details-time">
                {match.dateTime ? match.dateTime.split("T")[1].split(".")[0] : ""}
              </p>
              <p className="match-details-day">
                {match.dateTime ? match.dateTime.split("T")[0] : ""}
              </p>
            </div>




            <div className="team-name">
              <p>                   <FaFootballBall size={28} />
              {match.awayTeam}</p>
            </div>
          </Col>
        </Row>
       
      </Container>

      <Row className="seats-row mt-4">
        {match.seats ? match.seats.map((seat) => (
          <Col
            key={seat.seatNo}
            xs={2} // Adjust size for responsiveness
            className={`seat-col ${
              seat.isReserved ? (seat.byMe ? "reserved-by-me" : "reserved") : ""
            } ${selectedSeats.includes(seat.seatNo) ? "selected" : ""}`}
            onClick={() => {
              if(localStorage.getItem("userType")=="USER")
             { if (!seat.isReserved  ) {
                handleSeatClick(seat.seatNo, match.id);
              } else if (seat.byMe) {
                cancelReservation(seat.seatNo, match.id);
              }}
            }}
          >
            <div className={`seat ${seat.isReserved ? (seat.byMe ? "seat-reserved-by-me" : "seat-reserved") : ""}`}>
              {seat.seatNo}
            </div>
          </Col>
        )) : ""}
      </Row>
    </div>
  );
}
