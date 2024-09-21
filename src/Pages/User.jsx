import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Display from "./Display";
import { useNavigate } from "react-router-dom";

const User = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(0);
  useEffect(() => {
    fetchUrl();
  }, []);

  const fetchUrl = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/getall");
      setData(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter the data based on the search term
  const filteredData = data.filter(
    (ele) =>
      ele.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ele.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ele.age && ele.age.toString().includes(searchTerm)) // Optional: filter by age as well
  );
  const handleCreate = () => {
    navigate("/newuser");
  };
  return (
    <div className="container">
      <h1 className="my-4">Get Details</h1>
      <div className="d-flex">
        <button className="btn btn-primary " onClick={handleCreate}>
          Add User
        </button>
        <input
          type="text"
          placeholder="Search by name, email, or age..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control mb-2 ms-auto "
          style={{ width: "300px" }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredData.length > 0 ? (
            filteredData.map((ele) => (
              <div className="col-md-6 mb-4" key={ele._id}>
                <Display ele={ele} />
              </div>
            ))
          ) : (
            <p className="text-center">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default User;
