"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { submitJournalEntry } from "@/server/actions/submitJournalEntry";
import { JournalEntryFormType } from "@/schema/journalEntrySchema";
import { useRouter } from "next/navigation";
import { UserType } from "@/schema/userSchema";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  date: z.date(),
  content: z.string().min(1, { message: "Content is required" }),
});

export function JournalPageForm({ user }: { user: UserType }) {
  const [showAlert, setShowAlert] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      content: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (formData: JournalEntryFormType) => {
    try {
      const res = await submitJournalEntry(formData, user);
      if (res.success === true) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          router.replace("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      {showAlert && (
        <Alert>
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your journal entry has been saved.
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-md"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg md:text-xl font-semibold">
                  Title
                </FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-lg md:text-xl font-semibold">
                  Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl className="text-black">
                      <Button
                        variant={"outline"}
                        className={`w-[240px] pl-3 text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg md:text-xl font-semibold">
                  Content
                </FormLabel>
                <FormControl>
                  <Textarea className="h-96" placeholder="Content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-white text-black hover:text-white"
          >
            Save Entry
          </Button>
        </form>
      </Form>
    </>
  );
}
