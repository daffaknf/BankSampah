import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link from react-router-dom
import "././JenisSampah.css";

function ReadJenisSampah() {
  const { id_jenis } = useParams();
  const [jenis, setJenisSampah] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8081/ReadJenisSampah/" + id_jenis)
      .then((res) => {
        console.log(res);
        setJenisSampah(res.data[0]);
      })
      .catch((err) => console.log(err));
  }, [id_jenis]);
  return (
    <div className="container-read">
      <div className="card-read">
        <h2 className="read-judul">Nama Jenis Sampah Detail</h2>
        <p>
          ID Jenis: <span className="text">{jenis.id_jenis}</span>
        </p>
        <p>
          Nama Katagori: <span className="text">{jenis.nama_kategori}</span>
        </p>
        <p>
          Nama Jenis: <span className="text">{jenis.nama_jenis}</span>
        </p>
        <p>
          Keterangan: <span className="text">{jenis.keterangan}</span>
        </p>
        <p>
          Harga: <span className="text">{jenis.harga}</span>
        </p>
        <div className="action-buttons">
          <Link className="back-read" to={"/JenisSampah"}>
            Back
          </Link>
          <Link className="edit-read" to={`/EditJenisSampah/${jenis.id_jenis}`}>
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReadJenisSampah;
