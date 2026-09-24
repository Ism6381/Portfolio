import { Link } from "react-router-dom";
import "./_adminButton.scss";

function AdminButton() {
  return (
    <Link
      to="/admin/login"
      className="admin-button"
      aria-label="Open admin login"
    >
      <span className="admin-button__icon">⚙</span>
      <span className="admin-button__text">Admin</span>
    </Link>
  );
}

export default AdminButton;
