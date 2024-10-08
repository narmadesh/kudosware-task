"use client"
import { FormEvent, useState } from "react";
import { useRouter } from 'next/navigation'
import { signIn, useSession } from "next-auth/react";
import Input from "@/components/input";
import Button from "@/components/button";
import Link from "next/link";
import toast from 'react-hot-toast';

export default function Signup() {
  const [state, setState] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === 'authenticated') {
    router.push('/education')
  }
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(true)
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const signup = await fetch('/api/signup', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const response = await signup.json();
    setState(false)
    if (response.id) {
      toast.success('Signed up successfully');
      toast.success('Logging you in');
      return await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      }).then((resp) => {
        console.log(resp)
        toast.success('Logged in successfully!')
        router.push('/education')
      }).catch(err => toast.error('Something went wrong'))
    }
    return toast.error(response.message);
  }
  return (
    <main className="bg-slate-200 min-h-screen flex flex-col justify-center items-center">
      <form onSubmit={submit} className="bg-white p-4 shadow rounded-lg flex flex-col space-y-4 sm:w-96 w-80">
        <Input name={"name"} label="Name" type="text" required />
        <Input name={"email"} label="Email" type="email" required />
        <Input name={"password"} label="Password" type="password" required />
        <Button type="submit" disabled={state}>{state ? "Processing" : "Signup"}</Button>
        <p>Already registered? Click <Link href='/login' className="text-blue-400">here</Link> to login</p>
      </form>
    </main>
  );
}
