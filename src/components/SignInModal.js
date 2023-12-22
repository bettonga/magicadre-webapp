import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

import "./modals.css";

export default function SignInModal() {
  const { modalState, toggleModals, signIn } = useContext(UserContext);

  const [validation, setValidation] = useState("");
  const [forgotPwd, setForgotPwd] = useState(false);

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

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
      await signIn(email, pwd);
      formRef.current.reset();
      closeModal();
      navigate("/send");
    } catch (err) {
      // setValidation("Email and/or password incorrect, please reload the page");
      setForgotPwd(true);
    }
  };

  const closeModal = () => {
    setValidation("");
    setForgotPwd(false);
    setEmail("");
    setPwd("");
    toggleModals("close");
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePwd = (event) => {
    setPwd(event.target.value);
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
            <div style={{ marginBottom: 12 }}>
              <span> Pas de compte ? Cliquer</span>
              <button onClick={() => { closeModal(); toggleModals("signUp"); }} style={{ color: "blue" }} > ici </button>
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
                  value={email}
                  onChange={handleChangeEmail}
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
                  value={pwd}
                  onChange={handleChangePwd}
                ></input>
                <p className="text-danger">{validation}</p>
              </div>
              <button type="submit" className="registerbtn">
                Se connecter
              </button>
              {forgotPwd && (<div>
                <span>Mot de passe oublié ? Cliquer</span>
                <button onClick={() => { closeModal(); toggleModals("forgot"); }} style={{ color: "blue" }} > ici </button>
              </div>)}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
