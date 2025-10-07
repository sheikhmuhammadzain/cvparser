// Update this page (the content is just a fallback if you fail to update the page)

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Filter as FilterIcon, CheckCircle2, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]">
          <div className="absolute -top-24 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-12 pt-24 md:pb-20 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> AI-Powered Resume Screening
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Shortlist better candidates, faster.
            </h1>
            <p className="mt-4 text-balance text-lg text-muted-foreground md:text-xl">
              Upload resumes, extract insights with NLP/OCR, and filter by education, skills, experience and keywords — all in seconds.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/upload">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/cvs">View CVs</Link>
              </Button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Media served locally • No data leaves your machine in development
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<FileText className="h-5 w-5 text-primary" />}
            title="Multi-format parsing"
            desc="PDF, DOCX, TXT and images. OCR fallback for scanned files."
          />
          <FeatureCard
            icon={<FilterIcon className="h-5 w-5 text-primary" />}
            title="Advanced filtering"
            desc="Match by education, skills, years of experience and keywords."
          />
          <FeatureCard
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
            title="Smart ranking"
            desc="Transparent scoring shows exactly why a CV ranks higher."
          />
          <FeatureCard
            icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
            title="Instant feedback"
            desc="Toast notifications for uploads, errors and results."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5 text-primary" />}
            title="Private by default"
            desc="Runs locally with SQLite and media on your machine."
          />
          <FeatureCard
            icon={<ArrowRight className="h-5 w-5 text-primary" />}
            title="React + DRF APIs"
            desc="Typed service layer calling /api endpoints for seamless UX."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-6 text-center text-2xl font-semibold md:text-3xl">How it works</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StepCard step={1} title="Upload" desc="Add multiple resumes — size and type validated automatically." />
          <StepCard step={2} title="Extract" desc="NLP + OCR parse text and entities like skills & education." />
          <StepCard step={3} title="Filter & Rank" desc="Apply criteria and get scored, paginated results instantly." />
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/upload">Upload resumes</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/filter">Try filtering</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;

type FeatureCardProps = { icon: React.ReactNode; title: string; desc: string };
function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-lg">
      <div className="absolute inset-0 -z-10 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function StepCard({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-background p-6 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {step}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
