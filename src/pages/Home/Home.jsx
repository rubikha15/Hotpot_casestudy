import { Link } from "react-router-dom";
import {
  Search,
  Star,
  Clock,
  Bike,
  ShieldCheck,
  Utensils,
  Pizza,
  Coffee,
  IceCream,
} from "lucide-react";

function Home() {
  return (
    <main className="home-premium">
      <section className="hero-premium">
        <div className="hero-content">
          <p className="hero-badge">🔥 Hot meals. Fast delivery.</p>

          <h1>
            Delivering Happiness,
            <br />
            One Bite at a Time.
          </h1>

          <p className="hero-text">
            Discover delicious food from your favourite restaurants and get it
            delivered fresh, fast, and hot.
          </p>

          <div className="hero-search-premium">
            <Search size={21} />
            <input placeholder="Search pizza, biryani, dosa, burger..." />
            <Link to="/menu">Search</Link>
          </div>

          <div className="hero-actions">
            <Link to="/menu" className="primary-btn">
              Explore Menu
            </Link>
            <Link to="/register" className="secondary-btn">
              Get Started
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <h3>500+</h3>
              <p>Restaurants</p>
            </div>
            <div>
              <h3>20K+</h3>
              <p>Orders</p>
            </div>
            <div>
              <h3>4.9★</h3>
              <p>Ratings</p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="food-circle">
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80"
              alt="HotByte food"
            />
          </div>

          <div className="float-card top">
            <Star size={18} fill="currentColor" />
            4.9 Rated
          </div>

          <div className="float-card bottom">
            <Bike size={18} />
            25 min delivery
          </div>

          <span className="floating-food pizza">🍕</span>
          <span className="floating-food burger">🍔</span>
          <span className="floating-food coffee">☕</span>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-head center">
          <p className="tagline">Categories</p>
          <h2>What are you craving today?</h2>
        </div>

        <div className="premium-category-grid">
          <Link to="/menu" className="premium-category">
            <Utensils />
            <h3>Breakfast</h3>
            <p>Dosa, Idli, Pongal</p>
          </Link>

          <Link to="/menu" className="premium-category">
            <Pizza />
            <h3>Fast Food</h3>
            <p>Pizza, Burger, Fries</p>
          </Link>

          <Link to="/menu" className="premium-category">
            <Coffee />
            <h3>Beverages</h3>
            <p>Coffee, Shakes</p>
          </Link>

          <Link to="/menu" className="premium-category">
            <IceCream />
            <h3>Desserts</h3>
            <p>Brownie, Ice Cream</p>
          </Link>
        </div>
      </section>

      <section className="premium-section split-section">
        <div>
          <p className="tagline">Why HotByte?</p>
          <h2>Food delivery made simple and delightful.</h2>
          <p>
            HotByte connects users, restaurants, and admins through a smooth
            full-stack ordering experience with live tracking and secure login.
          </p>

          <div className="feature-list">
            <div>
              <Clock />
              <span>Quick ordering</span>
            </div>
            <div>
              <Bike />
              <span>Live tracking</span>
            </div>
            <div>
              <ShieldCheck />
              <span>JWT secured</span>
            </div>
          </div>
        </div>

        <div className="offer-card">
          <h3>Today’s Special</h3>
          <h1>30% OFF</h1>
          <p>On selected pizzas, burgers, biryani and desserts.</p>
          <Link to="/menu" className="primary-btn">
            Order Now
          </Link>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-head center">
          <p className="tagline">Popular Picks</p>
          <h2>HotByte favourites</h2>
        </div>

        <div className="popular-grid">
          {[
            {
              name: "Margherita Pizza",
              price: "₹259",
              img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
            },
            {
              name: "Chicken Burger",
              price: "₹179",
              img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
            },
            {
              name: "Chicken Biryani",
              price: "₹289",
              img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80",
            },
          ].map((item) => (
            <div className="popular-card" key={item.name}>
              <img src={item.img} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>⭐ 4.8 • Fast Delivery</p>
                <strong>{item.price}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;