import React, { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    // assigning the state variable user
    // user state will only now store the signup form fields in JSON format {key:val}
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  type: "basic",
  });

  // creating the user object by putting the values 
  const { name, username, email, password, confirmPassword } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const payload = {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        // normalize to backend's expected casing
        type: (user.type || "basic").toLowerCase(),
        role: "user",
      };
  const data = await signup(payload);
  if (data?.userId) localStorage.setItem("userId", String(data.userId));
      navigate("/dashboard");
    } catch (error) {
      const server = error?.response?.data;
      const msg = typeof server === "string" ? server : (server?.message || error?.message || "Sign up failed");
      console.error("Error creating user:", server || error);
      alert(msg);
    }
  };

  return (
    <>
      <style>{`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f0f2f5;
          padding: 2rem;
        }
        .signup-form {
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
        }
        .signup-form h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: #333;
          font-weight: 600;
        }
        .form-label {
          font-weight: 500;
          color: #555;
          margin-bottom: 0.5rem;
        }
        .form-control {
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 0.75rem 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          outline: none;
        }
        .form-text {
          color: #777;
          font-size: 0.875rem;
        }
        .btn-primary {
          width: 100%;
          padding: 0.75rem;
          border-radius: 8px;
          background-color: #007bff;
          border: none;
          font-weight: 500;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }
        .btn-primary:hover {
          background-color: #0056b3;
          transform: translateY(-2px);
        }
        .mb-4 {
          margin-bottom: 1.5rem !important;
        }
      `}</style>

      <div className="signup-container">
        <form onSubmit={onSubmit} className="signup-form">
          <h2>Create Account</h2>

          <div className="mb-4">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter your full name"
              required
              value={name}
              onChange={onInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              value={username}
              onChange={onInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={onInputChange}
            />
            <div className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Create a password"
              required
              minLength={6}
              value={password}
              onChange={onInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={onInputChange}
            />
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
            <a href="/signin" className="btn btn-link">Already a member?</a>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
