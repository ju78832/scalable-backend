"use client";
import React, { useCallback, useEffect, useState } from "react";
import { ColourfulText } from "@/components/ui/colourful-text";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { date, z } from "zod";
import { Chat } from "@prisma/client";

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

import axios from "axios";

export const formSchema = z.object({
  inputMessage: z.string().max(30),
});

export default function ChatBoard() {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputMessage: "",
    },
  });

  useEffect(() => {
    const fetchMessage = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/chat-message");
        setMessages(response.data.message);
        console.log(messages);
      } catch (error) {
        throw new Error("Unable to fetch message");
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/chat-message", data);
      setMessages(response.data);
    } catch (error) {
      throw new Error("Unable to fetch message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black ">
      <div>
        <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
          The best <ColourfulText text="chat bot " /> <br /> you have
        </h1>
      </div>

      <div className="space-y-6 my-6 min-w-64">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {messages.length > 0 ? (
              messages.map((message: Chat) => (
                <p key={message.id}>{message.content}</p>
              ))
            ) : (
              <p>No messages yet</p>
            )}
          </CardContent>

          <div className="mb-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="inputMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter your queries</FormLabel>
                      <FormControl>
                        <Input placeholder="Ask your question" {...field} />
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
        </Card>
      </div>
    </div>
  );
}
