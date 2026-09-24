import { useState } from "react";
import "./_contact.scss";

const API_URL = import.meta.env.VITE_API_URL;

const initialFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

function Contact() {
  const [formData, setFormData] =
    useState(initialFormData);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (status.message) {
      setStatus({
        type: "",
        message: "",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setStatus({
        type: "error",
        message:
          "Please complete all fields.",
      });

      return;
    }

    try {
      setIsSubmitting(true);

      setStatus({
        type: "",
        message: "",
      });

      const response = await fetch(
        `${API_URL}/api/contact`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Message could not be sent."
        );
      }

      setStatus({
        type: "success",
        message:
          "Message sent successfully. I'll get back to you as soon as possible.",
      });

      setFormData(initialFormData);
    } catch (error) {
      console.error(
        "Contact form error:",
        error
      );

      setStatus({
        type: "error",
        message:
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="contact"
      id="contact"
    >
      <div className="contact__container">
        <div className="contact__intro">
          <p className="contact__eyebrow">
            04 / Contact
          </p>

          <h2 className="contact__title">
            Let's build
            <span>
              something together.
            </span>
          </h2>

          <p className="contact__description">
            Have a project, opportunity or
            idea in mind? Send me a message
            and I'll get back to you.
          </p>
        </div>

        <form
          className="contact__form"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Honeypot field */}
          <div
            className="contact__honeypot"
            aria-hidden="true"
          >
            <label htmlFor="contact-website">
              Website
            </label>

            <input
              id="contact-website"
              name="website"
              type="text"
              value={formData.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="contact__field">
            <label htmlFor="contact-name">
              Name
            </label>

            <input
              id="contact-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
              maxLength="80"
              required
            />
          </div>

          <div className="contact__field">
            <label htmlFor="contact-email">
              Email
            </label>

            <input
              id="contact-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              autoComplete="email"
              maxLength="150"
              required
            />
          </div>

          <div className="contact__field">
            <label htmlFor="contact-subject">
              Subject
            </label>

            <input
              id="contact-subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What is this about?"
              maxLength="120"
              required
            />
          </div>

          <div className="contact__field">
            <label htmlFor="contact-message">
              Message
            </label>

            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              rows="7"
              maxLength="2000"
              required
            />
          </div>

          {status.message && (
            <p
              className={`contact__status contact__status--${status.type}`}
              role="status"
              aria-live="polite"
            >
              {status.message}
            </p>
          )}

          <button
            className="contact__submit"
            type="submit"
            disabled={isSubmitting}
          >
            <span>
              {isSubmitting
                ? "Sending..."
                : "Send message"}
            </span>

            <span aria-hidden="true">
              ↗
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;