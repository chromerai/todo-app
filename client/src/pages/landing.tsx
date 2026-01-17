import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckSquare, ArrowRight, ShieldCheck, Zap, Layout as LayoutIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-6 px-4 sm:px-8 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <CheckSquare className="h-5 w-5" />
            </div>
            TaskFlow
          </div>
          
          <a href="/api/login">
            <Button>Log In</Button>
          </a>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              Organize your life <br/>
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                one task at a time
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The minimal, beautiful task manager designed to help you focus on what matters. 
              No clutter, just clarity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a href="/api/login">
                <Button size="lg" className="h-12 px-8 text-lg gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                View Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap className="h-6 w-6 text-amber-500" />}
                title="Lightning Fast"
                description="Built for speed. Add, edit, and complete tasks instantly without page reloads."
              />
              <FeatureCard 
                icon={<ShieldCheck className="h-6 w-6 text-emerald-500" />}
                title="Secure by Default"
                description="Your data is encrypted and secure. We use enterprise-grade authentication."
              />
              <FeatureCard 
                icon={<LayoutIcon className="h-6 w-6 text-primary" />}
                title="Beautiful Interface"
                description="A clean, distraction-free design that helps you stay focused on your goals."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/50 bg-background text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4 font-display font-bold text-foreground">
          <CheckSquare className="h-5 w-5 text-primary" />
          TaskFlow
        </div>
        <p>© 2024 TaskFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
