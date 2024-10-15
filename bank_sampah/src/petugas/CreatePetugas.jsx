import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const CreatePetugas = () => {
  const [values, setValues] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    level: "",
    id_bank_sampah: "",
  });
  const [error, setError] = useState(""); // State untuk menyimpan pesan kesalahan
  const [usernameError, setUsernameError] = useState(""); // State untuk pesan kesalahan username
  const navigate = useNavigate();
  const [BankSampah, setBankSampah] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/BankSampah") // Pastikan endpoint ini benar
      .then((res) => {
        setBankSampah(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUsernameChange = (e) => {
    const username = e.target.value;
    const formattedUsername = username.replace(/\s/g, "").toLowerCase(); // Hilangkan spasi dan ubah ke huruf kecil
    setValues({ ...values, username: formattedUsername });

    if (username !== formattedUsername) {
      setUsernameError("Username hanya boleh huruf kecil tanpa spasi!");
    } else {
      setUsernameError("");

      if (username) {
        axios
          .get(`http://localhost:8081/CheckUsername/${formattedUsername}`)
          .then((res) => {
            if (res.data.exists) {
              setUsernameError("Username sudah digunakan");
            } else {
              setUsernameError("");
            }
          })
          .catch((err) => console.log(err));
      } else {
        setUsernameError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.email.includes("@")) {
      setError("Email harus mengandung karakter '@'");
      return;
    }
    if (usernameError) {
      return; // Jangan submit jika ada error pada username
    }
    setError(""); // Reset pesan kesalahan jika validasi berhasil
    axios
      .post("http://localhost:8081/CreatePetugas", values)
      .then((res) => {
        console.log(res);
        navigate("/Petugas");
      })
      .catch((err) => console.log(err));
  };

  const handleLevelChange = (e) => {
    const level = e.target.value;
    const id_bank_sampah = level === "Super Admin" ? "" : values.id_bank_sampah;
    setValues({ ...values, level, id_bank_sampah });
  };

  return (
    <div className="container-read">
      <form onSubmit={handleSubmit}>
        <h2 className="read-judul">Tambahkan Nama User Bank Sampah</h2>
        <div className="label">
          <label htmlFor="nama">Nama Users Bank Sampah</label>
          <input
            type="text"
            required
            id="nama"
            placeholder="Masukkan nama Users"
            onChange={(e) => setValues({ ...values, nama: e.target.value })}
            value={values.nama}
          />
        </div>
        <div className="label">
          <label htmlFor="username">Nama Username Bank Sampah</label>
          <input
            type="text"
            required
            id="username"
            placeholder="Masukkan nama bank sampah"
            onChange={handleUsernameChange}
            value={values.username}
          />
          {usernameError && <p className="error">{usernameError}</p>}
        </div>
        <div className="label">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            required
            id="email"
            placeholder="Masukkan email"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            value={values.email}
          />
          {error && <p className="error">{error}</p>}
        </div>
        <div className="label">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            required
            id="password"
            placeholder="Masukkan password"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            value={values.password}
          />
        </div>
        <div className="label">
          <label htmlFor="level">Level</label>
          <select
            id="level"
            required
            value={values.level}
            onChange={handleLevelChange}
          >
            <option value="">Pilih Level</option>
            <option value="Petugas">Petugas</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>
        <div className="label">
          <label htmlFor="id_bank_sampah">Nama Bank Sampah</label>
          <select
            id="id_bank_sampah"
            required
            value={values.id_bank_sampah}
            onChange={(e) =>
              setValues({ ...values, id_bank_sampah: e.target.value })
            }
            disabled={values.level === "Super Admin"}
          >
            <option value="">Pilih Nama Bank Sampah</option>
            {BankSampah.map((tb_bank_sampah) => (
              <option
                key={tb_bank_sampah.id_bank_sampah}
                value={tb_bank_sampah.id_bank_sampah}
              >
                {tb_bank_sampah.nama_bank_sampah}
              </option>
            ))}
          </select>
        </div>
        <div className="action-buttons">
          <Link className="back" to={"/Petugas"}>
            Back
          </Link>
          <button className="update" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePetugas;
