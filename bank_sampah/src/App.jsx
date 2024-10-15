import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Home from "./Home";
import BankSampah from "./bank_sampah/BankSampah";
import Petugas from "./petugas/Petugas";
import KatagoriSampah from "./KatagoriSampah/KategoriSampah";
import JenisSampah from "./JenisSampah/JenisSampah";
import Laporan from "./Laporan/Laporan";
import CreateBankSampah from "./bank_sampah/CreateBankSampah";
import ReadBankSampah from "./bank_sampah/ReadBankSampah";
import EditBankSampah from "./bank_sampah/EditBankSampah";
import CreatePetugas from "./petugas/CreatePetugas";
import ReadPetugas from "./petugas/ReadPetugas";
import EditPetugas from "./petugas/EditPetugas";
import CreateKategoriSampah from "./KatagoriSampah/CreateKategoriSampah";
import ReadKategoriSampah from "./KatagoriSampah/ReadKategoriSampah";
import EditKategoriSampah from "./KatagoriSampah/EditKategoriSampah";
import CreateJenisSampah from "./JenisSampah/CreateJenisSampah";
import ReadJenisSampah from "./JenisSampah/ReadJenisSampah";
import EditJenisSampah from "./JenisSampah/EditJenisSampah";
import ReadLaporan from "./Laporan/ReadLaporan";
import SearchResults from "./SearchResults"; // Import SearchResults

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Router>
      <div className="grid-container">
        <Header OpenSidebar={OpenSidebar} />
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/BankSampah" element={<BankSampah />} />
          <Route path="/Petugas" element={<Petugas />} />
          <Route path="/KatagoriSampah" element={<KatagoriSampah />} />
          <Route path="/JenisSampah" element={<JenisSampah />} />
          <Route path="/Laporan" element={<Laporan />} />
          <Route path="/CreateBankSampah" element={<CreateBankSampah />} />
          <Route
            path="/ReadBankSampah/:id_bank_sampah"
            element={<ReadBankSampah />}
          />
          <Route
            path="/EditBankSampah/:id_bank_sampah"
            element={<EditBankSampah />}
          />
          <Route path="/CreatePetugas" element={<CreatePetugas />} />
          <Route path="/ReadPetugas/:id_user" element={<ReadPetugas />} />
          <Route path="/EditPetugas/:id_user" element={<EditPetugas />} />
          <Route
            path="/CreateKategoriSampah"
            element={<CreateKategoriSampah />}
          />
          <Route
            path="/ReadKategoriSampah/:id_kategori"
            element={<ReadKategoriSampah />}
          />
          <Route
            path="/EditKategoriSampah/:id_kategori"
            element={<EditKategoriSampah />}
          />
          <Route path="/CreateJenisSampah" element={<CreateJenisSampah />} />
          <Route
            path="/ReadJenisSampah/:id_jenis"
            element={<ReadJenisSampah />}
          />
          <Route
            path="/EditJenisSampah/:id_jenis"
            element={<EditJenisSampah />}
          />
          <Route path="/ReadLaporan/:id_transaksi" element={<ReadLaporan />} />
          <Route path="/search" element={<SearchResults />} />{" "}
          {/* Tambahkan rute untuk SearchResults */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
