"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReminderFormSchema } from "@/schema/reminderSchema";
import { submitReminder } from "@/server/actions/reminders/submitReminder";

interface ReminderFormProps {
  userId: string;
}

export default function ReminderForm({ userId }: ReminderFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof ReminderFormSchema>>({
    resolver: zodResolver(ReminderFormSchema),
    defaultValues: {
      title: "",
      description: "",
      datetime: new Date(),
      completed: false,
    },
  });

  const handleSubmit = async (formData: z.infer<typeof ReminderFormSchema>) => {
    try {
      await submitReminder(formData, userId);
      router.replace("/dashboard/reminders");
    } catch (e) {
      console.error(e);
    }
  };

  // Generate time options in 30-minute intervals
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return {
      value: `${hour.toString().padStart(2, "0")}:${minute}`,
      label: `${displayHour}:${minute} ${period}`,
    };
  });

  return (
    <Card className="max-w-2xl mx-auto p-4 text-black">
      <CardHeader>
        <CardTitle className="text-xl text-center">New Reminder</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-32 resize-none"
                      placeholder="Enter a description (optional)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="datetime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-lg font-semibold">
                      Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${
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
                          onSelect={(date) => {
                            if (date) {
                              const currentTime = field.value || new Date();
                              date.setHours(
                                currentTime.getHours(),
                                currentTime.getMinutes(),
                                0,
                                0
                              );
                              field.onChange(date);
                            }
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const calendarDate = new Date(date);
                            calendarDate.setHours(0, 0, 0, 0);
                            return calendarDate < today;
                          }}
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
                name="datetime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-lg font-semibold">
                      Time
                    </FormLabel>
                    <Select
                      onValueChange={(time) => {
                        const [hours, minutes] = time.split(":").map(Number);
                        const date = field.value || new Date();
                        date.setHours(hours);
                        date.setMinutes(minutes);
                        field.onChange(date);
                      }}
                      value={
                        field.value
                          ? format(new Date(field.value), "HH:mm")
                          : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                          <SelectValue placeholder="Select time">
                            {field.value ? (
                              format(new Date(field.value), "h:mm a")
                            ) : (
                              <span className="text-muted-foreground">
                                Select time
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Create Reminder
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
