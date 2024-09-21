import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUser } from "../Redux/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const New = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (img) {
      uploadFile(img);
    }
  }, [img]);

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
        console.log("Submitting:", values); // Log the values being submitted
        const res = await axios.post("http://localhost:5000/api/create", {
          name: values.name,
          email: values.email,
          age: values.age,
          imgUrl: values.photo,
        });
        console.log("Server Response:", res.data);
        dispatch(createUser(res.data.result));
        toast.success("User created successfully!");
        setTimeout(() => navigate("/getdata"), 1500);
      } catch (error) {
        console.error(
          "Error creating user:",
          error.response ? error.response.data : error.message
        );
        setError("Failed to create user. Please try again.");
        toast.error("Failed to create user. Please try again.");
      }
    },
  });

  const uploadFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPerc(Math.round(progress));
      },
      (error) => {
        setError("Upload failed. Please try again.");
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          formik.setFieldValue("photo", downloadURL);
          setImgPerc(0);
          setImg(undefined);
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2>Create New User</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter your name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-danger">{formik.errors.name}</div>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger">{formik.errors.email}</div>
          )}
        </div>

        {/* Age */}
        <div className="mb-3">
          <label htmlFor="age" className="form-label">
            Age
          </label>
          <input
            type="number"
            id="age"
            className="form-control"
            placeholder="Enter your age"
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.age && formik.errors.age && (
            <div className="text-danger">{formik.errors.age}</div>
          )}
        </div>

        {/* Photo Upload */}
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">
            Upload Photo
          </label>
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
            id="photo"
            className="form-control"
            accept="image/*"
            // accept="video/*"
            onChange={(event) => {
              if (event.currentTarget.files[0]) {
                setImg(event.currentTarget.files[0]);
              }
            }}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.photo && formik.errors.photo && (
            <div className="text-danger">{formik.errors.photo}</div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default New;
