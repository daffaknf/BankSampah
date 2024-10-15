import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ReadLaporan = () => {
  const { id_transaksi } = useParams();
  const [details, setDetails] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/Laporan/${id_transaksi}`)
      .then((res) => {
        console.log("Data received:", res.data); // Debug log
        setDetails(res.data);
        // Calculate total
        const calculatedTotal = res.data.reduce(
          (acc, detail) => acc + detail.amount,
          0
        );
        setTotal(calculatedTotal);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [id_transaksi]);

  return (
    <div className="container">
      <div className="header">
        <h2>Detail Transaksi</h2>
        <h3>Total: {total}</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID Detail</th>
            <th>ID Transaksi</th>
            <th>Nama Petugas</th>
            <th>Nama Nasabah</th>
            <th>Nama Kategori</th>
            <th>Nama Jenis</th>
            <th>Jumlah</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {details.length > 0 ? (
            details.map((detail, index) => (
              <tr key={index}>
                <td>{detail.id_detail}</td>
                <td>{detail.id_transaksi}</td>
                <td>{detail.nama_petugas}</td>
                <td>{detail.nama_nasabah}</td>
                <td>{detail.nama_kategori}</td>
                <td>{detail.nama_jenis}</td>
                <td>{detail.jumlah}</td>
                <td>{detail.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No details found for this transaction.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReadLaporan;
