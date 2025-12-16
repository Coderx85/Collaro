"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
// import Link from 'next/link'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center px-4 sm:px-6 xl:px-8 py-4 sm:py-6 xl:py-8 min-h-screen xl:min-h-screen bg-gradient-to-br from-slate-300 dark:from-slate-950 to-slate-700">
      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignIn.Step name="start" className="w-full sm:max-w-md">
                <Card className="w-full bg-gradient-to-br from-slate-500/85 border-gray-100 border-2 to-slate-500/85 dark:from-slate-950/50 dark:to-slate-950/50">
                  <CardHeader>
                    <CardTitle className="text-black dark:text-white py-2 text-xl sm:text-2xl">
                      Sign in to Collaro
                    </CardTitle>
                    <CardDescription className="text-white/85 text-sm">
                      Welcome back! Please sign in to continue
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-3 sm:gap-y-4 gap-5">
                    <div className="grid gap-y-4">
                      <Clerk.Connection name="google" asChild>
                        <Button
                          className="group flex items-center justify-center py-5 gap-3 text-base border-2 border-blue-700/80 dark:border-blue-800/75 bg-white/50 dark:bg-transparent hover:bg-blue-600 dark:hover:bg-blue-800/85 transition-all duration-200"
                          variant={"secondary"}
                          type="button"
                          disabled={isGlobalLoading}
                        >
                          <Clerk.Loading scope="provider:google">
                            {(isLoading) =>
                              isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                <div className="flex items-center justify-center gap-4 text-blue-700 text-md group-hover:text-white">
                                  <Icons.google className="size-5" />
                                  <span className="font-semibold">
                                    Sign in with Google
                                  </span>
                                </div>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection>
                      <Clerk.Connection name="github" asChild>
                        <Button
                          className="group flex items-center justify-center py-5 gap-4 text-base border-2 border-green-700/80 dark:border-green-800/75 bg-white/50 dark:bg-transparent hover:bg-green-600 dark:hover:bg-green-800/85 transition-all duration-200"
                          variant="secondary"
                          type="button"
                          disabled={isGlobalLoading}
                        >
                          <Clerk.Loading scope="provider:github">
                            {(isLoading) =>
                              isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                <div className="flex items-center justify-center gap-4 text-green-700 text-md group-hover:text-white">
                                  <Icons.gitHub className="size-6" />
                                  <span className="font-semibold">
                                    Sign in with GitHub
                                  </span>
                                </div>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection>
                    </div>
                    <p className="flex items-center gap-x-3 text-xs sm:text-sm text-blackx before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                      or
                    </p>
                    <Clerk.Field
                      name="identifier"
                      className="space-y-2 text-black dark:text-white"
                    >
                      <Clerk.Label asChild>
                        <Label className="text-sm sm:text-base">
                          Email address
                        </Label>
                      </Clerk.Label>
                      <Clerk.Input
                        className="bg-white/50 dark:bg-transparent border-0 border-b-2 border-white/50 h-9 sm:h-10 px-2 text-sm"
                        type="email"
                        required
                        asChild
                        placeholder="Enter your email address"
                      >
                        <Input className="py-1 sm:py-2" />
                      </Clerk.Input>
                      <Clerk.FieldError className="mt-2 block text-xs text-rose-400" />
                    </Clerk.Field>
                    <Clerk.Field
                      name="password"
                      className="space-y-2 text-black dark:text-white"
                    >
                      <Clerk.Label asChild>
                        <Label className="text-sm sm:text-base">Password</Label>
                      </Clerk.Label>
                      <Clerk.Input
                        className="bg-white/50 dark:bg-transparent border-0 border-b-2 border-white/50 h-9 sm:h-10 px-2 text-sm"
                        type="password"
                        required
                        asChild
                        placeholder="Enter your password"
                      >
                        <Input className="py-1 sm:py-2" />
                      </Clerk.Input>
                      <Clerk.FieldError className="mt-2 block text-xs text-rose-400" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-3 sm:gap-y-4">
                      <SignIn.Action submit asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className="text-sm sm:text-base py-5"
                        >
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                "Continue"
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignIn.Action>

                      <Button
                        variant="link"
                        className="text-xs sm:text-sm text-white"
                        asChild
                      >
                        <Clerk.Link navigate="sign-up">
                          Don&apos;t have an account? Sign up
                        </Clerk.Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step>
              <SignIn.Strategy name="password">
                <Card className="w-full sm:max-w-md bg-gradient-to-br from-slate-500/85 border-gray-100 border-2 to-slate-500/85 dark:from-slate-950/50 dark:to-slate-950/50">
                  <CardHeader>
                    <CardTitle className="text-black dark:text-white py-2 text-xl sm:text-2xl">
                      Enter your password
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-y-3 sm:gap-y-4">
                    <Clerk.Field
                      name="password"
                      className="space-y-2 text-black dark:text-white"
                    >
                      <Clerk.Label asChild>
                        <Label className="text-sm sm:text-base">Password</Label>
                      </Clerk.Label>
                      <Clerk.Input
                        className="bg-white/50 dark:bg-transparent border-0 border-b-2 border-white/50 h-9 sm:h-10 px-2 text-sm"
                        type="password"
                        required
                        asChild
                      >
                        <Input className="py-1 sm:py-2" />
                      </Clerk.Input>
                      <Clerk.FieldError className="mt-2 block text-xs text-rose-400" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-3 sm:gap-y-4">
                      <SignIn.Action submit asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className="text-sm sm:text-base py-5"
                        >
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                "Continue"
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignIn.Action>
                      <SignIn.Action navigate="forgot-password" asChild>
                        <Button variant="link" className="text-xs sm:text-sm">
                          Forgot password?
                        </Button>
                      </SignIn.Action>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Strategy>

              <SignIn.Strategy name="reset_password_email_code">
                <Card className="w-full sm:max-w-md bg-gradient-to-br from-slate-500/85 border-gray-100 border-2 to-slate-500/85 dark:from-slate-950/50 dark:to-slate-950/50">
                  <CardHeader>
                    <CardTitle className="text-black dark:text-white py-2 text-xl sm:text-2xl">
                      Check your email
                    </CardTitle>
                    <CardDescription className="text-white/85 text-sm">
                      We sent a code to <SignIn.SafeIdentifier />.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-3 sm:gap-y-4">
                    <Clerk.Field
                      name="code"
                      className="space-y-2 text-black dark:text-white"
                    >
                      <Clerk.Label asChild>
                        <Label className="text-sm sm:text-base">
                          Email code
                        </Label>
                      </Clerk.Label>
                      <Clerk.Input
                        className="bg-white/50 dark:bg-transparent border-0 h-9 sm:h-10 px-2 text-sm"
                        type="otp"
                        required
                        asChild
                      >
                        <Input className="py-1 sm:py-2" />
                      </Clerk.Input>
                      <Clerk.FieldError className="mt-2 block text-xs text-rose-400" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-3 sm:gap-y-4">
                      <SignIn.Action submit asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className="text-sm sm:text-base py-5"
                        >
                          Continue
                        </Button>
                      </SignIn.Action>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Strategy>
            </>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  );
}
