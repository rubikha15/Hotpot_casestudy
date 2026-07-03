import { useEffect, useState } from "react";
import { Tags, PlusCircle } from "lucide-react";
import API from "../../api/api";
import Loader from "../../components/common/Loader";

function Categories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get("/Category");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();

    try {
      await API.post("/Category", { categoryName });

      alert("Category added successfully");
      setCategoryName("");
      loadCategories();
    } catch (err) {
      console.log(err);
      alert("Unable to add category");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="dashboard-head">
        <div>
          <p className="tagline">Admin</p>
          <h1>Category Management</h1>
          <p>Add and view food categories.</p>
        </div>
      </div>

      <section className="form-card">
        <h2>
          <PlusCircle size={22} />
          Add Category
        </h2>

        <form className="form-grid" onSubmit={addCategory}>
          <input
            placeholder="Category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />

          <button className="primary-btn">Add Category</button>
        </form>
      </section>

      <section className="table-card">
        <h2>
          <Tags size={22} />
          All Categories
        </h2>

        {categories.map((c) => (
          <div className="data-row" key={c.categoryId}>
            <div>
              <h3>{c.categoryName}</h3>
              <p>Category ID: {c.categoryId}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Categories;