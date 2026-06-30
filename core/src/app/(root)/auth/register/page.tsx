"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
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
import {
  IconAt,
  IconCircleArrowLeftFilled,
  IconCircleArrowRightFilled,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconLock,
  IconMail,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
import { signUpAction } from "@/action";
import { type RegisterFormValues, registerSchema } from "@/types/form";
import { routeConfig } from "@/lib/routeConfig";

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

  const form = useForm({ defaultValues });

  const handleNext = () => {
    // Validate step 1 fields before proceeding
    const nameField = form.getFieldValue("name");
    const userNameField = form.getFieldValue("userName");
    const emailField = form.getFieldValue("email");

    if (!nameField || nameField.trim() === "") {
      toast.error("Please enter your full name");
      return;
    }

    if (nameField.length < 6) {
      toast.error("Name must be at least 6 characters");
      return;
    }

    if (!userNameField || userNameField.trim() === "") {
      toast.error("Please enter a username");
      return;
    }

    if (userNameField.length < 6) {
      toast.error("Username must be at least 6 characters");
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
            onSubmit={async (e) => {
              try {
                e.preventDefault();
                if (currentStep !== 2) {
                  handleNext();
                  return;
                }

                const name = form.getFieldValue("name");
                const email = form.getFieldValue("email");
                const userName = form.getFieldValue("userName");
                const password = form.getFieldValue("password");
                const confirmPassword = form.getFieldValue("confirmPassword");

                const values = { name, email, userName, password, confirmPassword };
                console.log("[register] values:", values);

                setIsSubmitting(true);
                const parsed = registerSchema.safeParse(values);
                if (!parsed.success) {
                  const msg = parsed.error.issues?.[0]?.message || "Validation failed";
                  toast.error(msg);
                  return;
                }

                console.log("[register] calling signUpAction");
                const signUpResult = await signUpAction(values);
                console.log("[register] result:", signUpResult);

                if (!signUpResult.success) {
                  toast.error(signUpResult.error || "Failed to create account");
                  return;
                }

                toast.success("Account created successfully!");
                router.push("/workspace");
              } catch (error) {
                console.error("[register] UNCAUGHT:", error);
                toast.error("An unexpected error occurred. Please try again.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <FieldGroup>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <>
                  <div className="flex gap-4">
                    {/* Name Field */}
                    <form.Field name="name">
                      {(field) => {
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
                              <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
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
                    </form.Field>

                    {/* Email Field */}
                    <form.Field name="email">
                      {(field) => {
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
                              <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
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
                    </form.Field>
                  </div>

                  <form.Field name="userName">
                    {(field) => {
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
                  </form.Field>
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
                            <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
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
                                <IconEyeOff className="h-4 w-4" />
                              ) : (
                                <IconEye className="h-4 w-4" />
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
                            <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
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
                                <IconEyeOff className="h-4 w-4" />
                              ) : (
                                <IconEye className="h-4 w-4" />
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
                  <IconCircleArrowRightFilled className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleBack}
                    className="w-1/2"
                    variant={"outline"}
                  >
                    <IconCircleArrowLeftFilled className="mr-2 h-4 w-4" />
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
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <IconUserPlus className="mr-2 h-4 w-4" />
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
              href={routeConfig.auth.signIn}
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
