import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const API = import.meta.env.VITE_API_URL;

  const [name, setName] = useState("");   // ← ADD
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {   // ← UPDATE
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${API}/api/auth/register`, {
        name,   // ← ADD
        email,
        password
      });

      navigate("/");
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Create Account</h1>

        {error && <p className="login-error">{error}</p>}

        {/* NAME INPUT */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

      </div>
    </div>
  );
}

export default Register;