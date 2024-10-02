import { useContext } from "react";
import "./App.css";
import { AppContext } from "./store/Store.jsx";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Main from "./components/Main";

function App() {
  let { name, age } = useContext(AppContext);
  console.log(name, age);

  const { isAuthenticated, loading } = useContext(AppContext); // Access the global state

  if (loading) {
    return <div>Loading...</div>; // Show loader while checking auth state
  }

  return (
    <Router>
      <Routes>
        {/* If the user is authenticated, show MainPage, else Login */}
        <Route
          path="/"
          element={isAuthenticated ? <Main /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
