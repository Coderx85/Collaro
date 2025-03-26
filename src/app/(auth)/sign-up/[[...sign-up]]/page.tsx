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
    <div className='flex items-center justify-center px-4 sm:px-6 xl:px-8 py-4 sm:py-6 xl:py-8 min-h-[calc(100vh-73px)] bg-gradient-to-br from-slate-300 dark:from-slate-950 to-slate-700'>
      <SignUp.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignUp.Step name='start' className='w-full sm:max-w-md'>
                <Card className='w-full bg-gradient-to-br from-slate-500/85 border-gray-100 border-2 to-slate-500/85 dark:from-slate-950/50 dark:to-slate-950/50'>
                  <CardHeader>
                    <CardTitle className='text-black dark:text-white py-2 text-xl sm:text-2xl'>
                      Create your account
                    </CardTitle>
                    <CardDescription className='text-white/85 text-sm'>
                      Join the community of developers and creators
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='grid gap-y-3 sm:gap-y-4'>
                    <div className='grid gap-x-4'>
                      <Clerk.Connection name='google' asChild>
                        <Button
                          className='flex items-center justify-center py-4 sm:py-5 gap-2 sm:gap-3 text-primary border-2 border-primary bg-white/50 dark:bg-transparent hover:bg-gray-200 text-sm sm:text-base'
                          variant='outline'
                          type='button'
                          disabled={isGlobalLoading}
                        >
                          <Clerk.Loading scope='provider:google'>
                            {(isLoading) =>
                              isLoading ? (
                                <Icons.spinner className='size-4 animate-spin' />
                              ) : (
                                <>
                                  <Icons.google className='size-4' />
                                  Sign up with Google
                                </>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection>
                    </div>
                    <p className='flex items-center gap-x-3 text-xs sm:text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border'>
                      or
                    </p>
                    <Clerk.Field
                      name='username'
                      className='space-y-2 text-black dark:text-white'
                    >
                      <Clerk.Label asChild>
                        <Label className='text-sm sm:text-base'>Username</Label>
                      </Clerk.Label>
                      <Clerk.Input
                        className='bg-white/50 dark:bg-transparent border-0 h-9 sm:h-10 px-2 text-sm'
                        type='text'
                        required
                        asChild
                        placeholder='Choose a unique username'
                      >
                        <Input className='py-1 sm:py-2' />
                      </Clerk.Input>
                      <Clerk.FieldError className='mt-2 block text-xs text-rose-400' />
                    </Clerk.Field>
                    <Clerk.Field
                      name='emailAddress'
                      className='space-y-2 text-black dark:text-white'
                    >
                      <Clerk.Label asChild>
                        <Label className='text-sm sm:text-base'>
                          Email address
                        </Label>
                      </Clerk.Label>
                      <Clerk.Input
                        className='bg-white/50 dark:bg-transparent border-0 h-9 sm:h-10 px-2 text-sm'
                        type='email'
                        required
                        asChild
                        placeholder='Enter your email address'
                      >
                        <Input className='py-1 sm:py-2' />
                      </Clerk.Input>
                      <Clerk.FieldError className='mt-2 block text-xs text-rose-400' />
                    </Clerk.Field>
                    <Clerk.Field
                      name='password'
                      className='space-y-2 text-black dark:text-white'
                    >
                      <Clerk.Label asChild>
                        <Label className='text-sm sm:text-base'>Password</Label>
                      </Clerk.Label>
                      <Clerk.Input
                        className='bg-white/50 dark:bg-transparent border-0 h-9 sm:h-10 px-2 text-sm'
                        type='password'
                        required
                        asChild
                        placeholder='Create a strong password'
                      >
                        <Input className='py-1 sm:py-2' />
                      </Clerk.Input>
                      <Clerk.FieldError className='mt-2 block text-xs text-rose-400' />
                    </Clerk.Field>
                    <Clerk.Field
                      name='passwordConfirm'
                      className='space-y-2 text-black dark:text-white'
                    >
                      <Clerk.Label asChild>
                        <Label className='text-sm sm:text-base'>
                          Confirm password
                        </Label>
                      </Clerk.Label>
                      <Clerk.Input
                        className='bg-white/50 dark:bg-transparent border-0 h-9 sm:h-10 px-2 text-sm'
                        type='password'
                        required
                        asChild
                        placeholder='Re-enter your password'
                      >
                        <Input className='py-1 sm:py-2' />
                      </Clerk.Input>
                      <Clerk.FieldError className='mt-2 block text-xs text-rose-400' />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className='grid w-full gap-y-3 sm:gap-y-4'>
                      <SignUp.Action submit asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className='text-sm sm:text-base py-4 sm:py-5'
                        >
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className='size-4 animate-spin' />
                              ) : (
                                "Sign Up"
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>

                      <Button
                        variant='link'
                        asChild
                        className='text-xs sm:text-sm'
                      >
                        <Clerk.Link navigate='sign-in'>
                          Already have an account? Sign in
                        </Clerk.Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>

              <SignUp.Step name='verifications' className='w-full sm:max-w-md'>
                <Card className='w-full bg-gradient-to-br from-slate-500/85 border-gray-100 border-2 to-slate-500/85 dark:from-slate-950/50 dark:to-slate-950/50'>
                  <CardHeader>
                    <CardTitle className='text-black dark:text-white py-2 text-xl sm:text-2xl'>
                      Verify your email
                    </CardTitle>
                    <CardDescription className='text-white/85 text-sm'>
                      We&asop;ve sent a verification code to your email
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='grid gap-y-3 sm:gap-y-4'>
                    <SignUp.Strategy name='email_code'>
                      <Clerk.Field
                        name='code'
                        className='space-y-2 text-black dark:text-white'
                      >
                        <Clerk.Label asChild>
                          <Label className='text-sm sm:text-base'>
                            Enter verification code
                          </Label>
                        </Clerk.Label>
                        <Clerk.Input
                          className='bg-white/50 border-0 h-9 sm:h-10 px-2 text-sm'
                          type='otp'
                          required
                          asChild
                        >
                          <Input className='py-1 sm:py-2' />
                        </Clerk.Input>
                        <Clerk.FieldError className='mt-2 block text-xs text-rose-400' />
                      </Clerk.Field>
                    </SignUp.Strategy>
                  </CardContent>
                  <CardFooter>
                    <div className='grid w-full gap-y-3 sm:gap-y-4'>
                      <SignUp.Action submit asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className='text-sm sm:text-base py-4 sm:py-5'
                        >
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className='size-4 animate-spin' />
                              ) : (
                                "Verify"
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>

                      <Button
                        variant='link'
                        asChild
                        className='text-xs sm:text-sm'
                      >
                        <Clerk.Link navigate='sign-in'>
                          Back to Sign in
                        </Clerk.Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>

              <SignUp.Step name='continue' className='w-full sm:max-w-md'>
                <Card className='w-full bg-gradient-to-br from-slate-500/85 border-gray-100 border-2 to-slate-500/85 dark:from-slate-950/50 dark:to-slate-950/50'>
                  <CardHeader>
                    <CardTitle className='text-black dark:text-white py-2 text-xl sm:text-2xl'>
                      Complete your profile
                    </CardTitle>
                    <CardDescription className='text-white/85 text-sm'>
                      Choose a username to complete your registration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='grid gap-y-3 sm:gap-y-4'>
                    <Clerk.Field
                      name='username'
                      className='space-y-2 text-black dark:text-white'
                    >
                      <Clerk.Label asChild>
                        <Label className='text-sm sm:text-base'>Username</Label>
                      </Clerk.Label>
                      <Clerk.Input
                        className='bg-white/50 border-0 h-9 sm:h-10 px-2 text-sm'
                        type='text'
                        required
                        asChild
                        placeholder='Choose a unique username'
                      >
                        <Input className='py-1 sm:py-2' />
                      </Clerk.Input>
                      <Clerk.FieldError className='mt-2 block text-xs text-rose-400' />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className='grid w-full gap-y-3 sm:gap-y-4'>
                      <SignUp.Action submit asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className='text-sm sm:text-base py-4 sm:py-5'
                        >
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className='size-4 animate-spin' />
                              ) : (
                                "Complete Sign Up"
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>

                      <Button
                        variant='link'
                        asChild
                        className='text-xs sm:text-sm'
                      >
                        <Clerk.Link navigate='sign-in'>
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
