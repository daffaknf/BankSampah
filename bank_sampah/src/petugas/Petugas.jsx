import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Petugas = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8081/Petugas")
      .then((res) => {
        console.log(res.data); // Tambahkan ini untuk memeriksa respons dari server
        setData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (id_user) => {
    axios
      .delete(`http://localhost:8081/DeletePetugas/${id_user}`)
      .then(() => {
        axios
          .get("http://localhost:8081/Petugas")
          .then((res) => setData(res.data))
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
    setShowPopup(false);
  };

  const openPopup = (id_user) => {
    setDeleteId(id_user);
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
  const currentItems = Array.isArray(data)
    ? data.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="container">
      <div>
        <div className="header">
          <h2>Data Users Bank Sampah</h2>
          <div className="create">
            <Link
              to="/CreatePetugas"
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
                  <th>Nama Users</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Level</th>
                  <th>Nama Bank Sampah</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((users, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{users.nama}</td>
                    <td>{users.username}</td>
                    <td>{users.email}</td>
                    <td>{users.level}</td>
                    <td>
                      {users.level === "Super Admin" ? (
                        <span className="empty-cell">-</span>
                      ) : (
                        users.nama_bank_sampah
                      )}
                    </td>
                    <td className="action-buttons">
                      <div className="desktop-buttons">
                        <Link
                          className="read"
                          to={`/ReadPetugas/${users.id_user}`}
                        >
                          Read
                        </Link>
                        <Link
                          className="edit"
                          to={`/EditPetugas/${users.id_user}`}
                        >
                          Edit
                        </Link>
                        <button
                          className="delete"
                          onClick={() => openPopup(users.id_user)}
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
                              to={`/ReadPetugas/${users.id_user}`}
                              onClick={() => setDropdownIndex(null)}
                            >
                              Read
                            </Link>
                            <Link
                              className="edit"
                              to={`/EditPetugas/${users.id_user}`}
                              onClick={() => setDropdownIndex(null)}
                            >
                              Edit
                            </Link>
                            <button
                              className="delete"
                              onClick={() => {
                                openPopup(users.id_user);
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

export default Petugas;
