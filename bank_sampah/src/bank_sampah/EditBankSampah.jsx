import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditBankSampah = () => {
  const { id_bank_sampah } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8081/ReadBankSampah/" + id_bank_sampah)
      .then((res) => {
        console.log(res);
        setValues({
          ...values,
          nama_bank_sampah: res.data[0].nama_bank_sampah,
        });
      })
      .catch((err) => console.log(err));
  }, [id_bank_sampah]);

  const [values, setValues] = useState({
    nama_bank_sampah: "",
  });

  const handleUpdate = (event) => {
    event.preventDefault();
    setShowPopup(true);
  };

  const confirmUpdate = () => {
    axios
      .put("http://localhost:8081/EditBankSampah/" + id_bank_sampah, values)
      .then((res) => {
        console.log(res);
        setShowPopup(false);
        navigate("/BankSampah");
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
            value={values.nama_bank_sampah}
            onChange={(e) =>
              setValues({ ...values, nama_bank_sampah: e.target.value })
            }
          />
        </div>
        <div className="action-buttons">
          <Link className="back" to={"/BankSampah"}>
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

export default EditBankSampah;
