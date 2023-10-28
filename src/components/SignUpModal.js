import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../context/userContext";
import { database } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";

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

    if (inputs.current[1].value.length !== inputs.current[2].value.length) {
      setValidation("Passwords do not match");
    } else if (
      (inputs.current[1].value.length || inputs.current[2].value.length) < 6
    ) {
      setValidation("Password should be at least 6 characters long");
    }

    try {
      const cred = await signUp(
        inputs.current[0].value,
        inputs.current[1].value
      );
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(database, "users"), {
        email: inputs.current[0].value,
        reg_frames: [],
      });
      formRef.current.reset();
      setValidation("");
      toggleModals("close");
      navigate("/private/private-home");
    } catch (err) {
      if (err.code === "auth/invalid-email") {
        setValidation("Email format is invalid");
      }
      if (err.code === "auth/email-already-in-use") {
        setValidation("Email already used");
      }
    }
  };

  const closeModal = () => {
    setValidation("");
    toggleModals("close");
  };

  return (
    <>
      {modalState.signUpModal && (
        <div className="background">
          <div
            className="background-opacity"
            onClick={() => closeModal()}
          ></div>
          <div className="container-modal">
            <div className="modal-header">
              <h1>Se connecter</h1>
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

                <label htmlFor="signInPwd">
                  <b>Mot de passe</b>
                </label>
                <input
                  ref={addInputs}
                  type="password"
                  placeholder="Entrer le mot de passe"
                  name="psw"
                  id="signInPwd"
                  required
                ></input>

                <label htmlFor="repeatPwd">
                  <b>Mot de passe</b>
                </label>
                <input
                  ref={addInputs}
                  type="password"
                  placeholder="Entrer à nouveau le mot de passe"
                  name="psw"
                  id="repeatPwd"
                  required
                ></input>
              </div>
              <p className="text-danger">{validation}</p>
              <button type="submit" className="registerbtn">
                S'enregistrer
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
