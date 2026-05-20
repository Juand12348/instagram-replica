import RegisterPage from "./registrerPage";
import LoginPage from "./loginUser";

export default function AuthPage() {
  return (
    <div className="flex gap-8 justify-center mt-10">
      <RegisterPage />
      <LoginPage />
    </div>
  );
}