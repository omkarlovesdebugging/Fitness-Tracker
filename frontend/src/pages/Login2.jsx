import React, { useState } from 'react';
import './Login2.css';

const Login2 = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        // Example validation, replace with actual login logic
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        // Simulate login error for demonstration
        // Remove this block in production
        if (email !== "test@example.com" || password !== "password") {
            setError("Invalid email or password");
            return;
        }
        // ...existing code...
        console.log('Login attempt:', { email, password });
    };

    return (
        <div className="login2-bg">
            <style>{`
                .login2-bg {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%);
                }
                .login2-form {
                    background: rgba(255,255,255,0.95);
                    border-radius: 20px;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                    padding: 2.5rem 2rem;
                    width: 100%;
                    max-width: 350px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                }
                .login2-form h2 {
                    font-size: 2.2rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    color: #2193b0;
                    letter-spacing: 1px;
                }
                .login2-form input {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    margin-bottom: 1.2rem;
                    border: none;
                    border-radius: 10px;
                    background: #f0f4f8;
                    font-size: 1rem;
                    transition: box-shadow 0.2s;
                    box-shadow: 0 2px 8px rgba(33,147,176,0.08);
                }
                .login2-form input:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px #2193b0;
                }
                .login2-form button {
                    width: 100%;
                    padding: 0.9rem 1rem;
                    background: linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%);
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(33,147,176,0.15);
                    transition: background 0.2s, transform 0.2s;
                }
                .login2-form button:hover {
                    background: linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%);
                    transform: translateY(-2px) scale(1.03);
                }
                .error {
                    color: #e74c3c;
                    background: #fdecea;
                    border-radius: 8px;
                    padding: 0.5rem 1rem;
                    margin-bottom: 1rem;
                    font-size: 1rem;
                    width: 100%;
                    text-align: center;
                }
            `}</style>
            <form className="login2-form" onSubmit={handleSubmit}>
                <h2>Welcome Back!</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login2;
