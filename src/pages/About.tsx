import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Code, Star } from 'lucide-react';

const About = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="wedding-button-hover"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-wedding-serif romantic-text-gradient">
            About This Platform
          </h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Platform Info */}
          <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-wedding-serif">
                <Heart className="w-5 h-5 text-primary" />
                Wedding Invitations Platform
              </CardTitle>
              <CardDescription>
                Create beautiful digital wedding invitations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This platform allows couples to create stunning digital wedding invitations 
                with elegant templates, photo uploads, and beautiful animations. Share your 
                special day with loved ones through personalized invitation links.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Key Features
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Multiple elegant wedding templates</li>
                  <li>• Photo upload for bride and groom</li>
                  <li>• Romantic background music</li>
                  <li>• RSVP management</li>
                  <li>• Shareable invitation links</li>
                  <li>• Responsive design for all devices</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Developer Info */}
          <Card className="shadow-soft wedding-card-hover animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-wedding-serif">
                <Code className="w-5 h-5 text-primary" />
                Developer Information
              </CardTitle>
              <CardDescription>
                Created with love and attention to detail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto bg-gradient-romantic rounded-full flex items-center justify-center animate-heart-beat">
                  <span className="text-2xl font-wedding-script text-white font-bold">II</span>
                </div>
                <h3 className="text-xl font-wedding-serif romantic-text-gradient">
                  Idin Iskandar
                </h3>
                <p className="text-sm text-muted-foreground">
                  Full Stack Developer
                </p>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Passionate about creating beautiful and functional web applications 
                  that bring joy to users' special moments.
                </p>
                
                <div className="text-center">
                  <Badge className="bg-gradient-gold text-gold-foreground">
                    Made with React, TypeScript & Supabase
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="mt-8 shadow-soft wedding-card-hover animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="font-wedding-serif text-center">
              Technology Stack
            </CardTitle>
            <CardDescription className="text-center">
              Built with modern web technologies for optimal performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">R</span>
                </div>
                <p className="text-sm font-medium">React</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">TS</span>
                </div>
                <p className="text-sm font-medium">TypeScript</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">S</span>
                </div>
                <p className="text-sm font-medium">Supabase</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">T</span>
                </div>
                <p className="text-sm font-medium">Tailwind</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;