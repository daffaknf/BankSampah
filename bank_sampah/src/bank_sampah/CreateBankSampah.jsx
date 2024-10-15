import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const CreateBankSampah = () => {
  const [values, setValues] = useState({
    nama_bank_sampah: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/CreateBankSampah", values)
      .then((res) => {
        console.log(res);
        navigate("/BankSampah");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container-read">
      <form onSubmit={handleSubmit}>
        <h2 className="read-judul">Tambahkan Nama Bank Sampah</h2>
        <div className="label">
          <label htmlFor="">Name Bank Sampah</label>
          <input
            type="text"
            required
            placeholder="Masukkan nama bank sampah "
            onChange={(e) =>
              setValues({ ...values, nama_bank_sampah: e.target.value })
            }
          />
        </div>
        <div className="action-buttons">
          <Link className="back" to={"/BankSampah"}>
            Back
          </Link>
          <button className="update">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CreateBankSampah;
