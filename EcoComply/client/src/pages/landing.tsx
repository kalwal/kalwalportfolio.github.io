import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Users, Building2, BarChart3, Shield, MapPin } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold" data-testid="text-app-title">EcoComply</h1>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6" data-testid="text-hero-title">
            Environmental Compliance Made Simple
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8" data-testid="text-hero-description">
            Report environmental complaints, monitor compliance reports, and enforce regulations 
            through our comprehensive platform designed for citizens, industries, and government officers.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-get-started"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <h3 className="text-3xl font-semibold text-center mb-12" data-testid="text-features-title">
          Key Features
        </h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2" data-testid="text-feature-citizen">Citizen Reporting</h4>
            <p className="text-muted-foreground">
              Submit environmental complaints with photo evidence, GPS location, and track status in real-time.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2" data-testid="text-feature-industry">Industry Compliance</h4>
            <p className="text-muted-foreground">
              Register businesses, submit compliance reports, and maintain environmental documentation.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2" data-testid="text-feature-admin">Admin Management</h4>
            <p className="text-muted-foreground">
              Manage complaints, assign inspectors, and monitor compliance with comprehensive dashboards.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2" data-testid="text-feature-location">GPS Tracking</h4>
            <p className="text-muted-foreground">
              Automatic location detection and visualization of complaints on interactive maps.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2" data-testid="text-feature-analytics">Analytics Dashboard</h4>
            <p className="text-muted-foreground">
              View pollution heatmaps, resolution rates, and trend analysis for data-driven decisions.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2" data-testid="text-feature-categories">Multi-Category Support</h4>
            <p className="text-muted-foreground">
              Handle air, water, waste, noise, and industrial pollution complaints efficiently.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center bg-primary/5">
          <h3 className="text-3xl font-semibold mb-4" data-testid="text-cta-title">
            Ready to Make a Difference?
          </h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of citizens, industries, and government officers working together 
            for a cleaner, safer environment.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-join-now"
          >
            Join Now
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p data-testid="text-footer">© 2025 EcoComply. Environmental Compliance Monitoring System.</p>
        </div>
      </footer>
    </div>
  );
}
