"use client";

import { sendEmail } from "@/hooks/email";
import { formSchema } from "@/lib/schemas";
import { FormDataType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const Display = () => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),

    mode: "all",

    defaultValues: {
      email: "",
      message: "",
    },
  });

  const formSubmit = async (fData: FormDataType) => {
    const { success, message } = await sendEmail(fData);

    if (!success) {
      toast.error(message);
    }

    if (success) {
      toast.success(message);

      form.reset();
    }
  };

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle>Email Form</CardTitle>

          <CardDescription>Contact with me</CardDescription>
        </CardHeader>

        <CardContent className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(formSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@example.com"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write here..."
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default Display;
