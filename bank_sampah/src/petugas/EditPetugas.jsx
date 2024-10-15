import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPetugas = () => {
  const { id_user } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    level: "",
  });
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState(""); // State untuk pesan kesalahan username
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8081/ReadPetugas/" + id_user)
      .then((res) => {
        setValues({
          nama: res.data.nama,
          username: res.data.username,
          email: res.data.email,
          level: res.data.level,
        });
      })
      .catch((err) => console.log(err));
  }, [id_user]);

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
          .then((response) => {
            // Renamed res to response
            if (response.data.exists && formattedUsername !== values.username) {
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

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!values.email.includes("@")) {
      setError("Email harus mengandung karakter '@'");
      return;
    }
    if (usernameError) {
      return; // Jangan submit jika ada error pada username
    }
    setError(""); // Reset pesan kesalahan jika validasi berhasil
    setShowPopup(true);
  };

  const confirmUpdate = () => {
    axios
      .put("http://localhost:8081/EditPetugas/" + id_user, values)
      .then(() => {
        setShowPopup(false);
        navigate("/Petugas");
      })
      .catch((err) => console.log(err));
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container-read">
      <form onSubmit={handleUpdate}>
        <h2 className="read-judul">Update Petugas Bank Sampah</h2>
        <div className="label">
          <label htmlFor="nama">Nama Users Bank Sampah</label>
          <input
            type="text"
            id="nama"
            placeholder="Masukkan nama Users bank sampah"
            value={values.nama}
            onChange={(e) => setValues({ ...values, nama: e.target.value })}
          />
        </div>
        <div className="label">
          <label htmlFor="username">Nama Username Bank Sampah</label>
          <input
            type="text"
            id="username"
            placeholder="Masukkan nama Petugas bank sampah"
            value={values.username}
            onChange={handleUsernameChange}
          />
          {usernameError && <p className="error">{usernameError}</p>}
        </div>
        <div className="label">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Masukkan email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          {error && <p className="error">{error}</p>}
        </div>

        <div className="label">
          <label htmlFor="level">Level</label>
          <select
            id="level"
            value={values.level}
            onChange={(e) => setValues({ ...values, level: e.target.value })}
          >
            <option value="">Pilih Level</option>
            <option value="Petugas">Petugas</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>
        <div className="action-buttons">
          <Link className="back" to={"/Petugas"}>
            Back
          </Link>
          <button className="update" type="submit">
            Update
          </button>
        </div>
      </form>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Apakah Anda yakin ingin memperbarui data ini?</h3>
            <div className="popup-buttons">
              <button onClick={confirmUpdate}>Yes</button>
              <button onClick={closePopup}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPetugas;
