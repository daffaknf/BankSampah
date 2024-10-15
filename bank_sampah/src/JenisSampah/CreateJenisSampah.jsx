import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./JenisSampah.css";

const CreateJenisSampah = () => {
  const [values, setValues] = useState({
    id_kategori: "",
    nama_jenis: "",
    keterangan: "",
    harga: "",
  });

  const [kategoriSampah, setKategoriSampah] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const idBankSampah = localStorage.getItem("idBankSampah");
    const userRole = localStorage.getItem("userRole");

    if (userRole === "Super Admin") {
      // Jika user adalah Super Admin, ambil semua kategori
      axios
        .get(`http://localhost:8081/KategoriSampah`)
        .then((res) => {
          setKategoriSampah(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      // Jika bukan Super Admin, ambil kategori berdasarkan idBankSampah
      axios
        .get(`http://localhost:8081/KategoriSampah/${idBankSampah}`)
        .then((res) => {
          setKategoriSampah(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/CreateJenisSampah", values)
      .then((res) => {
        console.log(res);
        navigate("/JenisSampah");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container-read">
      <form onSubmit={handleSubmit}>
        <h2 className="read-judul">Tambahkan Nama Jenis Sampah</h2>
        <div className="label">
          <label htmlFor="">ID kategori Sampah</label>
          <select
            className="option"
            required
            onChange={(e) =>
              setValues({ ...values, id_kategori: e.target.value })
            }
          >
            {kategoriSampah.map((kategori) => (
              <option key={kategori.id_kategori} value={kategori.id_kategori}>
                {kategori.nama_kategori}
              </option>
            ))}
          </select>
        </div>
        <div className="label">
          <label htmlFor="">Nama Jenis Sampah</label>
          <input
            type="text"
            required
            placeholder="Masukkan nama Jenis "
            onChange={(e) =>
              setValues({ ...values, nama_jenis: e.target.value })
            }
          />
        </div>
        <div className="label">
          <label htmlFor="">Keterangan</label>
          <input
            type="text"
            required
            placeholder="Masukkan Keterangan Sampah"
            onChange={(e) =>
              setValues({ ...values, keterangan: e.target.value })
            }
          />
        </div>
        <div className="label">
          <label htmlFor="">Harga</label>
          <input
            type="text"
            required
            placeholder="Masukkan Harga Sampah"
            onChange={(e) => setValues({ ...values, harga: e.target.value })}
          />
        </div>
        <div className="action-buttons">
          <Link className="back" to={"/JenisSampah"}>
            Back
          </Link>
          <button className="update">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CreateJenisSampah;
