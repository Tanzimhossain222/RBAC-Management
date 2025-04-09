import Link from "next/link";
import RegisterForm from "../_components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 text-gray-800">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Create an Account
        </h2>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
