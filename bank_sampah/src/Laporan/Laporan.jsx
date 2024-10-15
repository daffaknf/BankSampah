import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Laporan = () => {
  const [data, setData] = useState([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const id_bank_sampah = localStorage.getItem("idBankSampah");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const response = await axios.get("http://localhost:8081/Laporan", {
          params: {
            id_bank_sampah,
            user_role: userRole,
            start_date: startDate,
            end_date: endDate,
          },
        });
        setData(response.data.data);
        setTotalHarga(response.data.totalHarga);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchLaporan();
  }, [id_bank_sampah, userRole, startDate, endDate]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Logic for displaying current data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  // Handle date change
  const handleDateChange = () => {
    setCurrentPage(1); // Reset to first page on date change
    fetchLaporan();
  };

  return (
    <div className="container">
      <div>
        <div className="header">
          <h2>Data Laporan Bank Sampah</h2>
          <div className="filter">
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onBlur={handleDateChange}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onBlur={handleDateChange}
              />
            </label>
          </div>
        </div>
        <div className="content">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Petugas</th>
                  <th>Nama Nasabah</th>
                  <th>Nama Bank Sampah</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((transaksi, index) => (
                  <tr key={transaksi.id_transaksi}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{transaksi.nama_petugas}</td>
                    <td>{transaksi.nama_nasabah}</td>
                    <td>{transaksi.nama_bank_sampah}</td>
                    <td>{formatDate(transaksi.tanggal)}</td>
                    <td>{transaksi.Total}</td>
                    <td className="action-buttons">
                      <Link
                        className="read-laporan"
                        to={`/ReadLaporan/${transaksi.id_transaksi}`}
                      >
                        Read
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 1}>
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
                disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
              >
                Next
              </button>
            </div>
            <div className="total-harga">
              <h3>Total Harga: {totalHarga}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laporan;
