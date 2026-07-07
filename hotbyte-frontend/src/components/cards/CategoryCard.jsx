function CategoryCard({ category }) {
  return (
    <div className="category-card">
      <div className="category-icon">🍽️</div>
      <h3>{category.categoryName}</h3>
    </div>
  );
}

export default CategoryCard;