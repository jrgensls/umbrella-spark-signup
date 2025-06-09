
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Building, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">U</span>
            </div>
            <span className="font-semibold text-lg">Umbrella Workspace</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-sm hover:text-primary">Home</a>
            <a href="#" className="text-sm hover:text-primary">Features</a>
            <a href="#" className="text-sm hover:text-primary">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to the <span className="text-primary">Umbrella Network</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access premium coworking spaces worldwide. Connect, collaborate, and grow your business in our global network of professional workspaces.
          </p>
          <div className="space-x-4">
            <Link to="/login">
              <Button size="lg" className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Umbrella Network?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Access</h3>
              <p className="text-muted-foreground">
                Work from any of our 500+ locations across 50 countries worldwide.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                Connect with like-minded professionals and grow your network.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Building className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Facilities</h3>
              <p className="text-muted-foreground">
                Enjoy high-speed internet, meeting rooms, and premium amenities.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join the Network?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your company registration today and unlock access to our global workspace network.
          </p>
          <Link to="/login">
            <Button size="lg" className="text-lg px-8">
              Register Your Company
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Umbrella Workspace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
