import axios from "axios";
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Swal from "sweetalert2";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // ==========================
  // Handle Form Submit
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.name.trim() === "" ||
      form.email.trim() === "" ||
      form.message.trim() === ""
    ) {
      Swal.fire({
  icon: "warning",
  title: "Missing Fields",
  text: "Please fill in all fields.",
  confirmButtonColor: "#f59e0b",
  background: "#111827",
  color: "#ffffff",
});
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email)) {
      Swal.fire({
  icon: "warning",
  title: "Invalid Email",
  text: "Please enter a valid email address.",
  confirmButtonColor: "#f59e0b",
  background: "#111827",
  color: "#ffffff",
});
      return;
    }

    try {
      await axios.post(
        "https://eduvault-backend-n7na.onrender.com/api/feedback",
        form
      );

      Swal.fire({
  icon: "success",
  title: "Feedback Sent!",
  text: "Thank you for contacting EduVault.",
  confirmButtonColor: "#7c3aed",
  background: "#111827",
  color: "#ffffff",
});
      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
  icon: "error",
  title: "Oops!",
  text: "Failed to send feedback.",
  confirmButtonColor: "#ef4444",
  background: "#111827",
  color: "#ffffff",
});
    }
  }; // <-- This closing brace and semicolon were missing

  return (
    <div className="contact-container">

      {/* Contact Card */}
      <div className="contact-card">

        <h1>📞 Contact EduVault</h1>

        <p className="contact-text">
          We'd love to hear from you. Send us your
          feedback, suggestions, or questions.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            required
          />

          <textarea
            rows="5"
            placeholder="Your Message"
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
            required
          />

          <button
            type="submit"
            className="btn"
          >
            Send Message ✉️
          </button>

        </form>

      </div>

      

    </div>
  );
};

export default Contact;