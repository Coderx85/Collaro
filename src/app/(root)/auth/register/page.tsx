"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  User,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import { CreateUserSchema } from "@/db/schema/schema";
import { IconAt } from "@tabler/icons-react";

const registerSchema = CreateUserSchema;

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const defaultValues: RegisterFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      if (!value) {
        toast.error("Please fill all the fields");
        return;
      }
      const result = registerSchema.safeParse(value);
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      try {
        const result = await signUp.email({
          email: value.email,
          password: value.password,
          name: value.name,
          userName: value.userName,
        });

        if (result.error) {
          toast.error(result.error.message || "Failed to create account");
          return;
        }

        toast.success("Account created successfully!", {
          description: "Welcome to Collaro. Redirecting to your workspace...",
        });
        router.push("/workspace");
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Registration error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleNext = () => {
    // Validate step 1 fields before proceeding
    const nameField = form.getFieldValue("name");
    const userNameField = form.getFieldValue("userName");
    const emailField = form.getFieldValue("email");

    if (!nameField || nameField.trim() === "") {
      toast.error("Please enter your full name");
      return;
    }

    if (!userNameField || userNameField.trim() === "") {
      toast.error("Please enter a username");
      return;
    }

    if (!emailField || emailField.trim() === "") {
      toast.error("Please enter your email address");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-4">
      <div
        className={`h-2 w-2 rounded-full transition-all ${currentStep === 1 ? "bg-primary w-8" : "bg-slate-400"}`}
      />
      <div
        className={`h-2 w-2 rounded-full transition-all ${currentStep === 2 ? "bg-primary w-8" : "bg-slate-400"}`}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Card className="w-full max-w-md relative z-10 backdrop-blur-4xl backdrop-blur-xl bg-white/50 dark:bg-white/5 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <CardTitle className="text-2xl text-secondary font-bold">
            {currentStep === 1 ? "Create Account" : "Secure Your Account"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStep === 2) {
                form.handleSubmit();
              } else {
                handleNext();
              }
            }}
          >
            <FieldGroup>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <>
                  <div className="flex gap-4">
                    {/* Name Field */}
                    <form.Field
                      name="name"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              Full Name
                            </FieldLabel>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                              <Input
                                id={field.name}
                                name={field.name}
                                type="text"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="Enter your name"
                                autoComplete="name"
                                className="pl-10"
                              />
                            </div>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />

                    {/* Email Field */}
                    <form.Field
                      name="email"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              Email Address
                            </FieldLabel>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                              <Input
                                id={field.name}
                                name={field.name}
                                type="email"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
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
                    />
                  </div>

                  <form.Field
                    name="userName"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            htmlFor={field.name}
                            className="text-slate-200"
                          >
                            Usename
                          </FieldLabel>
                          <div className="relative">
                            <IconAt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                            <Input
                              id={field.name}
                              name={field.name}
                              type="text"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="Enter your username"
                              autoComplete="username"
                              className="pl-10 pr-10"
                            />
                          </div>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </>
              )}

              {/* Step 2: Security */}
              {currentStep === 2 && (
                <>
                  {/* Password Field */}
                  <form.Field
                    name="password"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            htmlFor={field.name}
                            className="text-slate-200"
                          >
                            Password
                          </FieldLabel>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                            <Input
                              id={field.name}
                              name={field.name}
                              type={showPassword ? "text" : "password"}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="Create a strong password"
                              autoComplete="new-password"
                              className="pl-10 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground dark:text-foreground hover:text-white transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Confirm Password Field */}
                  <form.Field
                    name="confirmPassword"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            htmlFor={field.name}
                            className="text-foreground dark:text-foreground"
                          >
                            Confirm Password
                          </FieldLabel>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                            <Input
                              id={field.name}
                              name={field.name}
                              type={showConfirmPassword ? "text" : "password"}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="Confirm your password"
                              autoComplete="new-password"
                              className="pl-10 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground dark:text-foreground hover:text-secondary/80 transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </>
              )}

              {/* Navigation Buttons */}
              {currentStep === 1 ? (
                <Button type="submit" className="w-full" variant={"secondary"}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleBack}
                    className="w-1/2"
                    variant={"outline"}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2"
                    variant={"secondary"}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                </div>
              )}
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-default-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary-foreground dark:text-green-600/85 hover:text-secondary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
