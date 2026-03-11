import { useState, useRef, useEffect } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

// ─── EmailJS config ───────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = "service_dy1ox55";
const EMAILJS_AUTOREPLY_TEMPLATE_ID = "template_ezlndpk";
const EMAILJS_NOTIFICATION_TEMPLATE_ID = "template_ngzuedj";
const EMAILJS_PUBLIC_KEY = "Q7PFNTG5vIi8dsX8_";

// ─── Spam protection helpers ──────────────────────────────────────────────────

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "idle" | "sending" | "success" | "error";

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string;
  captcha: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const loadedAt = useRef(Date.now());
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
    captcha: "",
  });

  // Refresh captcha on mount
  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const set =
    (key: keyof FormFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): string | null => {
    // Honeypot
    if (fields.honeypot) return "Spam detected.";
    // Time gate — must take at least 3 seconds
    if (Date.now() - loadedAt.current < 3000)
      return "Please take a moment to fill out the form.";
    // Basic field checks
    if (!fields.name.trim()) return "Please enter your name.";
    if (
      !fields.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)
    )
      return "Please enter a valid email address.";
    if (!fields.subject.trim()) return "Please enter a subject.";
    if (fields.message.trim().length < 10)
      return "Message must be at least 10 characters.";
    // Captcha
    if (parseInt(fields.captcha) !== captcha.answer)
      return `Incorrect answer. ${captcha.a} + ${captcha.b} = ?`;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      await Promise.all([
        // Auto-reply to the person who submitted
        emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_AUTOREPLY_TEMPLATE_ID,
          {
            name: fields.name,
            title: fields.subject,
            email: fields.email,
          },
          EMAILJS_PUBLIC_KEY,
        ),
        // Notification to your inbox
        emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_NOTIFICATION_TEMPLATE_ID,
          {
            name: fields.name,
            email: fields.email,
            title: fields.subject,
            message: fields.message,
          },
          EMAILJS_PUBLIC_KEY,
        ),
      ]);

      setStatus("success");
      setFields({
        name: "",
        email: "",
        subject: "",
        message: "",
        honeypot: "",
        captcha: "",
      });
      setCaptcha(generateCaptcha());
    } catch {
      setStatus("error");
      setErrorMsg(
        "Something went wrong. Please try again or email us directly.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-gray-900 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Get in Touch
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Contact <span className="text-yellow-500">Us</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Have a question or want to get involved? We'd love to hear from you.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full max-w-lg p-8">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CheckCircle size={48} className="text-yellow-500" />
              <h2 className="text-xl font-extrabold text-gray-900">
                Message Sent!
              </h2>
              <p className="text-gray-500 text-sm">
                Thanks for reaching out. We'll get back to you as soon as
                possible.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-2 text-sm font-semibold text-gray-600 underline hover:text-gray-900"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
            >
              {/* Honeypot — hidden from real users */}
              <input
                type="text"
                name="website"
                value={fields.honeypot}
                onChange={set("honeypot")}
                tabIndex={-1}
                aria-hidden="true"
                style={{ display: "none" }}
              />

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Name <span className="text-yellow-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={fields.name}
                  onChange={set("name")}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Email <span className="text-yellow-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={fields.email}
                  onChange={set("email")}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Subject <span className="text-yellow-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  value={fields.subject}
                  onChange={set("subject")}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Message <span className="text-yellow-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  value={fields.message}
                  onChange={set("message")}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition resize-none"
                />
              </div>

              {/* Captcha */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Spam check: what is {captcha.a} + {captcha.b}?{" "}
                  <span className="text-yellow-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Your answer"
                  value={fields.captcha}
                  onChange={set("captcha")}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition w-36"
                />
              </div>

              {/* Error */}
              {(errorMsg || status === "error") && (
                <div className="flex items-start gap-2 text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>
                    {errorMsg || "Something went wrong. Please try again."}
                  </span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-gray-900 font-bold text-sm rounded-full py-3 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Direct contact */}
        <p className="text-gray-400 text-sm mt-6">
          Or reach us directly at:{" "}
          <a
            href="mailto:info@speedcubingbelgium.be"
            className="text-gray-700 font-semibold hover:text-yellow-500 transition-colors"
          >
            info@speedcubingbelgium.be
          </a>
        </p>
      </main>
    </div>
  );
}
