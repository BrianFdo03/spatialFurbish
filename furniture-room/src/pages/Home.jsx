import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Home Page</h1>

      <Link to="/configurator">Open Room Configurator</Link>
      <br />
      <Link to="/login">Login</Link>
      <br />
      <Link to="/admin">Admin Panel</Link>
    </div>
  );
}