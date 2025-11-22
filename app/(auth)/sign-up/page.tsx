"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { countries } from "countries-list";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";

type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  country: string;
  investmentGoals: string;
  riskTolerance: string;
  preferredIndustry: string;
};

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      country: "",
      investmentGoals: "",
      riskTolerance: "",
      preferredIndustry: "",
    },
    mode: "onBlur",
  });

  const COUNTRY_OPTIONS = Object.entries(countries)
    .map(([code, data]) => ({
      value: code,
      label: data.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await signUpWithEmail(data);
      if (response.success) {
        router.push("/");
        toast.success("Account created successfully!");
        reset();
      } else {
        toast.error(response.error || "Sign up failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Sign up failed", {
        description:
          e instanceof Error ? e.message : "Failed to create an account.",
      });
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold text-gray-400 mb-6">
        See beyond numbers — See the market with Invisly.ai.
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-sm"
      >
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="fullName" className="block text-sm text-gray-400">
            Full Name
          </label>
          <Input
            id="fullName"
            type="text"
            placeholder="Alex Johnson"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName", {
              required: "Full name is required",
              pattern: {
                value: /^[a-zA-Z\s'’-]+$/,
                message: "Enter a valid full name",
              },
            })}
          />
          {errors.fullName && (
            <p id="fullName-error" className="text-xs text-red-400">
              {errors.fullName.message}
            </p>
          )}
        </div>

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
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-400">
              {errors.email.message}
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
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
              })}
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none z-10"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && (
            <p id="password-error" className="text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Investment Goals*/}
        <div className="space-y-1">
          <label
            htmlFor="investmentGoals"
            className="block text-sm text-gray-400"
          >
            Investment Goals
          </label>

          <Controller
            control={control}
            name="investmentGoals"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="investmentGoals" className="w-full">
                  <SelectValue placeholder="Select your investment goal" />
                </SelectTrigger>

                <SelectContent className="bg-black text-white">
                  <SelectGroup>
                    <SelectLabel>Investment Goals</SelectLabel>
                    {INVESTMENT_GOALS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            rules={{ required: "Please select an investment goal" }}
          />
          {errors.investmentGoals && (
            <p className="text-xs text-red-400">
              {errors.investmentGoals.message as string}
            </p>
          )}
        </div>

        {/* COUNTRY */}
        <div className="space-y-1">
          <label htmlFor="country" className="block text-sm text-gray-400">
            Country
          </label>

          <Controller
            name="country"
            control={control}
            rules={{ required: "Please select a country" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="country" className="w-full">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>

                <SelectContent className="bg-black text-white">
                  <SelectGroup>
                    <SelectLabel>Countries</SelectLabel>
                    {COUNTRY_OPTIONS.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.country && (
            <p className="text-xs text-red-400">
              {errors.country.message as string}
            </p>
          )}
        </div>

        {/* Risk Tolerance */}
        <div className="space-y-1">
          <label
            htmlFor="riskTolerance"
            className="block text-sm text-gray-400"
          >
            Risk Tolerance
          </label>

          <Controller
            control={control}
            name="riskTolerance"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="riskTolerance" className="w-full">
                  <SelectValue placeholder="Select your risk level" />
                </SelectTrigger>

                <SelectContent className="bg-black text-white">
                  <SelectGroup>
                    <SelectLabel>Risk level</SelectLabel>
                    {RISK_TOLERANCE_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            rules={{ required: "Please select risk level" }}
          />
          {errors.riskTolerance && (
            <p className="text-xs text-red-400">
              {errors.riskTolerance.message as string}
            </p>
          )}
        </div>

        {/* Industry Preference */}
        <div className="space-y-1">
          <label
            htmlFor="preferredIndustry"
            className="block text-sm text-gray-400"
          >
            Industry
          </label>

          <Controller
            control={control}
            name="preferredIndustry"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="preferredIndustry" className="w-full">
                  <SelectValue placeholder="Select Industry Preference" />
                </SelectTrigger>

                <SelectContent className="bg-black text-white">
                  <SelectGroup>
                    <SelectLabel>Prefered Industry</SelectLabel>
                    {PREFERRED_INDUSTRIES.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            rules={{ required: "Please select your industry preference" }}
          />
          {errors.preferredIndustry && (
            <p className="text-xs text-red-400">
              {errors.preferredIndustry.message as string}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-2"
        >
          {isSubmitting ? "Creating Account" : "Start Your Investing Journey"}
        </Button>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            {"Already have an account? "}
            <Link href="/sign-in" className="footer-link">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default SignUp;
