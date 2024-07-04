// Home.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import APIService from '../services/APIService';
import AudioRecorder from "./AudioRecorder";

function Home() {
  const [username, setUsername] = useState<string>("");
  const [motto, setMotto] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      let token = localStorage.getItem('token');
      
      if (token) {
        try {
          const apiService = APIService.getInstance();
          const response = await apiService.request("/user", "GET", undefined, true);
          console.log(response);
          if (response.username) {
            setUsername(response.username);
            setMotto(response.motto);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login"); // Redirect to login page after logout
  };

  const handleMottoChange = (newMotto: string) => {
    setMotto(newMotto);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        {username ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h5" style={{ margin: 0 }}>
                    👤
                  </Typography>
                </div>
                <Typography variant="subtitle1" style={{ marginTop: '5px' }}>
                  {username}
                </Typography>
              </div>
              <Typography variant="body1">
                "{motto}"
              </Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
                <AudioRecorder onMottoChange={handleMottoChange} />
              </Button>
              <Button variant="contained" color="secondary" onClick={handleLogout}>
                <LogoutIcon /> Logout
              </Button>
            </div>

          </>
        ) : (
          <Typography variant="body1">
            Please <Link to="/login">login</Link> or{" "}
            <Link to="/register">register</Link>.
          </Typography>
        )}
      </div>
    </div>
  );
}

export default Home;
