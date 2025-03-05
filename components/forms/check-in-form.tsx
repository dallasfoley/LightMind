"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  type CheckInFormDataType,
  CheckInFormSchema,
} from "@/schema/checkInSchema";
import { submitCheckIn } from "@/server/actions/checkIns/submitCheckIn";
import { Card } from "../ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export function DailyCheckInForm({ userId }: { userId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CheckInFormDataType>({
    resolver: zodResolver(CheckInFormSchema),
    defaultValues: {
      date: new Date(),
      mood: 3,
      energy: 3,
      sleepHours: 3,
      sleepQuality: 3,
      stress: 3,
      notes: "",
    },
  });

  async function onSubmit(formData: CheckInFormDataType) {
    setIsSubmitting(true);
    const result = await submitCheckIn(formData, userId);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Check-in submitted",
        description: "Your daily check-in has been recorded.",
      });
      router.replace("/dashboard");
      form.reset();
    } else {
      toast({
        title: "Error",
        description: "There was a problem submitting your check-in.",
        variant: "destructive",
      });
    }
  }

  const handleNotesValue = (value: string | null | undefined) => {
    return value === null ? "" : value;
  };

  return (
    <Card className="p-4 md:p-8 w-64 md:w-[640px] text-black flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Date field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
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
          {/* Mood field */}
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Mood</FormLabel>
                  <FormLabel>{[field.value]}</FormLabel>
                </div>
                <FormControl>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormDescription>
                  Rate your mood from 1 (lowest) to 5 (highest)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Energy field */}
          <FormField
            control={form.control}
            name="energy"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Energy Level</FormLabel>
                  <FormLabel>{[field.value]}</FormLabel>
                </div>
                <FormControl>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormDescription>
                  Rate your energy level from 1 (lowest) to 5 (highest)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Sleep Quality field */}
          <FormField
            control={form.control}
            name="sleepQuality"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Sleep Quality</FormLabel>
                  <FormLabel>{[field.value]}</FormLabel>
                </div>
                <FormControl>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormDescription>
                  Rate your sleep quality from 1 (poorest) to 5 (best)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Sleep Hours field */}
          <FormField
            control={form.control}
            name="sleepHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours of Sleep</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(Number.parseInt(value, 10))
                  }
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sleep hours" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 25 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>How many hours did you sleep?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Stress field */}
          <FormField
            control={form.control}
            name="stress"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Stress</FormLabel>
                  <FormLabel>{[field.value]}</FormLabel>
                </div>
                <FormControl>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormDescription>
                  Rate your stress level from 1 (lowest) to 5 (highest)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Notes field */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional thoughts or reflections for the day?"
                    className="resize-none"
                    {...field}
                    value={handleNotesValue(field.value)}
                  />
                </FormControl>
                <FormDescription>
                  Optional: Add any notes or reflections (max 500 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Check-in"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
