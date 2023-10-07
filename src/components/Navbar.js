import React, { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";

export default function Navbar() {
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
    <nav className="navbar navbar-light bg-light px-4">
      <Link to="/" className="navbar-brand">
        Magicadre
      </Link>

      <div>
        {!currentUser ? (
          <>
            <button
              onClick={() => toggleModals("signUp")}
              className="btn btn-primary"
            >
              Sign Up
            </button>

            <button
              onClick={() => toggleModals("signIn")}
              className="btn btn-primary ms-2"
            >
              Sign In
            </button>
          </>
        ) : (
          <button onClick={logOut} className="btn btn-danger ms-2">
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}
