"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: zodResolver type mismatch
    resolver: zodResolver(loginSchema as any),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {!!loginError && (
        <div className="brutal-border bg-destructive/10 p-3 text-destructive text-sm">
          {loginError.message || "Invalid email or password"}
        </div>
      )}

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
        {!!errors.email && (
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
            placeholder="Enter your password"
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
        {!!errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button
        className="brutal-border brutal-shadow brutal-hover w-full bg-primary text-primary-foreground"
        disabled={isLoggingIn}
        type="submit"
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
