import React, { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";

import PropTypes from "prop-types";

import "./header.css";

export default function Header(props) {
  const { toggleModals, currentUser } = useContext(UserContext);

  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch {
      alert("Unable to log out, please retry");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="header-container">
      <h1 className="" onClick={() => navigate("/")}>
        {props.heading}
      </h1>
      <div className="header-btn-group">
        {!currentUser ? (
          <>
            <button
              className="header-login button"
              onClick={() => toggleModals("signIn")}
            >
              {props.Login}
            </button>
            <button
              className="header-register button"
              onClick={() => toggleModals("signUp")}
            >
              {props.Register}
            </button>
          </>
        ) : (
          <button className="header-login1" onClick={logOut}>
            {props.Login1}
          </button>
        )}
      </div>
    </div>
  );
};

Header.defaultProps = {
  heading: "Magicadre",
  Login: "Se connecter",
  Register: "S'enregistrer",
  Login1: "Se déconnecter",
  rootClassName: "",
};

Header.propTypes = {
  heading: PropTypes.string,
  Login: PropTypes.string,
  Register: PropTypes.string,
  Login1: PropTypes.string,
  rootClassName: PropTypes.string,
};

// export default Header;
