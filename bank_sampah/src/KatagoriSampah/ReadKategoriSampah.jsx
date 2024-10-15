import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../JenisSampah/JenisSampah.css";

function ReadKategoriSampah() {
  const { id_kategori } = useParams();
  const [kategori, setKategoriSampah] = useState([]);
  const [bankSampah, setBankSampah] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8081/ReadKategoriSampah/" + id_kategori)
      .then((res) => {
        console.log(res);
        setKategoriSampah(res.data);
        if (res.data.length > 0) {
          setBankSampah(res.data[0].nama_bank_sampah);
        }
      })
      .catch((err) => console.log(err));
  }, [id_kategori]);

  return (
    <div className="container">
      <div>
        <div className="header">
          <h2>Data Jenis Katagori Sampah Detail</h2>
          <h3>Nama Bank Sampah: {bankSampah}</h3>
        </div>
        <div className="content">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nama Katagori</th>
                  <th>Nama Jenis</th>
                  <th>Keterangan</th>
                  <th>Harga</th>
                </tr>
              </thead>
              <tbody>
                {kategori.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nama_kategori}</td>
                    <td>{item.nama_jenis}</td>
                    <td>{item.keterangan}</td>
                    <td>{item.harga}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadKategoriSampah;
