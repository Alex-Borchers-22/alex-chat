'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isError, setIsError] = useState(false);

  function validateForm() {
    const errors: FormErrors = {};
    if (!name) errors.name = 'Name is required';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email';
    if (!message) errors.message = 'Message is required';
    return errors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSending(false);
      return;
    }

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name,
          email,
          message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      setNotificationMessage('Message sent successfully!');
      setIsError(false);
      setShowNotification(true);
      onOpenChange(false);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      setNotificationMessage('Failed to send message. Please try again.');
      setIsError(true);
      setShowNotification(true);
    } finally {
      setIsSending(false);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Get in touch</DialogTitle>
            <DialogDescription>
              Send me a message and I'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  formErrors.name ? 'border-red-500' : ''
                }`}
              />
              {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  formErrors.email ? 'border-red-500' : ''
                }`}
              />
              {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  formErrors.message ? 'border-red-500' : ''
                }`}
              />
              {formErrors.message && <p className="text-red-500 text-xs">{formErrors.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
      {showNotification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
            isError ? 'bg-red-500' : 'bg-green-500'
          } text-white`}
        >
          {notificationMessage}
        </div>
      )}
    </>
  );
} 