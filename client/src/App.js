import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import GroupDetails from "./pages/GroupDetails";
import Groups from "./pages/Groups";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <div className="app">
        
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:id" element={<GroupDetails />} />
          </Routes>
        </Router>

      </div>
      
      <ToastContainer />
    </>
  );
}

export default App;
