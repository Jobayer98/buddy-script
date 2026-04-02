"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { createApi } from "@/lib/api";
import { AuthUser } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

type RegisterResponse = { accessToken: string; user: AuthUser };

export default function RegistrationPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const api = createApi(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { accessToken, user } = await api.post<RegisterResponse>(
        "/auth/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
      );
      setAuth(accessToken, user);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 bg-background overflow-hidden isolate">
      {/* Decorative Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0">
          <Image
            src="/images/shape1.svg"
            alt=""
            width={400}
            height={400}
            className="dark:hidden"
          />
          <Image
            src="/images/dark_shape.svg"
            alt=""
            width={400}
            height={400}
            className="hidden dark:block"
          />
        </div>
        <div className="absolute top-0 right-5">
          <Image
            src="/images/shape2.svg"
            alt=""
            width={300}
            height={300}
            className="dark:hidden"
          />
          <Image
            src="/images/dark_shape1.svg"
            alt=""
            width={300}
            height={300}
            className="hidden dark:block opacity-50"
          />
        </div>
        <div className="absolute bottom-0 right-[327px]">
          <Image
            src="/images/shape3.svg"
            alt=""
            width={300}
            height={300}
            className="dark:hidden"
          />
          <Image
            src="/images/dark_shape2.svg"
            alt=""
            width={300}
            height={300}
            className="hidden dark:block opacity-50"
          />
        </div>
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full lg:w-2/3 px-4 hidden lg:block">
            <Image
              src="/images/registration.png"
              alt="Registration Illustration"
              width={633}
              height={500}
              className="max-w-full h-auto mx-auto dark:hidden"
              priority
            />
            <Image
              src="/images/registration1.png"
              alt="Registration Illustration"
              width={633}
              height={500}
              className="max-w-full h-auto mx-auto hidden dark:block"
              priority
            />
          </div>

          <div className="w-full lg:w-1/3 px-4">
            <Card className="border-none shadow-none bg-card/95 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-12">
                <div className="text-center mb-8">
                  <Image
                    src="/images/logo.svg"
                    alt="Buddy Script Logo"
                    width={161}
                    height={40}
                    className="mx-auto mb-6"
                  />
                  <p className="text-muted-foreground mb-2">Get Started Now</p>
                  <h4 className="text-2xl font-semibold mb-8">Registration</h4>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-12 flex items-center justify-center gap-3 mb-10 border-border bg-background"
                >
                  <Image
                    src="/images/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  <span className="font-medium">Register with google</span>
                </Button>

                <div className="relative text-center mb-10">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <span className="relative bg-card px-4 text-sm text-muted-foreground uppercase">
                    Or
                  </span>
                </div>

                {error && (
                  <p className="text-sm text-destructive text-center mb-4 bg-destructive/10 rounded-md py-2 px-3">
                    {error}
                  </p>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="flex gap-3">
                    <div className="space-y-2 flex-1">
                      <label className="text-sm font-medium text-muted-foreground">
                        First Name
                      </label>
                      <Input
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={set("firstName")}
                        className="h-12 bg-muted/50 border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <label className="text-sm font-medium text-muted-foreground">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={set("lastName")}
                        className="h-12 bg-muted/50 border-border"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={set("email")}
                      className="h-12 bg-muted/50 border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={set("password")}
                      className="h-12 bg-muted/50 border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Repeat Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={set("confirmPassword")}
                      className="h-12 bg-muted/50 border-border"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 py-4">
                    <Checkbox id="terms" className="border-primary" required />
                    <label
                      htmlFor="terms"
                      className="text-sm font-normal text-muted-foreground leading-none"
                    >
                      I agree to terms & conditions
                    </label>
                  </div>

                  <Button
                    className="w-full h-12 text-base font-medium mt-10"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register Now"}
                  </Button>
                </form>

                <div className="text-center mt-12">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:underline font-medium"
                    >
                      Login Here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
