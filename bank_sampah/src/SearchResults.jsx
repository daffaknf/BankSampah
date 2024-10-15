import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const searchTerm = query.get("query");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      fetchResults(searchTerm);
    }
  }, [searchTerm]);

  const fetchResults = async (searchTerm) => {
    try {
      const response = await fetch(
        `http://localhost:8081/search?query=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      const text = await response.text();

      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = JSON.parse(text);
        console.log("Fetched results:", data); // Debugging
        setResults(data);
      } else {
        throw new Error("Received non-JSON response from server");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Search Results for &quot;{searchTerm}&quot;</h1>
      {error && <p className="error">Error: {error}</p>}
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            {result.type === "tb_bank_sampah" && (
              <Link to={`/readbanksampah/${result.id}`}>{result.nama}</Link>
            )}
            {result.type === "kategori" && (
              <Link to={`/readkategorisampah/${result.id}`}>{result.nama}</Link>
            )}
            {result.type === "jenis" && (
              <Link to={`/readjenis/${result.id}`}>{result.nama}</Link>
            )}
            {result.type === "users" && (
              <Link to={`/readpetugas/${result.id}`}>{result.nama}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;
