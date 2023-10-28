import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

import "./modals.css";

export default function SignInModal() {
  const { modalState, toggleModals, signIn } = useContext(UserContext);

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

    try {
      await signIn(inputs.current[0].value, inputs.current[1].value);
      formRef.current.reset();
      setValidation("");
      toggleModals("close");
      navigate("/private/private-home");
    } catch (err) {
      setValidation("Email and/or password incorrect, please reload the page");
    }
  };

  const closeModal = () => {
    setValidation("");
    toggleModals("close");
  };

  return (
    <>
      {modalState.signInModal && (
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
              </div>
              <p className="text-danger">{validation}</p>
              <button type="submit" className="registerbtn">
                Se connecter
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
