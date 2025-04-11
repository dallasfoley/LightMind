"use client";

import React from "react";

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
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { useCheckIn } from "@/contexts/check-in-provider";

// Custom ColoredSlider component
const ColoredSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    color: string;
  }
>(({ className, color, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200">
      <SliderPrimitive.Range className={`absolute h-full ${color}`} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-indigo-600 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-indigo-400 dark:bg-white dark:ring-offset-slate-950 dark:focus-visible:ring-indigo-400" />
  </SliderPrimitive.Root>
));
ColoredSlider.displayName = "ColoredSlider";

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
  const { refreshCheckIn } = useCheckIn();
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
      const timezoneOffset = new Date().getTimezoneOffset();
      const submissionData = {
        ...formData,
        date:
          formData.date instanceof Date
            ? formData.date
            : new Date(formData.date),
        timezoneOffset,
      };

      const result = update
        ? await updateCheckIn(submissionData, userId)
        : await submitCheckIn(submissionData, userId);

      if (result.success) {
        await refreshCheckIn();
        toast({
          title: "Check-in submitted",
          description: "Your daily check-in has been recorded.",
        });
        router.replace("/dashboard");
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

  // Helper function to get color based on value
  const getSliderColor = (value: number, fieldName: string) => {
    // For stress, higher is worse
    if (fieldName === "stress") {
      if (value <= 2) return "bg-green-500";
      if (value <= 3) return "bg-yellow-500";
      return "bg-red-500";
    }

    // For other fields, higher is better
    if (value <= 2) return "bg-red-500";
    if (value <= 3) return "bg-yellow-500";
    if (value <= 4) return "bg-green-700";
    return "bg-green-500";
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
                <FormLabel style={{ color: "black" }}>Date</FormLabel>
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
                <FormDescription style={{ color: "#4b5563" }}>
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
                  <FormLabel style={{ color: "black" }}>Mood</FormLabel>
                  <FormLabel style={{ color: "black" }}>
                    {field.value}
                  </FormLabel>
                </div>
                <FormControl>
                  <ColoredSlider
                    min={1}
                    max={5}
                    step={1}
                    value={[field.value]}
                    color={getSliderColor(field.value, "mood")}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormDescription style={{ color: "#4b5563" }}>
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
                  <FormLabel style={{ color: "black" }}>Energy Level</FormLabel>
                  <FormLabel style={{ color: "black" }}>
                    {field.value}
                  </FormLabel>
                </div>
                <FormControl>
                  <ColoredSlider
                    min={1}
                    max={5}
                    step={1}
                    value={[field.value]}
                    color={getSliderColor(field.value, "energy")}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormDescription style={{ color: "#4b5563" }}>
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
                  <FormLabel style={{ color: "black" }}>
                    Sleep Quality
                  </FormLabel>
                  <FormLabel style={{ color: "black" }}>
                    {field.value}
                  </FormLabel>
                </div>
                <FormControl>
                  <ColoredSlider
                    min={1}
                    max={5}
                    step={1}
                    value={[field.value]}
                    color={getSliderColor(field.value, "sleepQuality")}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormDescription style={{ color: "#4b5563" }}>
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
                <FormLabel style={{ color: "black" }}>Hours of Sleep</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(Number.parseInt(value, 10))
                  }
                  value={
                    field.value !== undefined ? field.value.toString() : ""
                  }
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
                <FormDescription style={{ color: "#4b5563" }}>
                  How many hours did you sleep?
                </FormDescription>
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
                  <FormLabel style={{ color: "black" }}>Stress</FormLabel>
                  <FormLabel style={{ color: "black" }}>
                    {field.value}
                  </FormLabel>
                </div>
                <FormControl>
                  <ColoredSlider
                    min={1}
                    max={5}
                    step={1}
                    value={[field.value]}
                    color={getSliderColor(field.value, "stress")}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormDescription style={{ color: "#4b5563" }}>
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
                <FormLabel style={{ color: "black" }}>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional thoughts or reflections for the day?"
                    className="resize-none"
                    {...field}
                    value={handleNotesValue(field.value)}
                  />
                </FormControl>
                <FormDescription style={{ color: "#4b5563" }}>
                  Optional: Add any notes or reflections (max 500 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            style={{ backgroundColor: "#4f46e5", color: "white" }}
          >
            {isSubmitting ? "Submitting..." : "Submit Check-in"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
