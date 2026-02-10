import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  CheckCircle2,
  Users,
  LayoutDashboard,
  Target,
  Calendar,
  BarChart3,
  Globe,
  Clock,
  Layers,
  ArrowRight,
  CheckIcon,
} from 'lucide-react';

export const dynamic = 'force-static';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              ProjectHub
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#solutions"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Solutions
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Start free trial</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6">
            Multi-tenant collaboration platform
          </Badge>
          <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            The complete platform to manage projects and teams
          </h1>
          <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Empower your organization with powerful project management tools.
            Track milestones, manage tasks with multiple views, and collaborate
            seamlessly across teams.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/register">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="#features">Explore features</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-foreground">
                10,000+
              </div>
              <div className="text-sm text-muted-foreground">
                Active organizations
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-foreground">
                50,000+
              </div>
              <div className="text-sm text-muted-foreground">
                Projects managed
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-foreground">99%</div>
              <div className="text-sm text-muted-foreground">
                Customer satisfaction
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">
                Support available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground sm:text-4xl">
              Everything you need to manage projects
            </h2>
            <p className="text-pretty text-lg text-muted-foreground">
              Powerful features designed for modern teams
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Multi-tenant Organizations
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Create organizations with custom branding. Manage member roles
                including owners, admins, and members with granular permissions.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Project Management
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Create and edit projects with custom names, descriptions, and
                icons. Organize tasks with powerful filtering and assignment
                features.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Milestone Tracking
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Group tasks by target dates with status tracking: planned, in
                progress, completed, or on hold. Keep your team aligned on
                goals.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Multiple Task Views
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                View tasks your way: table view for details, kanban board for
                workflow, or calendar view for scheduling. Switch seamlessly.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Analytics & Reports
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Track project and organization metrics with task statistics and
                monthly comparisons. Make data-driven decisions.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                International Support
              </h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Built-in internationalization with Chinese and English support.
                Work with global teams in their preferred language.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section
        id="solutions"
        className="border-y border-border bg-muted/30 py-20 sm:py-24 lg:py-32"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="mb-6 text-balance text-3xl font-bold text-foreground sm:text-4xl">
                Built for modern collaboration
              </h2>
              <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground">
                The platform for rapid progress. Let your team focus on shipping
                features instead of managing infrastructure with automated
                workflows and integrated collaboration.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-pretty leading-relaxed text-foreground">
                    Email invitations with role-based access control
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-pretty leading-relaxed text-foreground">
                    Real-time task updates and change logs for full transparency
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-pretty leading-relaxed text-foreground">
                    Flexible task assignment and status management
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-pretty leading-relaxed text-foreground">
                    Comprehensive project and organizational analytics
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex items-center">
              <Card className="w-full p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Collaboration
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  Make teamwork seamless
                </h3>
                <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
                  Tools for your team and stakeholders to share feedback and
                  iterate faster. Keep everyone in sync with real-time updates.
                </p>
                <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      JD
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        John assigned task to Sarah
                      </div>
                      <div className="text-xs text-muted-foreground">
                        2 minutes ago
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      SM
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        Sarah moved task to In Progress
                      </div>
                      <div className="text-xs text-muted-foreground">
                        5 minutes ago
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="text-pretty text-lg text-muted-foreground">
              Choose the plan that fits your team
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card className="flex flex-col p-8">
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Starter
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mb-6 text-pretty text-sm leading-relaxed text-muted-foreground">
                Perfect for small teams getting started
              </p>
              <ul className="mb-8 flex-1 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    Up to 5 team members
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    3 projects maximum
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    Basic task views
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    Community support
                  </span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/register">Get started</Link>
              </Button>
            </Card>

            <Card className="flex flex-col border-primary p-8 shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">
                  Professional
                </h3>
                <Badge>Popular</Badge>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mb-6 text-pretty text-sm leading-relaxed text-muted-foreground">
                For growing teams with advanced needs
              </p>
              <ul className="mb-8 flex-1 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    Up to 25 team members
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    Unlimited projects
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    All task views
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    Advanced analytics
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    Priority support
                  </span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/register">Start free trial</Link>
              </Button>
            </Card>

            <Card className="flex flex-col p-8">
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Enterprise
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">
                  Custom
                </span>
              </div>
              <p className="mb-6 text-pretty text-sm leading-relaxed text-muted-foreground">
                For large organizations with custom requirements
              </p>
              <ul className="mb-8 flex-1 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    Unlimited team members
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    Unlimited projects
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    Custom integrations
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    Dedicated account manager
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">24/7 support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/register">Contact sales</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-primary py-20 text-primary-foreground sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-balance text-3xl font-bold sm:text-4xl">
            Ready to transform your project management?
          </h2>
          <p className="mb-8 text-pretty text-lg leading-relaxed text-primary-foreground/90">
            Join thousands of teams already using ProjectHub to ship faster and
            collaborate better.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/register">Start free trial</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
            >
              <Link href="#features">Learn more</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Layers className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold text-foreground">
                  ProjectHub
                </span>
              </div>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                The complete platform to manage projects and collaborate with
                teams.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Product
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#features"
                    className="transition-colors hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="transition-colors hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#solutions"
                    className="transition-colors hover:text-foreground"
                  >
                    Solutions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="transition-colors hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Legal
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="transition-colors hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 ProjectHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
