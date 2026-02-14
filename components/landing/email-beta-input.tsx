"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function EmailBetaInput() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Thanks for joining the waitlist!");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md gap-2">
      <Input
        type="email"
        placeholder="Enter your university email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-full bg-white/50 border-slate-200"
        required
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Join Waitlist"
        )}
      </Button>
    </form>
  );
}
