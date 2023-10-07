import React, { useEffect, useState, useContext} from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { database } from '../firebase-config';
import { UserContext } from '../context/userContext';

function Dropdown() {
  const [frames, setFrames] = useState([]);
  const [selectedFrameId, setSelectedFrameId] = useState('');
  const [names, setNames] = useState([]); // Tableau des noms correspondant aux frames
  //const [userEmail, setUserEmail] = useState("");

  const {currentUser} = useContext(UserContext);
  
  //if (currentUser) {setUserEmail(currentUser.email);}
  //const userEmail = "test@test.com"

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        // Récupérez la référence à la collection "users" de Firestore
        const usersCollectionRef = collection(database, 'users');

        // Utilisez la méthode where pour filtrer les documents par email
        const q = query(usersCollectionRef, where('email', '==', currentUser.email));

        try {
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDocument = querySnapshot.docs[0];
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
  }, [currentUser.email]);

  // Utilisez un effet pour récupérer tous les noms de frames
  useEffect(() => {
    //const frameNames = ["Sélectionner un cadre"];
    const frameNames = [];
    if (currentUser) {
    const fetchFrameNames = async () => {

      for (const frameId of frames) {

        try {
            const docRef = doc(database, "frames", frameId);
            const docSnap = await getDoc(docRef);
            frameNames.push(docSnap.data().name)
            //console.log(docSnap.data().name);
        } catch (error) {
          console.error('Erreur lors de la récupération du name de la frame :', error);
        }
      }

      setNames(frameNames);
    };

    fetchFrameNames();
    }
  }, [frames]);

  const handleFrameChange = (event) => {
    setSelectedFrameId(event.target.value);
    //console.log(selectedFrameId);
  };

  return (
    <div>
      <label>Choisir un cadre :</label>
      <select className="form-select" value={selectedFrameId} onChange={handleFrameChange}>
        {names.map((name, index) => (
          <option key={index} value={frames[index]}>
            {name || 'Chargement...'}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
