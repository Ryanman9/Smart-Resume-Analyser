import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/dashboard");
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Smart Resume Analyzer</h1>

                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />

                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}

export default Login;