import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history=useHistory();
  let user=localStorage.getItem("username");

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        {hasHiddenAuthButtons ? (
           <Button
           className="explore-button"
           startIcon={<ArrowBackIcon />}
           variant="text"
           onClick={() => history.push("/")}
         >
           Back to explore
         </Button>
        ):(user ?
          (
            <Stack direction="row" spacing={2}>
      <img src="avatar.png" alt={user} />
      <span className="userStyle">{user}</span>
      <Button className="button" name="logout" onClick={()=> {
        localStorage.clear();
        history.push("/");
        window.location.reload();}}>
       
        LOGOUT
      </Button>
      </Stack>
          ):
          (<Stack direction="row" spacing={2}>
          <Button  className="explore-button" onClick={()=> {
            
            history.push("/login")}}>
            LOGIN
          </Button>
          <Button className="button" onClick={()=> {
            
            history.push("/register")}}>
          REGISTER
        </Button>
        </Stack>)

        )}
      
       

      </Box>
    );
};

export default Header;
