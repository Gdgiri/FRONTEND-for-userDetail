import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateUser } from "../Redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

const EditUser = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.users.users);
  const user = users.find((ele) => ele.id === id);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.name,
        email: user.email,
        age: user.age,
        photo: user.imgUrl || "", // Use existing image if available
      });
    }
  }, [user]);

  useEffect(() => {
    if (img) {
      uploadFile(img);
    }
  }, [img]);

  const uploadFile = (file) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPerc(Math.round(progress));
      },
      (error) => {
        setError("Image upload failed.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          formik.setFieldValue("photo", downloadURL);
        });
      }
    );
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      age: "",
      photo: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      age: Yup.number()
        .required("Age is required")
        .positive("Age must be positive")
        .integer("Age must be an integer"),
      photo: Yup.string().required("Photo is required"),
    }),
    onSubmit: async (values) => {
      setError(""); // Clear previous error message
      try {
        const res = await axios.put(`http://localhost:5000/api/edit/${id}`, {
          name: values.name,
          email: values.email,
          age: values.age,
          imgUrl: values.photo,
        });
        dispatch(updateUser(res.data.result)); // Use updateUser instead of createUser
        toast.success("User updated successfully!");
        setTimeout(() => navigate("/getdata"), 1500);
      } catch (error) {
        console.error(
          "Error updating user:",
          error.response ? error.response.data : error.message
        );
        setError("Failed to update user. Please try again.");
        toast.error("Failed to update user. Please try again.");
      }
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <ToastContainer />
      <div className="col-md-6">
        <h2 className="text-center">Edit User</h2>
        <form
          onSubmit={formik.handleSubmit}
          className="border p-4 rounded bg-light"
        >
          <div className="form-group mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-danger">{formik.errors.name}</div>
            )}
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger">{formik.errors.email}</div>
            )}
          </div>
          <div className="form-group mb-3">
            <label>Age</label>
            <input
              type="number"
              className="form-control"
              {...formik.getFieldProps("age")}
            />
            {formik.touched.age && formik.errors.age && (
              <div className="text-danger">{formik.errors.age}</div>
            )}
          </div>
          <div className="form-group mb-3">
            <label>Photo</label>
            {imgPerc > 0 && (
              <div className="progress mb-2">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${imgPerc}%` }}
                  aria-valuenow={imgPerc}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {imgPerc}%
                </div>
              </div>
            )}
            <input
              type="file"
              className="form-control"
              onChange={(event) => setImg(event.currentTarget.files[0])}
            />
            {formik.touched.photo && formik.errors.photo && (
              <div className="text-danger">{formik.errors.photo}</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Update User
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default EditUser;
