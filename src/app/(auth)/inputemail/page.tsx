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

const inputEmailSchema = z.object({
  email: z.string().email(),
});

export default function InputEmail() {
  const form = useForm<z.infer<typeof inputEmailSchema>>({
    resolver: zodResolver(inputEmailSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof inputEmailSchema>) => {
    const response = await axios.post("/api/forgetPassword", data);
    if (response.status === 200) {
      router.replace(`/verify?email=${data.email}`);
    } else {
      throw new Error("Failed to ");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Forget Password
          </h1>
          <p className="mb-4">Please Input Your Register Email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
