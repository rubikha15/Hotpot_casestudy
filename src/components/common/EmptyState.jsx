function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <div>🍽️</div>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export default EmptyState;