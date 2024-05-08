import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/Navbar/SignUp";
import Login from "./components/Navbar/Login";
import ConfirmPassword from "./components/Navbar/ConfirmPassword"; 
import CreateGroup from "./components/Group/createGroup";
import ShowGroup from "./components/Group/ShowGroup";
import ListGroupExpenses from "./components/Expenses/listGroupExpenses";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resetPassword" element={<ConfirmPassword />} />
        <Route path="/createGroup" element={<CreateGroup />} />
        <Route path="/groupList" element={<ShowGroup />} />
        <Route path="/listGropExpenses/:groupId" element={<ListGroupExpenses />} />
      </Routes>
    </Router>
  );
}

export default App;
