import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../context/userContext";
import { database } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

import "./modals.css";

export default function SignUpModal() {
  const { modalState, toggleModals, signUp } = useContext(UserContext);

  const [validation, setValidation] = useState("");

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [rptPwd, setRptPwd] = useState("");

  const inputs = useRef([]);
  const addInputs = (el) => {
    if (el && !inputs.current.includes(el)) {
      inputs.current.push(el);
    }
  };
  const formRef = useRef();

  const handleForm = async (e) => {
    setValidation("");
    e.preventDefault();

    if (pwd !== rptPwd) {
      setValidation("Passwords do not match");
    } else if (pwd.length < 6) {
      setValidation("Password should be at least 6 characters long");
    }
    else {
      try {
        const cred = await signUp(
          email.toLowerCase(),
          pwd
        );

        const docRef = await setDoc(doc(database, "users", email.toLowerCase()),{
          reg_frames: [],
      })
        formRef.current.reset();
        closeModal();
        navigate("/send");
      } catch (err) {
        if (err.code === "auth/invalid-email") {
          setValidation("Email format is invalid");
        }
        if (err.code === "auth/email-already-in-use") {
          setValidation("Email already used");
        }
      }
    }
  };

  const closeModal = () => {
    setValidation("");
    setEmail("");
    setPwd("");
    setRptPwd("");
    toggleModals("close");
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePwd = (event) => {
    setPwd(event.target.value);
  };

  const handleChangeRptPwd = (event) => {
    setRptPwd(event.target.value);
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
              <h1>S'enregistrer</h1>
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
                  onChange={handleChangeEmail}
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
                  onChange={handleChangePwd}
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
                  onChange={handleChangeRptPwd}
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
