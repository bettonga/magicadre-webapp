import ReactDOM from "react-dom";
import React, { useEffect, useRef, useState, ChangeEvent, useContext } from "react";
import { Cropper, CropperRef } from "react-mobile-cropper";
import { UserContext } from "../context/userContext";
import "react-mobile-cropper/dist/style.css";
import "./ImageCropper.css";

export const ImageCropper = () => {
  const inputRef = useRef(null);
  const cropperRef = useRef();

  const [image, setImage] = useState(require("./logo512.png"));

  const onUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onCrop = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      const newTab = window.open();
      if (newTab && canvas) {
        newTab.document.body.innerHTML = `<img src="${canvas.toDataURL()}"></img>`;
      }
    }
  };

  const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
    event.target.value = "";
  };

  useEffect(() => {
    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className="example">
      <div className="example__cropper-wrapper">
        <Cropper
          ref={cropperRef}
          className="example__cropper"
          backgroundClassName="example__cropper-background"
          src={image}
        />
      </div>
      <div className="example__buttons-wrapper">
        <button className="btn btn-primary mr-5" onClick={onUpload}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onLoadImage}
          />
          Upload image
        </button>
        {image && (
          <button className="btn btn-primary" onClick={onCrop}>
            Download result
          </button>
        )}
      </div>
    </div>
  );
};

//ReactDOM.render(<Example />, document.getElementById("root"));
