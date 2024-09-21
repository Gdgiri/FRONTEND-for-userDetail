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
      <div
        className="card mx-auto mt-5"
        style={{ width: "85%", height: "70%" }}
      >
        <img
          src={ele.imgUrl}
          alt="photo"
          className="card-img-top mx-auto"
          style={{ height: "50%", width: "50%" }}
        />
        {/* <video
          src={ele.imgUrl}
          alt="photo"
          className="card-img-top mx-auto"
          controls
        ></video> */}
        <div className="card-body mx-auto">
          <h3 className="card-title">Name:{ele.name}</h3>
          <h4 className="card-title">Email:{ele.email}</h4>
          <h5 className="card-text">Age:{ele.age}</h5>
        </div>
        <div className="mx-auto d-flex gap-3 mb-3">
          <div>
            <Link
              to={`/edit/${ele._id}`}
              className="btn btn-success text-white"
            >
              Edit
            </Link>
          </div>
          <div>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(ele._id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Display;
