"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  CreditCard,
  MapPin,
  Plus,
  Trash2,
  Upload,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const categoriesList = [
  "Code Master",
  "Cooking",
  "Debating",
  "MUN",
  "Entrepreneurship",
  "Fine Arts",
  "Gaming Den",
  "Law Moot",
  "Life Sciences",
  "Literature",
  "Marketing",
  "Mech Tech",
  "Robotics",
  "Music Mania",
  "Screen Duels",
  "Hamd-O-Sanaa",
  "Performing Arts",
  "Photomania: Capture for a Cause",
  "Sports",
  "Survivor's Arena",
  "Structify",
  "Trash for Treasure",
];

const phoneRegex = /^\+92[0-9]{10}$/;
const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;

const formSchema = z.object({
  institutionName: z.string().min(2, "Institution name is required"),
  headDelegate: z.object({
    fullName: z.string().min(2, "Full name is required"),
    cnic: z
      .string()
      .regex(cnicRegex, "Invalid CNIC format (e.g., 12345-1234567-1)"),
    contactNumber: z
      .string()
      .regex(phoneRegex, "Invalid phone format (e.g., +923001234567)"),
  }),
  participants: z
    .array(
      z.object({
        fullName: z.string().min(2, "Full name is required"),
        cnic: z.string().regex(cnicRegex, "Invalid CNIC format"),
        contactNumber: z.string().regex(phoneRegex, "Invalid phone format"),
        instituteId: z.string().min(1, "ID Card detail is required"),
      }),
    )
    .min(1, "At least one participant is required"),
  selectedCategories: z
    .array(z.string())
    .min(1, "Select at least one category"),
  paymentMethod: z.enum(["bank_transfer", "bank_draft"]),
  paymentProof: z.any().optional(), // File validation is tricky client-side without upload logic
  agreements: z.object({
    rules: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the rules" }),
    }),
    idCard: z.literal(true, {
      errorMap: () => ({ message: "You must confirm ID card possession" }),
    }),
  }),
});

export default function RegisterPage() {
  const [fee, setFee] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institutionName: "",
      headDelegate: {
        fullName: "",
        cnic: "",
        contactNumber: "",
      },
      participants: [
        {
          fullName: "",
          cnic: "",
          contactNumber: "",
          instituteId: "",
        },
      ],
      selectedCategories: [],
      paymentMethod: "bank_transfer",
      agreements: {
        rules: undefined,
        idCard: undefined,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const watchedCategories = form.watch("selectedCategories");
  const watchedParticipants = form.watch("participants");

  useEffect(() => {
    const participantCount = watchedParticipants.length;
    const categoryCount = watchedCategories.length;
    // Fee logic: 3500 per category per participant
    // Note: The prompt says "Early Bird Rs 1500-2500 per person per category, Late Rs 3500; but since the event is ongoing, assume late fee".
    // It also mentions "registering for more than 9 categories qualifies for the Team Trophy".
    // Keep it simple as per implementation plan: 3500 * categories * participants
    // Or just 3500 * categories (team fee) if that's the interpretation?
    // "Rs 1500-2500 per person per category" implies multiplication by participants.
    setFee(3500 * categoryCount * participantCount);
  }, [watchedCategories, watchedParticipants]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, upload file to storage, then POST data to API
    toast.success("Registration Submitted Successfully!", {
      description:
        "We have received your application. Check your email for confirmation.",
    });
    form.reset();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl font-walsheim">
            TAAKRA 2026 Registration
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            11th to 15th February 2026 • University of Central Punjab
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 py-2 px-4 rounded-full w-fit mx-auto">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Registration Open - Late Fee Applies
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Institution Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Institution Information
                </CardTitle>
                <CardDescription>
                  Enter the details of your educational institution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Institution Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="University of Central Punjab"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Head Delegate Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Head Delegate Details
                </CardTitle>
                <CardDescription>
                  Primary contact person for the team.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="headDelegate.fullName"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>
                        Full Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headDelegate.cnic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        CNIC Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="35202-1234567-1" {...field} />
                      </FormControl>
                      <FormDescription>Format: XXXXX-XXXXXXX-X</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headDelegate.contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Contact Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+923001234567" {...field} />
                      </FormControl>
                      <FormDescription>Format: +92XXXXXXXXXX</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Participant Details
                    </CardTitle>
                    <CardDescription>
                      Add details for all team members.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        fullName: "",
                        cnic: "",
                        contactNumber: "",
                        instituteId: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Participant
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative p-6 border rounded-lg bg-slate-50/50"
                  >
                    <div className="absolute top-4 right-4 bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded">
                      Member {index + 1}
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-12 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label>
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <FormField
                          control={form.control}
                          name={`participants.${index}.fullName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Jane Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          CNIC Number <span className="text-red-500">*</span>
                        </Label>
                        <FormField
                          control={form.control}
                          name={`participants.${index}.cnic`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="35202-1234567-1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Contact Number <span className="text-red-500">*</span>
                        </Label>
                        <FormField
                          control={form.control}
                          name={`participants.${index}.contactNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="+923001234567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label>
                          Institute ID Details{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <FormField
                          control={form.control}
                          name={`participants.${index}.instituteId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Roll Number / Registration ID"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Categories & Competitions
                </CardTitle>
                <CardDescription>
                  Select the competitions you wish to participate in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="selectedCategories"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoriesList.map((category) => (
                          <FormField
                            key={category}
                            control={form.control}
                            name="selectedCategories"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={category}
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 rounded-md border hover:bg-slate-50 transition-colors"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(category)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              category,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== category,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer w-full">
                                    {category}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4 p-4 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-start gap-2">
                  <span className="font-bold">Note:</span> Registering for more
                  than 9 categories qualifies you for the Team Trophy!
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Review your total fee and upload proof of payment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col items-center justify-center space-y-2">
                  <span className="text-slate-300 uppercase tracking-widest text-xs font-semibold">
                    Total Registration Fee
                  </span>
                  <span className="text-4xl font-bold">
                    PKR {fee.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-400">
                    {watchedParticipants.length} Participants ×{" "}
                    {watchedCategories.length} Categories × PKR 3,500
                  </span>
                </div>

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Payment Method <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="bank_transfer" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Bank Transfer
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="bank_draft" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Bank Draft
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="proof">
                    Upload Payment Proof <span className="text-red-500">*</span>
                  </Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-600 font-medium">
                      Click to upload image or PDF
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Max file size: 5MB
                    </span>
                    <Input
                      id="proof"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={() => {
                        // Handle file change if needed for preview
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agreements */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="agreements.rules"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 bg-white">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to all rules and regulations (No refunds, strict
                        discipline, etc.)
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agreements.idCard"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 bg-white">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I confirm that all team members carry valid Student
                        ID/CNIC.
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold text-lg h-12 bg-blue-600 hover:bg-blue-700"
            >
              Submit Registration
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
