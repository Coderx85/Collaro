"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { config } from "@/lib/config";
import { LoginForm } from "@/components/form";

export default function LoginPage() {
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
          <LoginForm />
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
