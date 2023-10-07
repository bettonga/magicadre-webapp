import React, { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import { ImageCropper } from "../../../components/ImageCropper";

export default function PrivateHome() {
  const { toggleUpload, currentUser, toggleUploadModal } =
    useContext(UserContext);

  return (
    <>
      <div className="container p-5">
        <div>
          <ImageCropper></ImageCropper>
        </div>
      </div>
    </>
  );
}
