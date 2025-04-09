"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
const LoginForm = () => {
  const [defaultValues, setDefaultValues] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDefaultValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const [error, setError] = useState<string | undefined>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = defaultValues;

    // server action
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid Credentials");
        return;
      }

      console.log("Login successful", res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
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
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        Register
      </button>
    </form>
  );
};

export default LoginForm;
