import React, { useEffect,useState } from "react";
import "./DeleteUser.css";
import { Container, Row, Col } from "react-bootstrap";
import User from "../User";
import DeletePopUp from '../DeleteUser/DeletePopup/DeletePopUp';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DeleteUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  useEffect(() => {
  if (!localStorage.getItem("userType") || localStorage.getItem("userType") === "guest") {
    console.log("in");
    navigate("/");
    }
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/siteadmin/users",{
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json' // Adjust content type as needed
        }
      });
        setUsers(response.data.users);
        console.log("response", response.data.users);
      } catch (error) {
        console.error('Error fetching user reservations:', error);
      }
    };
    fetchData();
  }, []);

  function handleDelete(index) {
    setUsers((users) => {
      const updatedUsers = [...users];
      updatedUsers.splice(index, 1);
      return updatedUsers;
    });
  }

  return (
    <div>
      <Container className="matches-container">
        <Row className="matches-header">
          <Col className="matches-header-column">
            <p>Users</p>
          </Col>
        </Row>
        <Row className="matches justify-content-start">
          {users.map((item, i) => (
            <Col md={3} key={i} className="delete-popup">
              <div className='delete-popup-icon'>
                <DeletePopUp userId={item.id} onDelete={()=>handleDelete(i)}/>
              </div>
              <User user={item}  />
            </Col>
            ))}
        </Row>
      </Container>
    </div>
  );
}
