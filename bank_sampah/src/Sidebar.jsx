import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "./assets/logo.png";
import {
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsBoxArrowRight,
} from "react-icons/bs";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    // Hapus data pengguna dari localStorage
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <img src={logo} alt="Logo Gambar" height={100} width={100} />
        </div>
        <span
          className={`icon close_icon ${
            openSidebarToggle ? "close_icon_desktop" : ""
          }`}
          onClick={OpenSidebar}
        >
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <a href="/">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </a>
        </li>

        <li className="sidebar-list-item">
          <Link
            to="/BankSampah"
            className={
              !user || (user && user.level === "Admin") ? "disabled-link" : ""
            }
          >
            <BsFillArchiveFill className="icon" />
            <span>Bank Sampah</span>
          </Link>
        </li>

        {/* Tampilkan link ke halaman Petugas hanya jika user bukan admin */}
        <li className="sidebar-list-item">
          <Link
            to="/Petugas"
            className={
              !user || (user && user.level === "Admin") ? "disabled-link" : ""
            }
          >
            <BsPeopleFill className="icon" /> Users
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/KatagoriSampah" className={!user ? "disabled-link" : ""}>
            <BsFillGrid3X3GapFill className="icon" /> Katagori Sampah
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/JenisSampah" className={!user ? "disabled-link" : ""}>
            <BsListCheck className="icon" /> Jenis Sampah
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/Laporan" className={!user ? "disabled-link" : ""}>
            <BsMenuButtonWideFill className="icon" /> Laporan Bank Sampah
          </Link>
        </li>
        {/* Tambahkan tombol logout di sidebar */}
        <li className="sidebar-list-item">
          <Link onClick={handleLogout} className={!user ? "disabled-link" : ""}>
            <BsBoxArrowRight className="icon" /> Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
}

Sidebar.propTypes = {
  openSidebarToggle: PropTypes.bool.isRequired,
  OpenSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
