"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 bg-background overflow-hidden isolate">
      {/* Decorative Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0">
          <Image src="/images/shape1.svg" alt="" width={400} height={400} className="dark:hidden" />
          <Image src="/images/dark_shape.svg" alt="" width={400} height={400} className="hidden dark:block" />
        </div>
        <div className="absolute top-0 right-5">
          <Image src="/images/shape2.svg" alt="" width={300} height={300} className="dark:hidden" />
          <Image src="/images/dark_shape1.svg" alt="" width={300} height={300} className="hidden dark:block opacity-50" />
        </div>
        <div className="absolute bottom-0 right-[327px]">
          <Image src="/images/shape3.svg" alt="" width={300} height={300} className="dark:hidden" />
          <Image src="/images/dark_shape2.svg" alt="" width={300} height={300} className="hidden dark:block opacity-50" />
        </div>
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full lg:w-2/3 px-4 hidden lg:block">
            <div className="relative">
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

                <Button variant="outline" className="w-full h-12 flex items-center justify-center gap-3 mb-10 border-border bg-background">
                  <Image src="/images/google.svg" alt="Google" width={20} height={20} />
                  <span className="font-medium">Register with google</span>
                </Button>

                <div className="relative text-center mb-10">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <span className="relative bg-card px-4 text-sm text-muted-foreground uppercase">Or</span>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-12 bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Password</label>
                    <Input 
                      type="password" 
                      placeholder="Create a password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="h-12 bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Repeat Password</label>
                    <Input 
                      type="password" 
                      placeholder="Confirm your password" 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="h-12 bg-muted/50 border-border"
                    />
                  </div>

                  <div className="flex items-center space-x-2 py-4">
                    <Checkbox id="terms" className="border-primary" />
                    <label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I agree to terms & conditions
                    </label>
                  </div>

                  <Button className="w-full h-12 text-base font-medium mt-10" type="submit">
                    Register Now
                  </Button>
                </form>

                <div className="text-center mt-12">
                  <p className="text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Login Here</Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
