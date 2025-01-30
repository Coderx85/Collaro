"use client"
import React, {useState} from 'react'
import { Form } from './ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

type FormType = "sign-in" | "sign-up"

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName: formType === "sign-up" ? z.string().min(2).max(50) : z.string().optional(),
    password: z.string().min(8).max(50),
  });
};

const AuthForm = ({type}: {type: FormType}) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [accountId, setAccountId] = useState(null);
  
  
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // const user = type === "sign-up" ? createAc      
    } catch (error: any) {
      setErrorMessage(error.message); 
      
    }
  }
  return (
    < >
        <Form {...form}>
          <form 
            className="flex flex-col space-y-4 justify-center h-screen-min w-4/5" 
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h1 className="text-4xl font-bold text-white text-center">
              {type === "sign-up" ? "Sign Up" : "Log In"}
            </h1>

            {/* Input field */}

            {type === "sign-up" && (
              <Input 
                variant={"outline"}
                type="text"
                required
                placeholder='Full Name'
                {...form.register("fullName")}
              />
            )
              }
            
            <Input 
              variant={"outline"}
              type="email"
              required
              placeholder='Email'
              {...form.register("email")}
            />

            <Input
              variant={"outline"}
              type="password"
              required
              placeholder='Password'
            />

            {type === "sign-up" && (
              <Input
                variant={"outline"}
                type="password"
                required
                placeholder='Confirm Password'
              />
              )
            }


            <Button 
              type="submit" 
              className="primary"
              disabled={isLoading}
              >
              {type === "sign-up" ? "Sign Up" : "Log In"}
              {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
                />
              )}
            </Button>
            
            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}

            <p className="text-white text-center">
              {type === "sign-up" ? "Already have an account? " : "Don't have an account? "}
              <Link href={type === "sign-up" ? "/sign-in" : "/sign-up"} className="text-primary underline"> 
                {type === "sign-up" ? "Log In" : "Sign Up"}
              </Link>
            </p>

          </form>
        </Form>
    </>
  )
}

export default AuthForm