"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
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

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center px-4 sm:px-6 xl:px-8 pt-4 sm:pt-6 xl:pt-6 min-h-screen min-w-screen bg-gradient-to-br from-slate-300 dark:from-slate-950 to-slate-700">
      <SignUp.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignUp.Step
                name="start"
                className="w-full sm:max-w-xl md:max-w-3xl"
              >
                <Card className="w-full bg-gradient-to-br from-slate-500/85 border-gray-100 border-2 to-slate-500/85 dark:from-slate-950/50 dark:to-slate-950/50">
                  <CardHeader>
                    <CardTitle className="text-black dark:text-white py-2 text-xl sm:text-2xl">
                      Create your account
                    </CardTitle>
                    <CardDescription className="text-white/85 text-sm">
                      Join the community of developers and creators
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-3 sm:gap-y-4 w-full">
                    <div className="grid gap-x-4 gap-3 grid-cols-2">
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
                          variant={"secondary"}
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
                    <p className="flex items-center gap-x-3 text-xs sm:text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                      or
                    </p>
                    <div className="grid gap-x-4 gap-3 grid-cols-2">
                      <Clerk.Field
                        name="username"
                        className="space-y-2 text-black dark:text-white"
                      >
                        <Clerk.Label asChild>
                          <Label className="text-sm sm:text-base">
                            Username
                          </Label>
                        </Clerk.Label>
                        <Clerk.Input
                          className="bg-white/50 dark:bg-transparent border-0 border-b-2 border-white/50 dark:border-white/75 rounded-md h-9 sm:h-10 px-2 text-sm"
                          type="text"
                          required
                          asChild
                          placeholder="Choose a unique username"
                        >
                          <Input className="py-1 sm:py-2" />
                        </Clerk.Input>
                        <Clerk.FieldError className="mt-2 block text-xs text-rose-400" />
                      </Clerk.Field>
                      <Clerk.Field
                        name="emailAddress"
                        className="space-y-2 text-black dark:text-white"
                      >
                        <Clerk.Label asChild>
                          <Label className="text-sm sm:text-base">
                            Email address
                          </Label>
                        </Clerk.Label>
                        <Clerk.Input
                          className="bg-white/50 dark:bg-transparent border-0 border-b-2 border-white/50 dark:border-white/75 h-9 sm:h-10 px-2 text-sm"
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
                          <Label className="text-sm sm:text-base">
                            Password
                          </Label>
                        </Clerk.Label>
                        <Clerk.Input
                          className="bg-white/50 dark:bg-transparent border-0 border-b-2 border-white/50 dark:border-white/75 h-9 sm:h-10 px-2 text-sm"
                          type="password"
                          required
                          asChild
                          placeholder="Create a strong password"
                        >
                          <Input className="py-1 sm:py-2" />
                        </Clerk.Input>
                        <Clerk.FieldError className="mt-2 block text-xs text-rose-400" />
                      </Clerk.Field>
                      <Clerk.Field
                        name="passwordConfirm"
                        className="space-y-2 text-black dark:text-white"
                      >
                        <Clerk.Label asChild>
                          <Label className="text-sm sm:text-base">
                            Confirm password
                          </Label>
                        </Clerk.Label>
                        <Clerk.Input
                          className="bg-white/50 dark:bg-transparent border-0 border-b-2 border-white/50 dark:border-white/75 h-9 sm:h-10 px-2 text-sm"
                          type="password"
                          required
                          asChild
                          placeholder="Re-enter your password"
                        >
                          <Input className="py-1 sm:py-2" />
                        </Clerk.Input>
                        <Clerk.FieldError className="mt-2 block text-xs text-rose-400" />
                      </Clerk.Field>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-3 sm:gap-y-4">
                      <SignUp.Action submit asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className="text-sm sm:text-base py-4 sm:py-5"
                        >
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                "Sign Up"
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>

                      <Button
                        variant="link"
                        asChild
                        className="text-xs sm:text-sm"
                      >
                        <Clerk.Link navigate="sign-in">
                          Already have an account? Sign in
                        </Clerk.Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>

              <SignUp.Step
                name="verifications"
                className="w-full sm:max-w-xl md:max-w-2xl"
              >
                <Card className="w-full bg-gradient-to-br from-slate-500/85 border-gray-100 border-2 to-slate-500/85 dark:from-slate-950/50 dark:to-slate-950/50">
                  <CardHeader>
                    <CardTitle className="text-black dark:text-white py-2 text-xl sm:text-2xl">
                      Verify your email
                    </CardTitle>
                    <CardDescription className="text-white/85 text-sm">
                      We&asop;ve sent a verification code to your email
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-3 sm:gap-y-4">
                    <SignUp.Strategy name="email_code">
                      <Clerk.Field
                        name="code"
                        className="space-y-2 text-black dark:text-white"
                      >
                        <Clerk.Label asChild>
                          <Label className="text-sm sm:text-base">
                            Enter verification code
                          </Label>
                        </Clerk.Label>
                        <Clerk.Input
                          className="bg-white/50 border-0 h-9 sm:h-10 px-2 text-sm"
                          type="otp"
                          required
                          asChild
                        >
                          <Input className="py-1 sm:py-2" />
                        </Clerk.Input>
                        <Clerk.FieldError className="mt-2 block text-xs text-rose-400" />
                      </Clerk.Field>
                    </SignUp.Strategy>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-3 sm:gap-y-4">
                      <SignUp.Action submit asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className="text-sm sm:text-base py-4 sm:py-5"
                        >
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                "Verify"
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>

                      <Button
                        variant="link"
                        asChild
                        className="text-xs sm:text-sm"
                      >
                        <Clerk.Link navigate="sign-in">
                          Back to Sign in
                        </Clerk.Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>

              <SignUp.Step
                name="continue"
                className="w-full sm:max-w-xl md:max-w-2xl"
              >
                <Card className="w-full bg-gradient-to-br from-slate-500/85 border-gray-100 border-2 to-slate-500/85 dark:from-slate-950/50 dark:to-slate-950/50">
                  <CardHeader>
                    <CardTitle className="text-black dark:text-white py-2 text-xl sm:text-2xl">
                      Complete your profile
                    </CardTitle>
                    <CardDescription className="text-white/85 text-sm">
                      Choose a username to complete your registration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-3 sm:gap-y-4">
                    <Clerk.Field
                      name="username"
                      className="space-y-2 text-black dark:text-white"
                    >
                      <Clerk.Label asChild>
                        <Label className="text-sm sm:text-base">Username</Label>
                      </Clerk.Label>
                      <Clerk.Input
                        className="bg-white/50 border-0 h-9 sm:h-10 px-2 text-sm"
                        type="text"
                        required
                        asChild
                        placeholder="Choose a unique username"
                      >
                        <Input className="py-1 sm:py-2" />
                      </Clerk.Input>
                      <Clerk.FieldError className="mt-2 block text-xs text-rose-400" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-3 sm:gap-y-4">
                      <SignUp.Action submit asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className="text-sm sm:text-base py-4 sm:py-5"
                        >
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                "Complete Sign Up"
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>

                      <Button
                        variant="link"
                        asChild
                        className="text-xs sm:text-sm"
                      >
                        <Clerk.Link navigate="sign-up">
                          Already have an account? Sign in
                        </Clerk.Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>
            </>
          )}
        </Clerk.Loading>
      </SignUp.Root>
    </div>
  );
}
