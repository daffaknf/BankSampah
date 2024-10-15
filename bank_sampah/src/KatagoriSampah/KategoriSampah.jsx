import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const KategoriSampah = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [namaBankSampah, setNamaBankSampah] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    const storedNamaBankSampah = localStorage.getItem("namaBankSampah");
    setNamaBankSampah(storedNamaBankSampah);
    setUserRole(storedUserRole);

    fetchData(storedNamaBankSampah, storedUserRole);
  }, []);

  const fetchData = async (namaBankSampah, userRole) => {
    try {
      let url = "http://localhost:8081/KategoriSampah";
      if (userRole !== "Super Admin" && namaBankSampah) {
        url += `?nama_bank_sampah=${encodeURIComponent(namaBankSampah)}`;
      }
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = (id_kategori) => {
    axios
      .delete(`http://localhost:8081/DeleteKategoriSampah/${id_kategori}`)
      .then(() => {
        fetchData(namaBankSampah, userRole);
      })
      .catch((err) => console.error(err));
    setShowPopup(false);
  };

  const openPopup = (id_kategori) => {
    setDeleteId(id_kategori);
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
          <h2>Data Kategori Bank Sampah</h2>
          <div className="create">
            <Link
              to="/CreateKategoriSampah"
              style={{ textDecoration: "none", color: "#fff" }}
            >
              Create
            </Link>
          </div>
        </div>
        <div className="content">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Kategori Sampah</th>
                  <th>Nama Bank Sampah</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((kategori, index) => (
                  <tr key={kategori.id_kategori}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{kategori.nama_kategori}</td>
                    <td>{kategori.nama_bank_sampah}</td>
                    <td className="action-buttons">
                      <div className="desktop-buttons">
                        <Link
                          className="read"
                          to={`/ReadKategoriSampah/${kategori.id_kategori}`}
                        >
                          Read
                        </Link>
                        <Link
                          className="edit"
                          to={`/EditKategoriSampah/${kategori.id_kategori}`}
                        >
                          Edit
                        </Link>
                        <button
                          className="delete"
                          onClick={() => openPopup(kategori.id_kategori)}
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
                              to={`/ReadKategoriSampah/${kategori.id_kategori}`}
                              onClick={() => setDropdownIndex(null)}
                            >
                              Read
                            </Link>
                            <Link
                              className="edit"
                              to={`/EditKategoriSampah/${kategori.id_kategori}`}
                              onClick={() => setDropdownIndex(null)}
                            >
                              Edit
                            </Link>
                            <button
                              className="delete"
                              onClick={() => {
                                openPopup(kategori.id_kategori);
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
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Anda ingin Menghapus Data ini?</h3>
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

export default KategoriSampah;
