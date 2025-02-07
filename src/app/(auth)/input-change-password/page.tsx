"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const forgetcodeSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function ForgetPassword() {
  const router = useRouter();

  const params = new window.URLSearchParams(window.location.search);
  const email = params.get("email");

  const form = useForm<z.infer<typeof forgetcodeSchema>>({
    resolver: zodResolver(forgetcodeSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgetcodeSchema>) => {
    const response = await axios.post(
      `/api/changePassword?email=${email}`,
      data
    );
    if (response.status === 200) {
      router.replace("/sign-in");
    } else {
      throw new Error("Failed to change Password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Update Your Password
          </h1>
          <p className="mb-4">Input Password to Update</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Forget Password" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
