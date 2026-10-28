"use client"

import type React from "react"

import { useState } from "react"
import EmailPopup from "@/components/email-popup"
import { Send, Mail, MapPin, Github, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Message Sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    })

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
    setIsSubmitting(false)
  }

  return (
    <main className="pt-20 min-h-screen">
      {/* Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            I am open to full-time, contract and freelance opportunities, remote or hybrid, based in Accra, Ghana. Recruiters and teams are welcome to reach out by email.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-4 bg-white dark:bg-slate-900">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can I help you?"
                    required
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    rows={5}
                    required
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      Send Message <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                Contact Information
              </h2>
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl mb-8 border border-slate-100 dark:border-slate-700">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-slate-700 dark:text-slate-300 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Email</h3>
                      <a
                        href="mailto:frimpongboatengbenedict@gmail.com"
                        className="break-words [overflow-wrap:anywhere] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                      >
                        frimpongboatengbenedict@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-slate-700 dark:text-slate-300 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Location</h3>
                      <p className="text-slate-700 dark:text-slate-300">Weja, Accra, Ghana</p>
                    </div>
                  </div>

                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Connect With Me</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <a
                  href="https://github.com/Davinchigh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Github className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/benedict-frimpong-boateng-552490249/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Linkedin className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">LinkedIn</span>
                </a>
                <button
                  onClick={() => setIsEmailPopupOpen(true)}
                  className="flex items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 w-full text-left"
                >
                  <Mail className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Email</span>
                </button>
                <a
                  href="https://x.com/DavinchiMax"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Twitter className="h-6 w-6 mr-3 text-slate-700 dark:text-slate-300" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Twitter</span>
                </a>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800">
                <h3 className="text-xl font-semibold mb-3">Looking for Collaboration?</h3>
                <p className="mb-4">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your
                  vision.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white hover:text-slate-900"
                >
                  <a href="mailto:frimpongboatengbenedict@gmail.com?subject=Collaboration%20Opportunity">
                    Let's Collaborate
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map or Additional Info */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800">
        <div className="container max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 max-w-md mx-auto">
            Response Time
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4 max-w-2xl mx-auto">
            I typically respond to messages within 24-48 hours. For urgent matters, please indicate so in your message
            subject.
          </p>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md mx-auto border border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Office Hours</h3>
            <p className="text-slate-700 dark:text-slate-300">Monday - Friday: 9:00 AM - 5:00 PM (GMT)</p>
          </div>
        </div>
      </section>
      <EmailPopup
        email="frimpongboatengbenedict@gmail.com"
        isOpen={isEmailPopupOpen}
        onClose={() => setIsEmailPopupOpen(false)}
      />
    </main>
  )
}
