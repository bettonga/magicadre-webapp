import React, { useEffect, useState, useContext } from 'react';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { database } from '../firebase-config';
import { UserContext } from '../context/userContext';

import '../pages/Private/PrivateHome/PrivateHome.css'

function Dropdown() {
  const [frames, setFrames] = useState([]);
  // const [selectedFrameId, setSelectedFrameId] = useState('');
  const [names, setNames] = useState([]); // Tableau des noms correspondant aux frames
  const [bDelete, setBDelete] = useState(false);
  const [bAdd, setBAdd] = useState(false);
  const [addId, setAddId] = useState('')
  const { currentUser, selectedFrameId, setSelectedFrameId } = useContext(UserContext);
  const [modifError, setModifError] = useState("");

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {

        try {
          const docRef = doc(database, "users", currentUser.email);
          const userDocument = await getDoc(docRef);
          // console.log("Document data:", userDocument.data())

          if (userDocument.data()) {
            const userFrames = userDocument.data().reg_frames;
            setFrames(userFrames);

            // Sélectionnez la première frame par défaut si disponible
            if (userFrames.length > 0) {
              setSelectedFrameId(userFrames[0]);
            }
          } else {
            console.log('Aucun utilisateur trouvé avec cet email');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données :', error);
        }
      };

      fetchData();
    }
  }, [currentUser,setSelectedFrameId]);

  // Utilisez un effet pour récupérer tous les noms de frames
  useEffect(() => {
    const frameNames = [];
    if (currentUser) {
      const fetchFrameNames = async () => {

        for (const frameId of frames) {

          try {
            const docRef = doc(database, "frames", frameId);
            const docSnap = await getDoc(docRef);
            frameNames.push(docSnap.data().name)
          } catch (error) {
            console.error('Erreur lors de la récupération du name de la frame :', error);
          }
        }

        setNames(frameNames);
      };

      fetchFrameNames();
    }
  }, [frames, currentUser]);

  const handleFrameChange = (event) => {
    setSelectedFrameId(event.target.value);
    //console.log(selectedFrameId);
  };

  const handleChange = (event) => {
    setAddId(event.target.value);
  }

  const addFrame = () => {
    // fonction pour ajouter un cadre dans la database
    if (!bAdd) { setBAdd(true); }
    else { setBAdd(false); }
    setBDelete(false);
    setModifError("");
    setAddId("");
  }

  const deleteFrame = () => {
    // fonction pour supprimer le cadre sélectionner de la database
    if (!bDelete) { setBDelete(true); }
    else { setBDelete(false); }
    setBAdd(false);
    setModifError("");
    setAddId("");
  }

  const cancelFrame = () => {
    // fonction pour supprimer le cadre sélectionner de la database
    setBAdd(false);
    setBDelete(false);
    setModifError("");
    setAddId("");
  }

  const confirmDelete = async () => {
    try {
      const docRef = doc(database, 'users', currentUser.email );
      await updateDoc(docRef, {
        reg_frames: arrayRemove(selectedFrameId)
      });
      const userDoc = await getDoc(docRef);
      const userFrames = userDoc.data().reg_frames;
      setFrames(userFrames);
      // Sélectionnez la première frame par défaut si disponible
      if (userFrames.length > 0) {
        setSelectedFrameId(userFrames[0]);
      }
      else {
        setSelectedFrameId("");
      }
      setBDelete(false);
    } catch(error) {
      setModifError("erreur lors de la suppresion");
    }
  }

  const confirmAdd = async () => {
    try {
      const docRef = doc(database, 'users', currentUser.email );
      if (await checkFrameId(addId)) {
        await updateDoc(docRef, {
          reg_frames: arrayUnion(addId)
        });
        const userDoc = await getDoc(docRef);
        const userFrames = userDoc.data().reg_frames;
        setFrames(userFrames);
        if (userFrames.length > 0) {
          setSelectedFrameId(userFrames[0]);
        }
        else {
          setSelectedFrameId("");
        }
        setAddId("");
        setModifError("")
        setBAdd(false);
      }
      else {
        setModifError("ID invalide");
      }
    } catch(errror) {
      setModifError("ID invalide");
    }
  };

  const checkFrameId = async (id) => {
    const docRef = doc(database, "frames", id);
    const docSnap = await getDoc(docRef);

    return(docSnap.exists())
  }


  return (
    <>
      <div className="private-home-btn-group">
        <select className="private-home-select button" value={selectedFrameId} onChange={handleFrameChange}>
          {names.map((name, index) => (
            <option key={index} value={frames[index]}>
              {name || 'Chargement...'}
            </option>
          ))}
        </select>
        <button className="private-home-button button" onClick={deleteFrame}>-</button>
        <button className="private-home-button1 button" onClick={addFrame}>+</button>
      </div >

      {bAdd && (<div className="private-home-frame-add-group">
        <input
          // type="text" // override in modals.css ???
          value={addId}
          placeholder="ID Cadre"
          className="private-home-frame-textinput"
          onChange={handleChange}
        />
        <button className="private-home-frame-button4" onClick={confirmAdd}>Ajouter</button>
        <button className="private-home-frame-button2" onClick={cancelFrame}>annuler</button>
      </div>)}

      {bDelete && (<div className="private-home-frame-delete-group">
        <button className="private-home-frame-button3" onClick={confirmDelete}>Supprimer ?</button>
        <button className="private-home-frame-button2" onClick={cancelFrame}>annuler</button>
      </div>)}

      <p className="text-danger">{modifError}</p>
    </>
  );
}

export default Dropdown;
