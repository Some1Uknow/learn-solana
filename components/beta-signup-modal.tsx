"use client";

import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Add countries data
const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Japan",
  "China",
  "India",
  "Brazil",
  "Mexico",
  "South Africa",
  "Nigeria",
  "Russia",
  "South Korea",
  "Singapore",
  "New Zealand",
  "Ireland",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
].sort();

interface BetaSignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BetaSignupModal({ open, onOpenChange }: BetaSignupModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      country: formData.get("country"),
    };

    try {
      const res = await fetch("/api/beta-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.status === 409) {
        toast({
          title: "Already Registered",
          description:
            "This email is already registered for the beta waitlist.",
          variant: "default",
        });
        onOpenChange(false);
      } else if (!res.ok) {
        throw new Error(result.error || "Failed to register");
      } else {
        toast({
          title: "Success! 🎉",
          description:
            "You've been successfully added to the beta waitlist. We'll notify you when access is available.",
          variant: "default",
        });
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem registering for the beta. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Join the Beta
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign up to get early access to learn.sol
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                id="firstName"
                name="firstName"
                placeholder="First name"
                required
                className="bg-white/10 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                required
                className="bg-white/10 border-white/10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              className="bg-white/10 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Select name="country" required>
              <SelectTrigger className="bg-white/10 border-white/10">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-linear-to-r from-[#14F195] to-[#9945FF] hover:opacity-90 text-black w-full"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
