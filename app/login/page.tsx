"use client"
import { FormEvent, useState } from "react";
import { useRouter } from 'next/navigation'
import { signIn, useSession } from "next-auth/react";
import Input from "@/components/input";
import Button from "@/components/button";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Login() {
  const [state, setState] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession()
  if (status === 'authenticated') {
    router.push('/education')
  }
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(true)
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const response: any = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (!response?.error) {
        toast.success('Logged in successfully!')
        router.push('/education')
      }

      if (!response.ok) {
        toast.error(response.error);
      }
      setState(false)
    } catch (error: any) {
      toast.error("Login Failed:", error);
    }
  }
  return (
    <main className="bg-slate-200 min-h-screen flex flex-col justify-center items-center">
      <form onSubmit={submit} className="bg-white p-4 shadow rounded-lg flex flex-col space-y-4 sm:w-96 w-80">
        <Input name={"email"} label="Email" type="email" required />
        <Input name={"password"} label="Password" type="password" required />
        <Button type="submit" disabled={state}>{state ? "Processing" : "Login"}</Button>
        <p>Not registered? Click <Link href='/' className="text-blue-400">here</Link> to register</p>
      </form>
    </main>
  );
}
