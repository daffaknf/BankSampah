import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsMenuButtonWideFill,
  BsListCheck,
} from "react-icons/bs";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";

function Home() {
  const [jumlahJenis, setJumlahJenis] = useState(0);
  const [jumlahKategori, setJumlahKategori] = useState(
    localStorage.getItem("jumlahKategori") || 0
  );
  const [jumlahBankSampah, setJumlahBankSampah] = useState(0);
  const [jumlahLaporanBank, setJumlahLaporanBank] = useState(0);
  const [grafikLaporan, setGrafikLaporan] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/JumlahJenis")
      .then((response) => response.json())
      .then((data) => {
        setJumlahJenis(data[0].JumlahJenis);
      })
      .catch((error) => console.error("Error:", error));

    fetch("http://localhost:8081/JumlahKategori")
      .then((response) => response.json())
      .then((data) => {
        setJumlahKategori(data[0].JumlahKategori);
        localStorage.setItem("jumlahKategori", data[0].JumlahKategori);
        console.log("Jumlah Kategori from API:", data[0].JumlahKategori);
      })
      .catch((error) => console.error("Error:", error));

    fetch("http://localhost:8081/JumlahBankSampah")
      .then((response) => response.json())
      .then((data) => {
        setJumlahBankSampah(data[0].JumlahBankSampah);
      })
      .catch((error) => console.error("Error:", error));

    fetch("http://localhost:8081/JumlahLaporanBank")
      .then((response) => response.json())
      .then((data) => {
        setJumlahLaporanBank(data[0].JumlahLaporanBank);
      })
      .catch((error) => console.error("Error:", error));

    fetch("http://localhost:8081/GrafikLaporan")
      .then((response) => response.json())
      .then((data) => {
        const bulanNames = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];
        const formattedData = data.map((item) => ({
          ...item,
          bulan: bulanNames[item.bulan - 1],
        }));
        setGrafikLaporan(formattedData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  console.log("Jumlah Kategori on Render:", jumlahKategori);

  return (
    <main className="main-container">
      <div className="headerr">
        <h2>Welcome Bank Sampah </h2>
        {user && (
          <p>
            <strong>
              {user.username} - {user.level}
            </strong>
          </p>
        )}
      </div>
      <div className="header">
        <h2>DASHBOARD</h2>
        {!user && (
          <div className="create">
            <Link
              to={"/Login"}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              Login
            </Link>
          </div>
        )}
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>Jenis Sampah</h3>
            <BsListCheck className="card_icon" />
          </div>
          <h1>{jumlahJenis}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Kategori Sampah</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>{jumlahKategori}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Bank Sampah</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>{jumlahBankSampah}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Laporan</h3>
            <BsMenuButtonWideFill className="card_icon" />
          </div>
          <h1>{jumlahLaporanBank}</h1>
        </div>
      </div>

      <div className="charts">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={grafikLaporan}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bulan" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="jumlah_transaksi" fill="#2962ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
