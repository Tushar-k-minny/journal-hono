"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(120, "Display name must be 120 characters or less"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
      "Password must contain at least one special character"
    )
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  {
    label: "One special character",
    test: (p: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
  },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isRegistering, registerError } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: zodResolver type mismatch
    resolver: zodResolver(registerSchema as any),
  });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {registerError && (
        <div className="brutal-border bg-destructive/10 p-3 text-destructive text-sm">
          {registerError.message || "Registration failed. Please try again."}
        </div>
      )}

      <div className="space-y-2">
        <Label className="font-medium" htmlFor="displayName">
          Display Name
        </Label>
        <Input
          className="brutal-border"
          id="displayName"
          placeholder="Your name"
          type="text"
          {...register("displayName")}
        />
        {errors.displayName && (
          <p className="text-destructive text-sm">
            {errors.displayName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-medium" htmlFor="email">
          Email
        </Label>
        <Input
          className="brutal-border"
          id="email"
          placeholder="you@example.com"
          type="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-medium" htmlFor="password">
          Password
        </Label>
        <div className="relative">
          <Input
            className="brutal-border pr-10"
            id="password"
            placeholder="Create a strong password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <button
            className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </button>
        </div>

        {/* Password strength indicator */}
        {password && (
          <div className="brutal-border space-y-2 bg-muted p-3">
            <p className="font-medium text-muted-foreground text-xs">
              Password requirements:
            </p>
            <ul className="space-y-1">
              {passwordRequirements.map((req) => {
                const passed = req.test(password);
                return (
                  <li
                    className={cn(
                      "flex items-center gap-2 text-xs",
                      passed
                        ? "text-secondary-foreground"
                        : "text-muted-foreground"
                    )}
                    key={req.label}
                  >
                    {passed ? (
                      <Check className="h-3 w-3 text-secondary" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {req.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button
        className="brutal-border brutal-shadow brutal-hover w-full bg-primary text-primary-foreground"
        disabled={isRegistering}
        type="submit"
      >
        {isRegistering ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
