import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../context/userContext";
import { database } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import {getAuth, sendPasswordResetEmail} from "firebase/auth"
import { auth } from "../firebase-config";

import "./modals.css";

export default function SignUpModal() {
  const { modalState, toggleModals, signUp } = useContext(UserContext);

  const [validation, setValidation] = useState("");

  const navigate = useNavigate();

  const inputs = useRef([]);
  const addInputs = (el) => {
    if (el && !inputs.current.includes(el)) {
      inputs.current.push(el);
    }
  };
  const formRef = useRef();

  const handleForm = async (e) => {
    e.preventDefault();
    const userEmail = inputs.current[0].value;    
    sendPasswordResetEmail(auth,userEmail).then(function() {
      toggleModals("close");
    }).catch(function(error) {
      // An error happened.
    });
  };

  const closeModal = () => {
    setValidation("");
    toggleModals("close");
  };

  return (
    <>
      {modalState.forgotModal && (
        <div className="background">
          <div
            className="background-opacity"
            onClick={() => closeModal()}
          ></div>
          <div className="container-modal">
            <div className="modal-header">
              <h1>Mot de passe oublié</h1>
              <button className="close" onClick={() => closeModal()}>
                &times;
              </button>
            </div>
            <form ref={formRef} onSubmit={handleForm}>
              <div>
                <label htmlFor="signInEmail">
                  <b>Adresse mail</b>
                </label>
                <input
                  ref={addInputs}
                  type="text"
                  placeholder="Entrer l'adresse mail"
                  name="email"
                  id="signInEmail"
                  required
                ></input>
              </div>
              <p className="text-danger">{validation}</p>
              <button type="submit" className="registerbtn">
                Envoyer le lien de réinitialisation
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
