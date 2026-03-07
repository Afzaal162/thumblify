import { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1500));
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-b from-black via-zinc-900 to-black text-zinc-200">
      {/* Page Heading */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white drop-shadow-md">Contact Us</h1>
        <p className="text-zinc-400 mt-2 text-lg max-w-xl mx-auto">
          Have questions or feedback? Send us a message and we’ll get back to you quickly.
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-indigo-900/20 p-10 rounded-3xl shadow-xl backdrop-blur-md border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm text-zinc-400 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              placeholder="Your Name"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm text-zinc-400 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Subject */}
          <div className="flex flex-col">
            <label className="text-sm text-zinc-400 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              placeholder="Subject (optional)"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col">
            <label className="text-sm text-zinc-400 mb-1">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition resize-none"
              placeholder="Your message..."
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Contact Info */}
      <div className="mt-12 max-w-3xl mx-auto text-center text-zinc-400 space-y-2">
        <p>Email: <span className="text-white">support@thumblify.com</span></p>
        <p>Phone: <span className="text-white">+92 300 1234567</span></p>
        <p>Address: <span className="text-white">Johar Town, Lahore, Pakistan</span></p>
      </div>
    </div>
  );
};

export default Contact;