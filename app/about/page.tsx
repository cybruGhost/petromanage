import Link from "next/link"
import { Droplet, Shield, Truck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Droplet className="h-6 w-6" />
          <span>PetroManage</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/contact">
            Contact
          </Link>
        </nav>
        <div className="ml-4 flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About PetroManage</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Streamlining petroleum product management for businesses across the supply chain
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Story</h2>
                <p className="text-muted-foreground md:text-lg/relaxed mb-4">
                  Founded in 2020, PetroManage was created to address the challenges faced by petroleum distributors and
                  their customers. We recognized the need for a streamlined, digital solution that could connect all
                  parts of the petroleum supply chain.
                </p>
                <p className="text-muted-foreground md:text-lg/relaxed">
                  Our platform has since grown to serve distributors and customers across the country, providing an
                  efficient way to manage orders, track inventory, and streamline the entire petroleum product
                  distribution process.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-blue-100 to-blue-50 p-4 flex items-center justify-center">
                  <Droplet className="h-32 w-32 text-blue-500 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Our Mission</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Reliability</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We're committed to providing a reliable platform that ensures timely delivery of petroleum products
                    to businesses that depend on them.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                    <Truck className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our platform streamlines the ordering and distribution process, reducing administrative overhead and
                    improving operational efficiency.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Connectivity</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We connect distributors with their customers through a seamless digital platform, fostering stronger
                    business relationships.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Join PetroManage Today</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Experience the benefits of our streamlined petroleum product management platform
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">© 2025 PetroManage. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
