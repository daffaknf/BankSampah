import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const CreateKategoriSampah = () => {
  const [values, setValues] = useState({
    nama_kategori: "",
    id_bank_sampah: "",
  });
  const [bankSampahList, setBankSampahList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8081/BankSampah")
      .then((res) => setBankSampahList(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/CreateKategoriSampah", values)
      .then((res) => {
        console.log(res);
        navigate("/KatagoriSampah");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container-read">
      <form onSubmit={handleSubmit}>
        <h2 className="read-judul">Tambahkan Nama Kategori Sampah</h2>
        <div className="label">
          <label htmlFor="nama_kategori">Nama Kategori Sampah</label>
          <input
            type="text"
            required
            placeholder="Masukkan nama kategori"
            onChange={(e) =>
              setValues({ ...values, nama_kategori: e.target.value })
            }
          />
        </div>
        <div className="label">
          <label htmlFor="id_bank_sampah">Nama Bank Sampah</label>
          <select
            required
            onChange={(e) =>
              setValues({ ...values, id_bank_sampah: e.target.value })
            }
          >
            <option value="">Pilih Bank Sampah</option>
            {bankSampahList.map((bank) => (
              <option key={bank.id_bank_sampah} value={bank.id_bank_sampah}>
                {bank.nama_bank_sampah}
              </option>
            ))}
          </select>
        </div>
        <div className="action-buttons">
          <Link className="back" to={"/KatagoriSampah"}>
            Back
          </Link>
          <button className="update">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CreateKategoriSampah;
