// import { Routes, Route } from "react-router-dom";
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/send" element={<PrivateHome />} />
      </Routes>
    </>
  );
}

// function App() {
//   return (
//     <Router>
//       <>
//         <SignUpModal />
//         <SignInModal />
//         <ForgotModal />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/send" element={<PrivateHome />} />
//         </Routes>
//       </>
//     </Router>
//   );
// }

export default App;
