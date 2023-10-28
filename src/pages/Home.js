import React, { useContext } from "react";
import { UserContext } from "../context/userContext";
import { ImageCropper } from "../components/ImageCropper";
import { useNavigate } from "react-router-dom";

import { Helmet } from "react-helmet";

import Header from "../components/header";
import "./home.css";

export default function Home(props) {
  const { toggleUpload, currentUser, toggleUploadModal } =
    useContext(UserContext);
  //const userEmail = 'test@test.com'; // Remplacez par l'email de l'utilisateur actuel

  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Helmet>
        <title>Magicadre - Home</title>
        <meta property="og:title" content="Magicadre" />
      </Helmet>
      <Header rootClassName="header-root-class-name1"></Header>
      <div className="home-hero">
        <div className="home-container1">
          <h1 className="home-text">
            <span>Loin des yeux,</span>
            <br></br>
            <span>Près du coeur</span>
            <br></br>
          </h1>
          <span className="home-text5">
            Sélectionnez un cadre parmi ceux enregistrés puis choisissez une
            photo à envoyer
          </span>
          <div className="home-container2">
            {currentUser ? (
              <button
                //onClick={() => toggleUploadModal("upload")}
                onClick={() => navigate("/private/private-home")}
                className="home-button button"
              >
                Envoyer une photo !
              </button>
            ) : (
              <>
                <button className="home-button button"
                  disabled>
                  Se connecter !
                </button>
              </>
            )}
            {/* <button className="home-button button">Envoyer</button> */}
          </div>
        </div>
        <img
          alt="image"
          src="https://images.unsplash.com/photo-1525498128493-380d1990a112?ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDI0fHxtaW5pbWFsaXNtJTIwZ3JlZW58ZW58MHx8fHwxNjI1ODQxMDcw&amp;ixlib=rb-1.2.1&amp;h=1200"
          className="home-image"
        />
      </div>
    </div>
  );
}
