"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface SignUpFormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await signInWithEmail(data);
      console.log(response);
      if (response.success) {
        router.push("/");
        toast.success("Signed in successfully!");
      } else {
        toast.error(response.error || "Sign in failed");
      }
      reset();
    } catch (e) {
      console.error(e);
      toast.error("Sign in failed", {
        description:
          e instanceof Error ? e.message : "Failed to sign in account.",
      });
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold text-gray-400 mb-6">
        Welcome back — Ready to make your next smart move?
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-sm"
      >
        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm text-gray-400">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-400">
              {errors.email.message as string}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1 relative">
          <label htmlFor="password" className="block text-sm text-gray-400">
            Password
          </label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!errors.password || undefined}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters",
                },
              })}
              className="pr-10"
            />

            {/* Password visibility toggle */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none z-10"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error message */}
          {errors.password && (
            <p id="password-error" className="text-xs text-red-400">
              {errors.password.message as string}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-2"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            {"Don't have an account? "}
            <Link href="/sign-up" className="footer-link">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default SignIn;
