import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import GroupDetails from "./pages/GroupDetails";
import Groups from "./pages/Groups";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          classname: "",
          style: {
            fontFamily: "sans-serif",
            fontWeight: 700,
            fontSize: "14px",
          },
        }}
      />
      <div className="app glass">
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
    </>
  );
}

export default App;
