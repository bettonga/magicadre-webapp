import { createContext, useState, useEffect } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth"
import { auth } from "../firebase-config";


export const UserContext = createContext()

export function UserContextProvider(props) {

    const signUp = (email, pwd) => createUserWithEmailAndPassword(auth, email, pwd)
    const signIn = (email, pwd) => signInWithEmailAndPassword(auth, email, pwd)

    const [selectedFrameId, setSelectedFrameId] = useState('');

    const [currentUser, setCurrentUser] = useState();
    const [loadingData, setLoadingData] = useState(true);
    const image = require("./logo512.png");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setCurrentUser(currentUser)
            setLoadingData(false)
        })
        return unsubscribe;

    }, [])

    // modal
    const [modalState, setModalState] = useState({
        signUpModal: false,
        signInModal: false,
        forgotModal: false
    })

    const toggleModals = modal => {
        if (modal === "signIn") {
            setModalState({
                signUpModal: false,
                signInModal: true,
                forgotModal: false
            })
        }
        if (modal === "signUp") {
            setModalState({
                signUpModal: true,
                signInModal: false,
                forgotModal: false
            })
        }
        if (modal === "close") {
            setModalState({
                signUpModal: false,
                signInModal: false,
                forgotModal: false
            })
        }
        if (modal === "forgot") {
            setModalState({
                signUpModal: false,
                signInModal: false,
                forgotModal: true
            })
        }
    }

    return (
        <UserContext.Provider value={{ modalState, toggleModals, signUp, signIn, currentUser, image, selectedFrameId, setSelectedFrameId}}>
            {!loadingData && props.children}
        </UserContext.Provider>
    )
}