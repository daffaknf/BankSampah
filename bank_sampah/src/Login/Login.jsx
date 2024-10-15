import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import validation from "./LoginValidation";

const Login = () => {
  const [user, setUser] = useState(null);
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors(validation(values));

    try {
      const response = await axios.post("http://localhost:8081/Login", {
        username: values.username,
        password: values.password,
      });

      if (response.status === 200) {
        console.log("Login berhasil");
        console.log(response.data.user);

        // Simpan data di localStorage
        localStorage.setItem("userRole", response.data.user.level);
        localStorage.setItem(
          "namaBankSampah",
          response.data.user.nama_bank_sampah
        );
        localStorage.setItem("idBankSampah", response.data.user.id_bank_sampah);
        localStorage.setItem("nama", response.data.user.nama);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Debugging storage data
        console.log(localStorage.getItem("userRole"));
        console.log(localStorage.getItem("nama"));
        console.log(localStorage.getItem("idBankSampah"));
        console.log(localStorage.getItem("namaBankSampah"));

        setUser(response.data.user);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Username atau password salah");
    }
  };

  return (
    <div className="container-login">
      <form onSubmit={handleSubmit}>
        <h2 className="read-judul">Login</h2>
        <div className="label">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Masukkan Username"
            name="username"
            value={values.username}
            onChange={handleInput}
            disabled={!!user}
          />
          {errors.username && <span>{errors.username}</span>}
        </div>
        <div className="label">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Masukkan Password"
            name="password"
            value={values.password}
            onChange={handleInput}
            disabled={!!user}
          />
          {errors.password && <span>{errors.password}</span>}
        </div>
        <div className="action-buttons">
          <Link className="back" to={"/"}>
            Back
          </Link>
          <button className="update" type="submit" disabled={!!user}>
            Masuk
          </button>
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
