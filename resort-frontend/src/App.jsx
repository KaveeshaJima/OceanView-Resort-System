import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import Users from "./pages/Users";
import Guests from "./pages/Guests";
import Help from "./pages/Help";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login without layout */}
        <Route path="/" element={<Login />} />

        {/* Protected Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/users" element={<Users />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/help" element={<Help />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;