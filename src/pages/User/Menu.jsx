import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/api";
import { useUser } from "../../context/UserContext";

import MenuCard from "../../components/cards/MenuCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

function Menu() {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [filters, setFilters] = useState({
    keyword: "",
    categoryId: "",
    isVeg: "",
    minPrice: "",
    maxPrice: "",
  });

  const loadMenus = async () => {
    try {
      setLoading(true);

      const res = await API.get("/Menu", {
        params: {
          pageNumber: 1,
          pageSize: 50,
        },
      });

      setMenus(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      toast.error("Unable to load menu");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await API.get("/Category");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadMenus();
    loadCategories();
  }, []);

  const handleSearchChange = (value) => {
    setFilters({
      ...filters,
      keyword: value,
    });

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = menus
      .filter(
        (item) =>
          item.itemName?.toLowerCase().includes(value.toLowerCase()) ||
          item.categoryName?.toLowerCase().includes(value.toLowerCase()) ||
          item.restaurantName?.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 6);

    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const selectSuggestion = (item) => {
    setFilters({
      ...filters,
      keyword: item.itemName,
    });

    setShowSuggestions(false);
  };

  const handleSearch = async () => {
    try {
      if (!filters.keyword.trim()) {
        loadMenus();
        return;
      }

      setLoading(true);

      const res = await API.get("/Menu/search", {
        params: {
          keyword: filters.keyword,
        },
      });

      setMenus(Array.isArray(res.data) ? res.data : []);
      setShowSuggestions(false);
    } catch (err) {
      console.log(err);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);

      const params = {};

      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.isVeg !== "") params.isVeg = filters.isVeg;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await API.get("/Menu/filter", { params });

      setMenus(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      toast.error("Filter failed");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      categoryId: "",
      isVeg: "",
      minPrice: "",
      maxPrice: "",
    });

    setSuggestions([]);
    setShowSuggestions(false);
    loadMenus();
  };

  const addToCart = async (item) => {
    if (!user) {
      toast.warning("Please login first");
      return;
    }

    if (user.role !== "User") {
      toast.warning("Only users can add items to cart");
      return;
    }

    if (!item.isAvailable) {
      toast.info("This item is currently unavailable");
      return;
    }

    try {
      await API.post(`/Cart/${user.id}`, {
        menuItemId: item.menuItemId,
        quantity: 1,
      });

      toast.success(`${item.itemName} added to cart 🛒`);
    } catch (err) {
      console.log(err);
      toast.error("Unable to add item to cart");
    }
  };

  return (
    <main className="page">
      <div className="menu-banner">
        <div>
          <p className="tagline">Explore Food</p>
          <h1>Discover dishes from HotByte restaurants</h1>
          <p>
            Search by food name, filter by category, price range, and
            veg/non-veg.
          </p>
        </div>

        <div className="banner-emoji">🍛</div>
      </div>

      <section className="filter-card">
        <div className="search-box suggestion-wrapper">
          <Search size={20} />

          <input
            placeholder="Search dosa, burger, biryani..."
            value={filters.keyword}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => filters.keyword && setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <button onClick={handleSearch}>Search</button>

          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestion-box">
              {suggestions.map((item) => (
                <div
                  key={item.menuItemId}
                  className="suggestion-item"
                  onClick={() => selectSuggestion(item)}
                >
                  <div className="suggestion-img">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.itemName} />
                    ) : (
                      "🍽️"
                    )}
                  </div>

                  <div>
                    <strong>{item.itemName}</strong>
                    <small>
                      {item.categoryName || "Food"} • ₹
                      {item.discountPrice || item.price}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="advanced-filters">
          <select
            value={filters.categoryId}
            onChange={(e) =>
              setFilters({
                ...filters,
                categoryId: e.target.value,
              })
            }
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>

          <select
            value={filters.isVeg}
            onChange={(e) =>
              setFilters({
                ...filters,
                isVeg: e.target.value,
              })
            }
          >
            <option value="">Veg / Non-Veg</option>
            <option value="true">Veg</option>
            <option value="false">Non-Veg</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({
                ...filters,
                minPrice: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxPrice: e.target.value,
              })
            }
          />

          <button className="filter-btn" onClick={handleFilter}>
            <SlidersHorizontal size={18} />
            Apply
          </button>

          <button className="clear-btn" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : menus.length === 0 ? (
        <EmptyState
          title="No food found"
          text="Try changing your search or filters."
        />
      ) : (
        <section className="menu-grid">
          {menus.map((item) => (
            <MenuCard key={item.menuItemId} item={item} onAdd={addToCart} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Menu;