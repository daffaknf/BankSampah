import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditJenisSampah = () => {
  const { id_jenis } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8081/ReadJenisSampah/" + id_jenis)
      .then((res) => {
        console.log(res);
        setValues({
          ...values,
          nama_jenis: res.data[0].nama_jenis,
          keterangan: res.data[0].keterangan,
          harga: res.data[0].harga,
        });
      })
      .catch((err) => console.log(err));
  }, [id_jenis]);

  const [values, setValues] = useState({
    nama_jenis: "",
    keterangan: "",
    harga: "",
  });

  const handleUpdate = (event) => {
    event.preventDefault();
    setShowPopup(true);
  };

  const confirmUpdate = () => {
    axios
      .put("http://localhost:8081/EditJenisSampah/" + id_jenis, values)
      .then((res) => {
        console.log(res);
        setShowPopup(false);
        navigate("/JenisSampah");
      })
      .catch((err) => console.log(err));
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container-read">
      <form onSubmit={handleUpdate}>
        <h2 className="read-judul">Update Jenis Bank Sampah</h2>
        <div className="label">
          <label htmlFor="">Nama Jenis Bank Sampah</label>
          <input
            type="text"
            placeholder="Masukkan nama jenis bank sampah"
            value={values.nama_jenis}
            onChange={(e) =>
              setValues({ ...values, nama_jenis: e.target.value })
            }
          />
        </div>
        <div className="label">
          <label htmlFor="">Keterangan Jenis Sampah</label>
          <input
            type="text"
            placeholder="Masukkan keterangan jenis sampah"
            value={values.keterangan}
            onChange={(e) =>
              setValues({ ...values, keterangan: e.target.value })
            }
          />
        </div>
        <div className="label">
          <label htmlFor="">Harga</label>
          <input
            type="text"
            placeholder="Harga"
            value={values.harga}
            onChange={(e) => setValues({ ...values, harga: e.target.value })}
          />
        </div>
        <div className="action-buttons">
          <Link className="back" to={"/JenisSampah"}>
            Back
          </Link>
          <button className="update">Update</button>
        </div>
      </form>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Apakah Anda yakin ingin memperbarui data ini?</h3>
            <div className="popup-buttonss">
              <button onClick={confirmUpdate}>Yes</button>
              <button onClick={closePopup}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditJenisSampah;
