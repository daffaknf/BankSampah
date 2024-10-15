import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BankSampah = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/BankSampah");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = (id_bank_sampah) => {
    axios
      .delete(`http://localhost:8081/DeleteBankSampah/${id_bank_sampah}`)
      .then(() => {
        fetchData();
      })
      .catch((err) => {
        console.error("Error deleting item:", err);
      });
    setShowPopup(false);
  };

  const openPopup = (id_bank_sampah) => {
    setDeleteId(id_bank_sampah);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const toggleDropdown = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  // Logic for displaying current data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="container">
      <div>
        <div className="header">
          <h2>Data Bank Sampah</h2>
          <div className="create">
            <Link
              to="/CreateBankSampah"
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
                  <th>Nama Bank Sampah</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((bankSampah, index) => (
                  <tr key={bankSampah.id_bank_sampah}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{bankSampah.nama_bank_sampah}</td>
                    <td className="action-buttons">
                      <div className="desktop-buttons">
                        <Link
                          className="read"
                          to={`/ReadBankSampah/${bankSampah.id_bank_sampah}`}
                        >
                          Read
                        </Link>
                        <Link
                          className="edit"
                          to={`/EditBankSampah/${bankSampah.id_bank_sampah}`}
                        >
                          Edit
                        </Link>
                        <button
                          className="delete"
                          onClick={() => openPopup(bankSampah.id_bank_sampah)}
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
                              to={`/ReadBankSampah/${bankSampah.id_bank_sampah}`}
                              onClick={() => setDropdownIndex(null)}
                            >
                              Read
                            </Link>
                            <Link
                              className="edit"
                              to={`/EditBankSampah/${bankSampah.id_bank_sampah}`}
                              onClick={() => setDropdownIndex(null)}
                            >
                              Edit
                            </Link>
                            <button
                              className="delete"
                              onClick={() => {
                                openPopup(bankSampah.id_bank_sampah);
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
            <h3>Are you sure you want to delete this item?</h3>
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

export default BankSampah;
