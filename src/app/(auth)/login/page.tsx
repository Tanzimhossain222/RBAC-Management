import Link from "next/link";
import LoginForm from "../_components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 text-gray-800">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Welcome Back!</h2>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          {"  Don't have an account?"}
          <Link href="/register" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
