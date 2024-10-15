import PropTypes from "prop-types";
import { BsSearch, BsJustify } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Header({ OpenSidebar }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Status login
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchSuggestions = async (searchTerm) => {
    try {
      const response = await fetch(
        `http://localhost:8081/search?query=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchSuggestions(searchTerm);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && isLoggedIn) {
      if (suggestions.length > 0) {
        const firstSuggestion = suggestions[0];
        navigateToResult(firstSuggestion);
      }
    }
  };

  const navigateToResult = (result) => {
    console.log("Navigating to result:", result);
    switch (result.type) {
      case "tb_bank_sampah":
        navigate(`/readbanksampah/${result.id}`);
        break;
      case "kategori":
        navigate(`/readkategorisampah/${result.id}`);
        break;
      case "jenis":
        navigate(`/readjenis/${result.id}`);
        break;
      case "users":
        navigate(`/readpetugas/${result.id}`);
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (result) => {
    console.log("Suggestion clicked:", result);
    navigateToResult(result);
    setSuggestions([]); // Clear suggestions after click
  };

  return (
    <header className="headerr">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      {/* <div className="header-left">
        <form
          onSubmit={handleSearch}
          className={`search-form ${isLoggedIn ? "" : "transparent"}`} // Tambahkan kelas berdasarkan status login
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!isLoggedIn} // Disable input jika belum login
          />
          <button type="submit" disabled={!isLoggedIn}>
            <BsSearch className="iconn" />
          </button>
        </form>
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.nama}
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </header>
  );
}

Header.propTypes = {
  OpenSidebar: PropTypes.func.isRequired,
};

export default Header;
