import React, { useContext } from "react";
import { UserContext } from "../context/userContext";
import { ImageCropper } from "../components/ImageCropper";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { toggleUpload, currentUser, toggleUploadModal } =
    useContext(UserContext);
  //const userEmail = 'test@test.com'; // Remplacez par l'email de l'utilisateur actuel

  const navigate = useNavigate();

  return (
    <>
      <div className="container p-5 w-70">
        <h1 className="display-2 text-light">Loin des yeux, près du coeur</h1>
        <>
          {currentUser ? (
            <p className="text-light">
              {" "}
              Choisi un cadre pour envoyer une photo {currentUser.email}{" "}
            </p>
          ) : (
            <p className="text-light">
              {" "}
              Connecte toi pour retrouver tes cadres favoris{" "}
            </p>
          )}
        </>
      </div>

      <div className="container p-5 w-70">
        {currentUser ? (
          <button
            //onClick={() => toggleUploadModal("upload")}
            onClick={() => navigate("/private/private-home")}
            className="btn btn-primary btn-lg"
          >
            Envoyer une photo !
          </button>
        ) : (
          <>
            <button className="btn btn-secondary btn-lg">
              {/* disabled> */}
              Envoyer une photo !
            </button>
            <p className="text-danger mt-1">non connecté</p>{" "}
          </>
        )}
      </div>

      {/* <div className="container p-5 w-50">
            <div>
                {currentUser ? <Dropdown /> : <select class="form-select" disabled></select>}
                <p className='text-danger mt-1'> {!currentUser && "yoy"} </p>
            </div>
        </div> */}
    </>
  );
}
