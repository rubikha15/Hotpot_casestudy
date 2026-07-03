import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Truck, ShieldCheck, Star } from "lucide-react";
import API from "../../api/api";

import CategoryCard from "../../components/cards/CategoryCard";
import RestaurantCard from "../../components/cards/RestaurantCard";
import MenuCard from "../../components/cards/MenuCard";
import Loader from "../../components/common/Loader";

function Home() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);

  const loadHomeData = async () => {
    try {
      const [restaurantRes, categoryRes, menuRes] = await Promise.all([
        API.get("/restaurants"),
        API.get("/Category"),
        API.get("/Menu", {
          params: { pageNumber: 1, pageSize: 6 },
        }),
      ]);

      setRestaurants(restaurantRes.data.slice(0, 6));
      setCategories(categoryRes.data.slice(0, 6));
      setMenus(menuRes.data.slice(0, 6));
    } catch (err) {
      console.log(err);
      alert("Unable to load home data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  if (loading) return <Loader />;

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-left">
          <p className="tagline">HotByte Food Delivery</p>

          <h1>
            Hungry? Your favourite food is just one click away.
          </h1>

          <p className="hero-desc">
            Browse restaurants, search dishes, filter by category, add to cart,
            and place orders with a smooth Swiggy-style experience.
          </p>

          <div className="hero-search">
            <Search size={20} />
            <input placeholder="Search biryani, pizza, dosa..." />
            <Link to="/menu">Search</Link>
          </div>

          <div className="hero-actions">
            <Link to="/menu" className="primary-btn">
              Order Now
            </Link>

            <Link to="/login" className="secondary-btn">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="floating-card big">
            <div className="food-emoji">🍕</div>
            <h2>Flat 20% Off</h2>
            <p>On selected restaurants</p>
          </div>

          <div className="floating-card small">
            <Star size={18} />
            4.8 Rating
          </div>
        </div>
      </section>

      <section className="trust-row">
        <div>
          <Truck />
          <span>Fast Delivery</span>
        </div>

        <div>
          <ShieldCheck />
          <span>Secure Orders</span>
        </div>

        <div>
          <Star />
          <span>Top Restaurants</span>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Popular Categories</h2>
            <p>Choose your favourite food type</p>
          </div>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.categoryId} category={category} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Featured Restaurants</h2>
            <p>Restaurants available in HotByte</p>
          </div>

          <Link to="/menu">View Menu</Link>
        </div>

        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.restaurantId}
              restaurant={restaurant}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Popular Dishes</h2>
            <p>Freshly listed menu from your database</p>
          </div>

          <Link to="/menu">Explore All</Link>
        </div>

        <div className="menu-grid">
          {menus.map((item) => (
            <MenuCard key={item.menuItemId} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;