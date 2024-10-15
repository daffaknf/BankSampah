import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    level: "", // Tidak ada nilai default
  });

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!values.level) {
      setErrors({ level: "Level pengguna harus dipilih" });
      return;
    }
    try {
      // Kirim data sign up ke server
      const response = await axios.post("http://localhost:8081/signup", values);
      console.log(response.data); // Log respons dari server

      // Navigasi ke halaman login setelah berhasil sign up
      window.location.href = "/Login";
    } catch (error) {
      // Tangani error jika terjadi
      console.error("Error:", error.response.data);
      setErrors(error.response.data); // Atur pesan kesalahan jika ada
    }
  };

  return (
    <div className="container-signup">
      <div>
        <h2 className="signup-title">Sign Up</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="label">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              placeholder="Masukkan Email"
              onChange={handleInput}
              name="email"
              value={values.email}
            />
            {errors.email && <span>{errors.email}</span>}
          </div>
          <div className="label">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Masukkan Username"
              onChange={handleInput}
              name="username"
              value={values.username}
            />
            {errors.username && <span>{errors.username}</span>}
          </div>
          <div className="label">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Masukkan Password"
              onChange={handleInput}
              name="password"
              value={values.password}
            />
            {errors.password && <span>{errors.password}</span>}
          </div>
          <div className="label">
            <label htmlFor="level">Level</label>
            <select name="level" onChange={handleInput} value={values.level}>
              <option value="">Pilih Level</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
            {errors.level && <span>{errors.level}</span>}
          </div>
          <div className="action-buttons">
            <Link className="back" to={"/"}>
              Back
            </Link>
            <button className="update" type="submit">
              Sign Up
            </button>
          </div>
          <div className="signup">
            <p>Have An Account?</p>
            <Link className="signupback" to={"/Login"}>
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
