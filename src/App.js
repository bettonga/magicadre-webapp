import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SignUpModal from "./components/SignUpModal";
import SignInModal from "./components/SignInModal";
import UploadModal from "./components/UploadModal";
import Private from "./pages/Private/Private";
import PrivateHome from "./pages/Private/PrivateHome/PrivateHome";
import ForgotModal from "./components/ForgotModal";

import './style.css'

function App() {
  return (
    <>
      <SignUpModal />
      <SignInModal />
      <ForgotModal />
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/send" element={<PrivateHome />} />
        {/* <Route path="/private" element={<Private />}>
          <Route path="/private/private-home" element={<PrivateHome />} />
        </Route> */}
      </Routes>
    </>
  );
}

export default App;
