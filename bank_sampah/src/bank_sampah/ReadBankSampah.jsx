import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link from react-router-dom

function ReadBankSampah() {
  const { id_bank_sampah } = useParams();
  const [tb_bank_sampah, setBankSampah] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8081/ReadBankSampah/" + id_bank_sampah)
      .then((res) => {
        console.log(res);
        setBankSampah(res.data[0]);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="container-read">
      <div className="card-read">
        <h2 className="read-judul">Nama Bank Sampah Detail</h2>
        <p>
          ID Jenis:{" "}
          <span className="text">{tb_bank_sampah.id_bank_sampah}</span>
        </p>
        <p>
          Nama Katagori:{" "}
          <span className="text">{tb_bank_sampah.nama_bank_sampah}</span>
        </p>
        <div className="action-buttons">
          <Link className="back-read" to={"/BankSampah"}>
            Back
          </Link>
          <Link
            className="edit-read"
            to={`/EditBankSampah/${tb_bank_sampah.id_bank_sampah}`}
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReadBankSampah;
