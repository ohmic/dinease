import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser , googleLoginUser} from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  const handleGoogleSuccess = async (response) => {
    const googleToken = response.credential;
    dispatch(googleLoginUser(googleToken))
      .then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          toast({
            title: "Success",
            description: "Logged in with Google",
            variant: "success",
          });
        } else {
          toast({
            title: "Error",
            description: result.payload?.message || "Login failed",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      });
  };
  const handleGoogleFailure = (error) => {
    toast("Error", "Google login failed", "error");
  };

  return (
    // <GoogleOAuthProvider clientId="101236732440-pkh6cci5doacb3s3qre82ur6p5pkvfjk.apps.googleusercontent.com">
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <GoogleLogin
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
      />
    </div>
  );
}

export default AuthLogin;
