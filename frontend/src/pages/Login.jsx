import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function Login() {
  const API = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const handleRegister = async () => {
    if (!email || !password) {
        setError("Please fill in all fields.");
        return;
    }

    setLoading(true);
    setError("");

    try {
        await axios.post(`${API}/api/auth/register`, {
        email,
        password,
        });

        setError("Registered successfully. You can now login.");

    } catch (err) {
        setError("User already exists");
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="login-page">
    <div className="login-card">
        <h1>Smart Resume Analyzer</h1>

        {error && <p className="login-error">{error}</p>}

        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
        />

        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        />

        <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
        </button>
        
        <p className="register-link">
        Don't have account? 
        <span onClick={() => navigate("/register")}>
            Register
        </span>
        </p>

    </div>
    </div>
  );
}

export default Login;