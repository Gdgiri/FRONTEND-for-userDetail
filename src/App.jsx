import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import User from "./Pages/User"; // Page displaying users
import New from "./Pages/New"; // Page for creating a new user
import EditUser from "./Pages/EditUser"; // Page for editing a user
import Confirm from "./Pages/Confirm";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<User />} />
          <Route path="/newuser" element={<New />} />
          <Route path="/getdata" element={<User />} />
          <Route path="/edit/:id" element={<EditUser />} />
          <Route path="/confirm-delete/:id" element={<Confirm />} />
          {/* Updated route */}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
