"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { submitJournalEntry } from "@/server/actions/journals/submitJournalEntry";
import {
  JournalEntryFormSchema,
  type JournalEntryFormType,
} from "@/schema/journalEntrySchema";
import { useRouter } from "next/navigation";
import type { UserType } from "@/schema/userSchema";
import { getJournalDates } from "@/server/actions/journals/getJournalDates";

export function JournalPageForm({ user }: { user: UserType }) {
  const [showAlert, setShowAlert] = useState(false);
  const [existingDates, setExistingDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(JournalEntryFormSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      content: "",
    },
  });

  useEffect(() => {
    const fetchDates = async () => {
      setIsLoading(true);
      try {
        const dates = user ? await getJournalDates(user.id) : [];
        setExistingDates(dates.map((date) => new Date(date.date)));
      } catch (error) {
        console.error("Error fetching journal dates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDates();
  }, [user]);

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

  const hasExistingEntry = (date: Date) => {
    return existingDates.some((existingDate) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const existingDateStr = format(existingDate, "yyyy-MM-dd");
      return dateStr === existingDateStr;
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (hasExistingEntry(date)) {
      const formattedDate = format(date, "yyyy-MM-dd");
      console.log(
        `Navigating to existing entry: /dashboard/journal/${formattedDate}`
      );
      router.push(`/dashboard/journal/${formattedDate}`);
    } else {
      form.setValue("date", date);
    }
  };

  const renderDateCell = (day: Date) => {
    const hasEntry = hasExistingEntry(day);
    return (
      <div
        className={`w-full h-full flex items-center justify-center rounded-full ${
          hasEntry
            ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-bold"
            : ""
        }`}
      >
        {day.getDate()}
      </div>
    );
  };

  return (
    <>
      {showAlert && (
        <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2 text-green-600 dark:text-green-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <AlertTitle className="font-bold text-green-800 dark:text-green-300">
              Success!
            </AlertTitle>
          </div>
          <AlertDescription className="text-green-700 dark:text-green-300">
            Your journal entry has been saved.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full text-black"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-slate-700 dark:text-slate-300 block">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Give your entry a title..."
                      className="border-slate-300 dark:border-slate-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-lg font-medium text-slate-700 dark:text-slate-300 block">
                    Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-full border-slate-300 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 p-3 text-left flex items-center justify-between"
                        >
                          {field.value ? (
                            format(field.value, "MMMM d, yyyy")
                          ) : (
                            <span>Select a date</span>
                          )}
                          <CalendarIcon className="h-5 w-5 opacity-70" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border-slate-200 dark:border-slate-700 shadow-lg"
                      align="start"
                    >
                      {isLoading ? (
                        <div className="p-6 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto mb-2"></div>
                          <p>Loading calendar...</p>
                        </div>
                      ) : (
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={handleDateSelect}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          components={{
                            DayContent: ({ date }) => renderDateCell(date),
                          }}
                          initialFocus
                          className="rounded-md border-slate-200 dark:border-slate-700 p-3"
                        />
                      )}
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-500 dark:text-red-400 text-sm mt-1" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Your Journal Entry
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-64 border-slate-300 dark:border-slate-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 p-4 text-base leading-relaxed resize-y"
                    placeholder="Write your thoughts, reflections and memories here..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400 text-sm mt-1" />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Journal Entry
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
