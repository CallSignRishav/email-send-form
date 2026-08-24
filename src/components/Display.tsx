"use client";

import { sendEmail } from "@/hooks/email";
import { formSchema } from "@/lib/schemas";
import { FormDataType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import { Spinner } from "./ui/spinner";

const Display = () => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      subject: "",
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
    <Card className="w-full max-w-[440px]">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle>Email Form</CardTitle>
        <CardDescription>Contact with me</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="form-rhf-display"
          onSubmit={form.handleSubmit(formSubmit)}>
          <FieldGroup>
            {/* FullName */}
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-display-fullName">
                    Full Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-display-fullName"
                    aria-invalid={fieldState.invalid}
                    placeholder="Full Name"
                    autoComplete="name"
                    disabled={form.formState.isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-display-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-display-email"
                    aria-invalid={fieldState.invalid}
                    type="email"
                    placeholder="demo@example.com"
                    autoComplete="email"
                    disabled={form.formState.isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Mobile */}
            <Controller
              name="mobile"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-display-mobile">
                    Mobile
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-display-mobile"
                    aria-invalid={fieldState.invalid}
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    autoComplete="tel"
                    disabled={form.formState.isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Subject */}
            <Controller
              name="subject"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-display-subject">
                    Subject
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-display-subject"
                    aria-invalid={fieldState.invalid}
                    placeholder="Subject"
                    autoComplete="off"
                    disabled={form.formState.isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Message */}
            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-display-message">
                    Message
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-display-message"
                      aria-invalid={fieldState.invalid}
                      placeholder="Write your message..."
                      rows={6}
                      className="min-h-24 resize-none"
                      disabled={form.formState.isSubmitting}
                    />

                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/2000 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          {/* Reset & Submit */}
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting}>
            Reset
          </Button>

          <Button
            type="submit"
            form="form-rhf-display"
            disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Spinner data-icon="inline-start" />
            )}
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default Display;
