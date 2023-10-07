import { createContext, useState, useEffect } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth"
import { auth } from "../firebase-config";


export const UserContext = createContext()

export function UserContextProvider(props){

    const signUp = (email, pwd) => createUserWithEmailAndPassword(auth, email, pwd)
    const signIn = (email, pwd) => signInWithEmailAndPassword(auth, email, pwd)

    const [currentUser, setCurrentUser] = useState();
    const [loadingData, setLoadingData] = useState(true);

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
        signInModal: false
    })
    const [uploadModalState, setUploadModalState] = useState({
        uploadModal: false
    })

    const toggleModals = modal => {
        if (modal === "signIn") {
            setModalState({
                signUpModal: false,
                signInModal: true
            })
        }
        if (modal === "signUp") {
            setModalState({
                signUpModal: true,
                signInModal: false
            })
        }
        if (modal === "close") {
            setModalState({
                signUpModal: false,
                signInModal: false
            })
        }
    }

    const toggleUploadModal = modal => {
        if (modal === "upload") {
            setModalState({
                uploadModal: true
            })
        }
        if (modal === "close") {
            setModalState({
                uploadModal: false
            })
        }
    }

    return (
        <UserContext.Provider value={{modalState, toggleModals, toggleUploadModal, signUp, signIn, currentUser}}>
            {!loadingData && props.children}
        </UserContext.Provider>
    )
}