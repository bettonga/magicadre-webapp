import React, { useRef, useState, ChangeEvent, useContext } from "react";
// import { ImageCropper } from "../../../components/ImageCropper";
import { Cropper } from "react-mobile-cropper";
import { Helmet } from 'react-helmet'
import { storage } from "../../../firebase-config";
import { ref, uploadBytes } from "firebase/storage";
import { UserContext } from '../../../context/userContext';
import { Image } from "image-js";


import Header from '../../../components/header'
import './PrivateHome.css'
import Dropdown from "../../../components/Dropdown";


export default function PrivateHome() {
  const inputRef = useRef(null);
  const cropperRef = useRef();

  const { selectedFrameId } = useContext(UserContext);

  const [validation, setValidation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // const [image, setImage] = useState(require("./logo512.png"));
  const [image, setImage] = useState("");

  const [defaultImage, setDefaultImage] = useState(require("./logo512.png"));

  const onUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const palette = [
    [0, 0, 0],       // Noir
    [255, 255, 255], // Blanc
    [0, 255, 0],     // Vert
    [0, 0, 255],     // Bleu
    [255, 0, 0],     // Rouge
    [255, 255, 0],   // Jaune
    [255, 170, 0]    // Orange
  ];

  const findClosestColorIndex = (color) => {
    let minDistance = Infinity;
    let closestColorIndex = 0;

    for (let i = 0; i < palette.length; i++) {
      const paletteColor = palette[i];
      const distance = Math.sqrt(
        Math.pow(color[0] - paletteColor[0], 2) +
        Math.pow(color[1] - paletteColor[1], 2) +
        Math.pow(color[2] - paletteColor[2], 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColorIndex = i;
      }
    }

    return closestColorIndex;
  };

  const applyFloydSteinberg = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        const oldR = data[idx];
        const oldG = data[idx + 1];
        const oldB = data[idx + 2];
        const pixelColor = [oldR, oldG, oldB];

        const closestColorIndex = findClosestColorIndex(pixelColor);
        const closestColor = palette[closestColorIndex];

        data[idx] = closestColor[0];
        data[idx + 1] = closestColor[1];
        data[idx + 2] = closestColor[2];

        const errR = pixelColor[0] - closestColor[0];
        const errG = pixelColor[1] - closestColor[1];
        const errB = pixelColor[2] - closestColor[2];

        if (x + 1 < width) {
          distributeError(data, width, height, x + 1, y, errR, errG, errB, 7 / 16);
        }
        if (x - 1 > 0 && y + 1 < height) {
          distributeError(data, width, height, x - 1, y + 1, errR, errG, errB, 3 / 16);
        }
        if (y + 1 < height) {
          distributeError(data, width, height, x, y + 1, errR, errG, errB, 5 / 16);
        }
        if (x + 1 < width && y + 1 < height) {
          distributeError(data, width, height, x + 1, y + 1, errR, errG, errB, 1 / 16);
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const distributeError = (data, width, height, x, y, errR, errG, errB, factor) => {
    const idx = (y * width + x) * 4;

    data[idx] = Math.max(0, Math.min(255, data[idx] + errR * factor));
    data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + errG * factor));
    data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + errB * factor));
  };

  const rescaleImage = (canvas, targetWidth, targetHeight) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;

    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(tempCanvas, 0, 0);

    return canvas;
  };

  const uploadImageToFirebase = async (canvas) => {
    // Convertir le canvas en un Blob au format image/png
    if (image!==""){
      if (selectedFrameId !== "") {
        const blob = createBinaryFileFromImage(canvas);
        // canvas.toBlob((blob) => {
          // Créer une référence vers le bucket Firebase Storage
          const filepath = '/' + selectedFrameId + '.bmp';
          // console.log(filepath)
          const storageRef = ref(storage, filepath);
  
          // Chemin complet pour le fichier dans le storage Firebase
          // const fileRef = storageRef.child(fileName);
  
          // Upload du Blob (l'image) sur Firebase Storage
          uploadBytes(storageRef, blob).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            setErrorMsg("");
            setValidation("photo envoyée !");
          }).catch((error) => {
            console.error('Error uploading image:', error);
            setErrorMsg("la photo n'a pas été envoyée");
            setValidation("");
          });
        // });
        // }, 'image/bmp');
      }
      else {
        setErrorMsg("aucun cadre sélectionné, appuyer sur + pour en ajouter un");
        setValidation("");
      }
    }
    else {
      setErrorMsg("aucune photo sélectionnée");
      setValidation("");
    }
  };

  // Tableau de correspondance des couleurs selon la palette spécifiée
const colorMap = {
  [0b0000]: [0, 0, 0],        // Noir
  [0b0001]: [255, 255, 255],  // Blanc
  [0b0010]: [0, 255, 0],      // Vert
  [0b0011]: [0, 0, 255],      // Bleu
  [0b0100]: [255, 0, 0],      // Rouge
  [0b0101]: [255, 255, 0],    // Jaune
  [0b0110]: [255, 170, 0]     // Orange
};

// Fonction pour convertir une couleur RGB en une valeur binaire selon la palette
function getColorIndex(rgb) {
  let minDistance = Infinity;
  let closestColorIndex = 0;

  for (const [index, color] of Object.entries(colorMap)) {
    const distance = Math.sqrt(
      Math.pow(rgb[0] - color[0], 2) +
      Math.pow(rgb[1] - color[1], 2) +
      Math.pow(rgb[2] - color[2], 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColorIndex = index;
    }
  }

  return closestColorIndex;
}

// Fonction pour créer un fichier binaire basé sur les couleurs de l'image
function createBinaryFileFromImage(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  const binaryData = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const pixelColor = [data[idx], data[idx + 1], data[idx + 2]];
      const colorIndex = getColorIndex(pixelColor);
      binaryData.push(colorIndex);
    }
  }

  // Convertir les valeurs binaires en un fichier binaire
  const binaryFile = new Uint8Array(binaryData);

  // Enregistrement du fichier binaire
  const blob = new Blob([binaryFile], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  // Télécharger le fichier (facultatif - à des fins de démonstration)
  // const link = document.createElement('a');
  // link.href = url;
  // link.download = 'image.bin';
  // link.click();

  // Retourner le fichier binaire
  return blob;
}


  const onCrop = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        // Étape 1: Scaling de l'image
        rescaleImage(canvas, 800, 480);
        applyFloydSteinberg(canvas);
        uploadImageToFirebase(canvas);
      }
      // const newTab = window.open();
      // if (newTab && canvas) {
      //   newTab.document.body.innerHTML = `<img src="${canvas.toDataURL()}"></img>`;
      // }
    }
  };

  const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
    event.target.value = "";
  };

  return (
    <div className="private-home-container">
      <Helmet>
        <title>PrivateHome - Dependable Regal Lobster</title>
        <meta
          property="og:title"
          content="PrivateHome - Dependable Regal Lobster"
        />
      </Helmet>
      <Header rootClassName="header-root-class-name"></Header>
      <div className="private-home-hero">
        <div className="private-home-container1">
          {image !== "" ? (
          <Cropper
            ref={cropperRef}
            src={image}
            className={'cropper'}
            stencilProps={{
              aspectRatio: 800 / 480
            }}
          />) : (
          <Cropper
            ref={cropperRef}
            src={defaultImage}
            className={'cropper'}
            stencilProps={{
              aspectRatio: 800 / 480
            }}
          />)}
        </div>
        <div className="private-home-container2">
          <h1 className="private-home-text1">
            C&apos;est ici que la magie opère
          </h1>
          <h2 className="private-home-text2">
            Choisis un magicadre et une photo à envoyer
          </h2>
          <Dropdown />
          <div className="private-home-btn-group1">
            <label className="private-home-button2 button"
              onClick={onUpload}>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={onLoadImage}
              />
              Choisir une photo
            </label>
            {/* {image && ( */}
            <button className="private-home-button3 button"
              onClick={onCrop}>
              Envoyer
            </button>
            {/* )} */}
          </div>
          <p className="text-valid">{validation}</p>
          <p className="text-danger">{errorMsg}</p>
        </div>
      </div>
    </div>
  );
}
