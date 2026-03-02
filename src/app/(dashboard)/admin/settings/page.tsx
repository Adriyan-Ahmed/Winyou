"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import PasswordField from "@/components/ui/PasswordField";

export default function Settings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Password updated successfully");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] p-6">
      <div
        className="max-w-lg mx-auto rounded-2xl border border-gray-800 p-8 shadow-2xl"
        style={{ background: "#0d0d18" }}
      >
        <h2 className="text-xl font-bold text-gray-100 mb-6">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            show={show.current}
            toggle={() =>
              setShow((prev) => ({ ...prev, current: !prev.current }))
            }
          />

          {/* New Password */}
          <PasswordField
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            show={show.new}
            toggle={() => setShow((prev) => ({ ...prev, new: !prev.new }))}
          />

          {/* Confirm Password */}
          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            show={show.confirm}
            toggle={() =>
              setShow((prev) => ({ ...prev, confirm: !prev.confirm }))
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
