import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./JenisSampah.css";

const JenisSampah = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null); // State for handling dropdown visibility
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchJenisSampah();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const idBankSampah = localStorage.getItem("idBankSampah");
      const response = await axios.get(
        `http://localhost:8081/KategoriSampah/${idBankSampah}`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchJenisSampah = async () => {
    try {
      let url = "http://localhost:8081/JenisSampah";
      if (selectedCategory) {
        url += `?nama_kategori=${encodeURIComponent(selectedCategory)}`;
      }
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = (id_jenis) => {
    axios
      .delete("http://localhost:8081/DeleteJenisSampah/" + id_jenis)
      .then(() => {
        fetchJenisSampah();
      })
      .catch((err) => console.error(err));
    setShowPopup(false);
  };

  const openPopup = (id_jenis) => {
    setDeleteId(id_jenis);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const toggleDropdown = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="container">
      <div>
        <div className="header">
          <h2>Data Jenis Bank Sampah</h2>
          <div className="create">
            <Link
              to="/CreateJenisSampah"
              style={{ textDecoration: "none", color: "#fff" }}
            >
              Create
            </Link>
          </div>
        </div>
        <div className="content">
          <div className="filter">
            <label htmlFor="categoryFilter">Filter by Category:</label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option
                  key={category.id_kategori}
                  value={category.nama_kategori}
                >
                  {category.nama_kategori}
                </option>
              ))}
            </select>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Kategori</th>
                  <th>Nama Jenis</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((jenis, index) => (
                  <tr key={jenis.id_jenis}>
                    <td>{index + 1}</td>
                    <td>{jenis.nama_kategori}</td>
                    <td>{jenis.nama_jenis}</td>
                    <td className="action-buttons">
                      <div className="desktop-buttons">
                        <Link
                          className="read"
                          to={`/ReadJenisSampah/${jenis.id_jenis}`}
                        >
                          Read
                        </Link>
                        <Link
                          className="edit"
                          to={`/EditJenisSampah/${jenis.id_jenis}`}
                        >
                          Edit
                        </Link>
                        <button
                          className="delete"
                          onClick={() => openPopup(jenis.id_jenis)}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="mobile-buttons">
                        <button
                          className="dropdown-button"
                          onClick={() => toggleDropdown(index)}
                        >
                          &#x2022;&#x2022;&#x2022;
                        </button>
                        {dropdownIndex === index && (
                          <div className="dropdown-menu">
                            <Link
                              className="read"
                              to={`/ReadJenisSampah/${jenis.id_jenis}`}
                              onClick={() => setDropdownIndex(null)}
                            >
                              Read
                            </Link>
                            <Link
                              className="edit"
                              to={`/EditJenisSampah/${jenis.id_jenis}`}
                              onClick={() => setDropdownIndex(null)}
                            >
                              Edit
                            </Link>
                            <button
                              className="delete"
                              onClick={() => {
                                openPopup(jenis.id_jenis);
                                setDropdownIndex(null);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={prevPage}
                disabled={currentPage === 1 ? true : false}
              >
                Prev
              </button>
              {Array.from({
                length: Math.ceil(data.length / itemsPerPage),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={
                  currentPage === Math.ceil(data.length / itemsPerPage)
                    ? true
                    : false
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Anda ingin Mengapus Data ini?</h3>
            <div className="popup-buttons">
              <button onClick={() => handleDelete(deleteId)}>Yes</button>
              <button onClick={closePopup}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JenisSampah;
