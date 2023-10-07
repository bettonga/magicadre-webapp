import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../context/userContext";
//import { useNavigate } from 'react-router-dom'
import Dropdown from "./Dropdown";
import { ImageCropper } from "./ImageCropper";
import { normalizeCenter } from "react-advanced-cropper";

export default function UploadModal() {
  const { modalState, toggleUploadModal, signIn } = useContext(UserContext);

  const [validation, setValidation] = useState("");

  //const navigate = useNavigate();

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
      toggleUploadModal("close");
      //navigate("/private/private-home")
    } catch (err) {
      setValidation("Email and/or password incorrect, please reload the page");
    }
  };

  const closeUploadModal = () => {
    setValidation("");
    toggleUploadModal("close");
  };

  return (
    <>
      {modalState.uploadModal && (
        <div className="position-fixed top-0 vw-100 vh-100">
          <div
            onClick={() => closeUploadModal()}
            className="w-100 h-100 bg-dark bg-opacity-75"
          ></div>
          <div
            className="position-absolute top-50 start-50 translate-middle"
            style={{ minWidth: "400px" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Envoyer une photo</h5>
                  <button
                    onClick={() => closeUploadModal()}
                    className="btn-close"
                  ></button>
                </div>

                <div className="modal-body">
                  <form
                    ref={formRef}
                    onSubmit={handleForm}
                    className="upload-form"
                  >
                    <div className="mb-3">
                      <Dropdown />
                    </div>

                    <div className="mb-3 row justify-content-md-center">
                      <button
                        type="button"
                        className="btn btn-link btn-sm m-2 col"
                      >
                        Ajouter cadre
                      </button>
                      <button className="btn btn-link btn-sm m-2 col">
                        Supprimer
                      </button>
                    </div>

                    <div className="d-grid gap-2 col-6 mx-auto mb-3">
                      <button type="button" className="btn btn-primary btn-lg">
                        Choisir un fichier
                      </button>
                    </div>

                    {/* <div>
                                    <ImageCropper></ImageCropper>
                                </div> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
