function DashboardCard({ title, value, icon, subtitle }) {
  return (
    <div className="dashboard-card">
      <div className="dash-icon">{icon}</div>

      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        {subtitle && <span>{subtitle}</span>}
      </div>
    </div>
  );
}

export default DashboardCard;