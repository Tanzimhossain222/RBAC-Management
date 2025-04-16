"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterForm = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDefaultValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { email, password } = defaultValues;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      setSuccess(true);

      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "An error occurred during registration");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
          Registration successful! Redirecting to login...
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          onChange={handleInputChange}
          value={defaultValues.email}
          disabled={loading || success}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          onChange={handleInputChange}
          value={defaultValues.password}
          disabled={loading || success}
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-400"
        disabled={loading || success}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;
