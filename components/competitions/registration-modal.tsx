"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { competitionApi } from "@/lib/competition-api";
import { Loader2, Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  teamName: z.string().optional(),
  memberNames: z
    .array(z.string().min(2, "Name must be at least 2 characters"))
    .min(1, "At least one member is required"),
});

interface RegistrationModalProps {
  competitionId: string;
  competitionTitle: string;
  onSuccess?: () => void;
}

export function RegistrationModal({
  competitionId,
  competitionTitle,
  onSuccess,
}: RegistrationModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      memberNames: [""],
    },
  });

  const { fields, append, remove } = {
    fields: form.watch("memberNames"),
    append: (value: string) => {
      const current = form.getValues("memberNames");
      form.setValue("memberNames", [...current, value]);
    },
    remove: (index: number) => {
      const current = form.getValues("memberNames");
      if (current.length > 1) {
        form.setValue(
          "memberNames",
          current.filter((_, i) => i !== index),
        );
      }
    },
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await competitionApi.registerToCompetition(competitionId, values);
      toast.success("Registration submitted successfully!");
      setOpen(false);
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to submit registration",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          Register Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register for {competitionTitle}</DialogTitle>
          <DialogDescription>
            Enter your team details and member names to participate.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Code Warriors" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Member Names</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append("")}
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Member
                </Button>
              </div>

              {form.watch("memberNames").map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`memberNames.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder={`Member ${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        {form.watch("memberNames").length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Registration
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
