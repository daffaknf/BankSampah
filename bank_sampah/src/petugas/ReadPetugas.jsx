import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ReadPetugas() {
  const { id_user } = useParams();
  const [users, setUsers] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:8081/ReadPetugas/${id_user}`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  }, [id_user]);

  return (
    <div className="container-read">
      <div className="card-read">
        <h2 className="read-judul">Detail Petugas Bank Sampah</h2>
        <p>
          Nama Users: <span className="text">{users.nama}</span>
        </p>
        <p>
          Username: <span className="text">{users.username}</span>
        </p>
        <p>
          Email Users: <span className="text">{users.email}</span>
        </p>
        <p>
          Level: <span className="text">{users.level}</span>
        </p>
        <p>
          Nama Bank Sampah:{" "}
          <span className="text">{users.nama_bank_sampah || "-"}</span>
        </p>
        <div className="action-buttons">
          <Link className="back-read" to={"/Petugas"}>
            Kembali
          </Link>
          <Link className="edit-read" to={`/EditPetugas/${users.id_user}`}>
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReadPetugas;
