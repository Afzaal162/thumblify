import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState<"login" | "register">("login"); // login or register
  const { user, login, signUp } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Reset form when switching between login and register
  useEffect(() => {
    setFormData({ name: "", email: "", password: "" });
    setError("");
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // clear previous error
    try {
      if (state === "login") {
        const loggedInUser = await login(formData);
        if (loggedInUser) navigate("/"); // login successful
      } else {
        const registeredUser = await signUp(formData);
        if (registeredUser) navigate("/"); // signup successful
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error("Auth error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        autoComplete="on"
        className="sm:w-87.5 w-full text-center bg-gradient-to-r from-red-900 to-pink-900 border border-gray-800 rounded-2xl px-8"
      >
        <h1 className="text-white text-3xl mt-10 font-medium">{state === "login" ? "Login" : "Sign up"}</h1>
        <p className="text-gray-400 text-sm mt-2">Please sign in to continue</p>

        {state !== "login" && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mt-4 p-2 rounded-full bg-gray-800 text-white placeholder-gray-400"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email id"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          className="w-full mt-4 p-2 rounded-full bg-gray-800 text-white placeholder-gray-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete={state === "login" ? "current-password" : "new-password"}
          className="w-full mt-4 p-2 rounded-full bg-gray-800 text-white placeholder-gray-400"
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full h-11 rounded-full text-white bg-pink-600 hover:bg-indigo-500 transition"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p
          onClick={() => setState(state === "login" ? "register" : "login")}
          className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer"
        >
          {state === "login" ? "Don't have an account?" : "Already have an account?"} 
          <span className="text-indigo-400 hover:underline ml-1">click here</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
