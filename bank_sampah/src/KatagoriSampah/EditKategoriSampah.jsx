import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditKategoriSampah = () => {
  const { id_kategori } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8081/ReadKategoriSampah/" + id_kategori)
      .then((res) => {
        console.log(res);
        setValues({
          ...values,
          nama_kategori: res.data[0].nama_kategori,
        });
      })
      .catch((err) => console.log(err));
  }, [id_kategori]);

  const [values, setValues] = useState({
    nama_kategori: "",
  });

  const handleUpdate = (event) => {
    event.preventDefault();
    setShowPopup(true);
  };

  const confirmUpdate = () => {
    axios
      .put("http://localhost:8081/EditKategoriSampah/" + id_kategori, values)
      .then((res) => {
        console.log(res);
        setShowPopup(false);
        navigate("/KatagoriSampah");
      })
      .catch((err) => console.log(err));
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container-read">
      <form onSubmit={handleUpdate}>
        <h2 className="read-judul">Update Bank Sampah</h2>
        <div className="label">
          <label htmlFor="">Nama Bank Sampah</label>
          <input
            type="text"
            placeholder="Masukkan nama bank sampah"
            value={values.nama_kategori}
            onChange={(e) =>
              setValues({ ...values, nama_kategori: e.target.value })
            }
          />
        </div>
        <div className="action-buttons">
          <Link className="back" to={"/KatagoriSampah"}>
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

export default EditKategoriSampah;
