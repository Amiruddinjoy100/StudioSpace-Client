
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Aperture,
  ArrowRight,
  Mail,
  LockKeyhole,
  UserRound,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });

  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const put = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const checks = [
    {
      label: "At least 6 characters",
      ok: form.password.length >= 6,
    },
    {
      label: "At least one uppercase letter",
      ok: /[A-Z]/.test(form.password),
    },
    {
      label: "At least one lowercase letter",
      ok: /[a-z]/.test(form.password),
    },
  ];

  // Email registration
  async function submit(e) {
    e.preventDefault();

    if (!checks.every((check) => check.ok)) {
      toast.error("Please meet all password requirements");
      return;
    }

    setBusy(true);

    try {
      const { error } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        image: form.image || undefined,
      });

      if (error) {
        throw new Error(
          error.message || "Registration failed"
        );
      }

      await authClient.signOut();

      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error(
        err?.message || "Unable to create account"
      );
    } finally {
      setBusy(false);
    }
  }

  // Google authentication
  async function google() {
    if (googleBusy) return;

    setGoogleBusy(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });

      if (result?.error) {
        throw new Error(
          result.error.message ||
          "Google authentication failed"
        );
      }

      // Better Auth handles the Google redirect.
    } catch (err) {
      console.error("Google authentication error:", err);

      toast.error(
        err?.message || "Google authentication failed"
      );
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-side register-side">
        <div className="auth-side-inner">
          <Link href="/" className="brand">
            <span className="brand-icon">
              <Aperture size={24} />
            </span>
            Studio<span>Space</span><i>.</i>
          </Link>

          <div>
            <div className="eyebrow light">
              <span className="dot" />
              JOIN THE CREATIVE COMMUNITY
            </div>

            <h2>
              Your next chapter <em>starts here.</em>
            </h2>

            <p>
              A world of workspaces and fellow creatives
              is one sign-up away.
            </p>
          </div>

          <span>
            THE RIGHT SPACE CHANGES EVERYTHING.
          </span>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-inner">
          <span className="auth-kicker">
            LET'S GET STARTED
          </span>

          <h1>
            Join the <em>creative side.</em>
          </h1>

          <p className="muted">
            Already a member?{" "}
            <Link href="/login">Log in</Link>
          </p>

          <form onSubmit={submit} className="auth-form">
            <label>
              <UserRound size={17} />
              Full name

              <input
                required
                minLength={2}
                autoComplete="name"
                value={form.name}
                onChange={(e) =>
                  put("name", e.target.value)
                }
                placeholder="Your full name"
              />
            </label>

            <label>
              <Mail size={17} />
              Email address

              <input
                required
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  put("email", e.target.value)
                }
                placeholder="you@example.com"
              />
            </label>

            <label>
              <Image size={17} />
              Profile photo URL (optional)

              <input
                type="url"
                value={form.image}
                onChange={(e) =>
                  put("image", e.target.value)
                }
                placeholder="https://..."
              />
            </label>

            <label>
              <LockKeyhole size={17} />
              Password

              <input
                required
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) =>
                  put("password", e.target.value)
                }
                placeholder="Create a strong password"
              />
            </label>

            <div className="password-checks">
              {checks.map((check) => (
                <span
                  key={check.label}
                  className={check.ok ? "pass" : ""}
                >
                  ● {check.label}
                </span>
              ))}
            </div>

            <button
              className="btn btn-primary full"
              disabled={
                busy || !checks.every((check) => check.ok)
              }
              type="submit"
            >
              {busy ? "Creating account…" : "Create account"}
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="auth-or">
            OR CONTINUE WITH
          </div>

          <button
            type="button"
            className="google-button"
            onClick={google}
            disabled={googleBusy}
            aria-busy={googleBusy}
          >
            <span className="google-letter">G</span>

            {googleBusy
              ? "Connecting to Google..."
              : "Continue with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}
