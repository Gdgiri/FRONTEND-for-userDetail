import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteUser } from "../Redux/userSlice";
import axios from "axios";
import { toast } from "react-toastify";

const Confirm = () => {
  const { id } = useParams(); // Get the user ID from the route
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/delete/${id}`);
      dispatch(deleteUser({ id }));
      toast.success("User deleted successfully!");
      navigate("/getdata"); // Redirect to Display page
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user!");
    }
  };

  const handleCancel = () => {
    navigate("/getdata"); // Redirect back to Display page
  };
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Are you sure you want to delete this user?</h2>
      <button onClick={handleDelete} className="btn btn-danger">
        Delete
      </button>
      <button onClick={handleCancel} className="btn btn-secondary">
        Cancel
      </button>
    </div>
  );
};

export default Confirm;
