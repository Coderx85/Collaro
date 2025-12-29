"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconLock,
  IconMail,
  IconUserPlus,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SelectUserSchema } from "@/db/schema/schema";
import { loginAction } from "@/action";
import { config } from "@/lib/config";

const loginSchema = SelectUserSchema.pick({
  email: true,
  password: true,
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const result = await loginAction(value.email, value.password);

        if (!result.success) {
          console.error("Login error:", result.error);
          toast.error(result.error || "Failed to sign in");
          return;
        }

        toast.success("Welcome back!", {
          description: "You have been signed in successfully.",
        });

        if (result.data?.organizationExists === false) {
          router.push("/organization/new");
          return;
        }

        router.push("/workspace");
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Login error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-white/50 dark:bg-white/5 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <CardTitle className="text-2xl font-bold text-secondary">
            Welcome Back
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Login Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              {/* Email Field */}
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-slate-200"
                      >
                        Email Address
                      </FieldLabel>
                      <div className="relative">
                        <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="pl-10"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Password Field */}
              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center justify-between">
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-foreground dark:text-foreground"
                        >
                          Password
                        </FieldLabel>
                        <Link
                          href="/auth/forgot-password"
                          className="text-xs text-secondary hover:text-secondary/80 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showPassword ? "text" : "password"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="pl-10 pr-10"
                        />
                        <Button
                          variant={"link"}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground dark:text-foreground hover:text-secondary/80 transition-colors"
                        >
                          {showPassword ? (
                            <IconEyeOff className="h-4 w-4" />
                          ) : (
                            <IconEye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                variant={"secondary"}
              >
                {isSubmitting ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <IconUserPlus className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-sm text-default-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={config.SIGN_UP}
              className="text-primary-foreground dark:text-green-600/85 hover:text-secondary/80 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
