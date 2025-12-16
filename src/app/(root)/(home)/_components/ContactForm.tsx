"use client";
import React, { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FaEnvelope, FaUser, FaPaperPlane } from "react-icons/fa";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email to the user
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Failed to send email");
        toast.error("Failed to send message. Please try again.");
      } else {
        toast.success(
          "Message sent successfully! We&apos;ll get back to you soon."
        );
        // Reset the form
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full" id="contact">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
          Get In Touch
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Have questions? We&apos;d love to hear from you!
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 rounded-xl bg-white dark:bg-gray-800/30 shadow-md"
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-primary/70" />
            <Input
              type="email"
              id="email"
              value={formData.email}
              required
              placeholder="Your email"
              className="pl-10 border-gray-300 dark:border-gray-600 focus:border-primary"
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
            />
          </div>

          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-primary/70" />
            <Input
              type="text"
              id="name"
              value={formData.name}
              placeholder="Your name"
              required
              className="pl-10 border-gray-300 dark:border-gray-600 focus:border-primary"
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
              }}
            />
          </div>
        </div>

        {/* Hidden inputs that still collect data if filled */}
        <div className="hidden">
          <Input
            type="text"
            id="company"
            value={formData.company}
            placeholder="Company"
            className="border-gray-300 dark:border-gray-600"
            onChange={(e) => {
              setFormData({ ...formData, company: e.target.value });
            }}
          />

          <Input
            type="text"
            id="phone"
            value={formData.phone}
            placeholder="Phone"
            className="border-gray-300 dark:border-gray-600"
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
            }}
          />
        </div>

        <Textarea
          name="message"
          id="message"
          value={formData.message}
          className="min-h-[100px] border-gray-300 dark:border-gray-600 focus:border-primary resize-none"
          placeholder="Your message..."
          required
          onChange={(e) => {
            setFormData({ ...formData, message: e.target.value });
          }}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition-all duration-300 w-full"
        >
          <FaPaperPlane className={`${isSubmitting ? "animate-pulse" : ""}`} />
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
