import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Display = ({ ele }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    navigate(`/confirm-delete/${id}`); // Redirect to the confirmation page
  };

  return (
    <>
      <ToastContainer />
      <div className="card" style={{ width: "85%", height: "90%" }}>
        <img
          src={ele.imgUrl}
          alt="photo"
          className="card-img-top"
          style={{ height: "50%", width: "50%" }}
        />
        <div className="card-body">
          <h3 className="card-title">{ele.name}</h3>
          <h4 className="card-title">{ele.email}</h4>
          <p className="card-text">{ele.age}</p>
        </div>
        <div>
          <Link to={`/edit/${ele._id}`} className="btn btn-success text-white">
            Edit
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(ele._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default Display;
