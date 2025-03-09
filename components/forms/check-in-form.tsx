"use client";

import { useEffect, useMemo, useState } from "react";
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
import { updateCheckIn } from "@/server/actions/checkIns/updateCheckIn";
import { getTodaysCheckIn } from "@/server/actions/checkIns/getTodaysCheckIn";

export function DailyCheckInForm({
  userId,
  update = false,
}: {
  userId: string;
  update: boolean;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultFormValues, setDefaultFormValues] =
    useState<CheckInFormDataType | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    return date;
  }, []);

  useEffect(() => {
    if (update) {
      const fetchCheckIn = async () => {
        const todayCheckIn = await getTodaysCheckIn(userId);
        if (todayCheckIn) {
          const checkInData = {
            ...todayCheckIn,
            date: new Date(todayCheckIn.date),
          };
          setDefaultFormValues(checkInData);
        }
      };
      fetchCheckIn();
    } else {
      setDefaultFormValues({
        date: new Date(),
        mood: 3,
        energy: 3,
        sleepHours: 3,
        sleepQuality: 3,
        stress: 3,
        notes: "",
      });
    }
  }, [update, userId]);

  const form = useForm<CheckInFormDataType>({
    resolver: zodResolver(CheckInFormSchema),
    defaultValues: defaultFormValues || {
      date: new Date(),
      mood: 3,
      energy: 3,
      sleepHours: 3,
      sleepQuality: 3,
      stress: 3,
      notes: "",
    },
    resetOptions: {
      keepDirtyValues: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepValues: false,
    },
  });

  useEffect(() => {
    if (defaultFormValues) {
      form.reset(defaultFormValues);
    }
  }, [defaultFormValues, form]);

  async function onSubmit(formData: CheckInFormDataType) {
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        date:
          formData.date instanceof Date
            ? formData.date
            : new Date(formData.date),
      };

      const result = update
        ? await updateCheckIn(submissionData, userId)
        : await submitCheckIn(submissionData, userId);

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
          description:
            String(result.error) ||
            "There was a problem submitting your check-in.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting check-in:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleNotesValue = (value: string | null | undefined) => {
    return value === null ? "" : value;
  };

  return (
    <Card
      className="p-4 md:p-8 w-64 md:w-[640px] flex justify-center items-center"
      style={{ backgroundColor: "white", color: "black" }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Date field - readonly display */}
          <FormField
            control={form.control}
            name="date"
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-[240px] pl-3 text-left font-normal"
                      >
                        {format(today, "PPP")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={today}
                      // This is a read-only date display so we don't need an onSelect
                      onSelect={() => {}}
                      // This makes sure only today is selectable (though the UI prevents selection)
                      disabled={(date) => {
                        const current = new Date();
                        current.setHours(0, 0, 0, 0);
                        return date.getTime() !== current.getTime();
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Today&apos;s date is automatically selected
                </FormDescription>
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
                    key={field.value}
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
                    key={field.value}
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
                    key={field.value}
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
                  defaultValue={
                    field.value !== undefined ? field.value.toString() : ""
                  } // Ensure defaultValue is updated
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sleep hours" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 25 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString()}
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
                    key={field.value}
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isSubmitting ? "Submitting..." : "Submit Check-in"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
