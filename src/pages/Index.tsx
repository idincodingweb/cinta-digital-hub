import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles, Users, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: t('features.templates.title'),
      description: t('features.templates.description')
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: t('features.photos.title'),
      description: t('features.photos.description')
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: t('features.animations.title'),
      description: t('features.animations.description')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('features.rsvp.title'),
      description: t('features.rsvp.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16 animate-fade-in-up">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-heart-beat">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-wedding-serif text-white leading-tight">
              {t('hero.title')}
              <br />
              <span className="font-wedding-script">{t('hero.subtitle')}</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              className="wedding-button-hover bg-white text-primary hover:bg-white/90 border-0 shadow-glow font-medium px-8 py-3"
            >
              {t('hero.getStarted')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-medium px-8 py-3"
            >
              {t('hero.viewDemo')}
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white wedding-card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="font-wedding-serif text-lg">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80 text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-romantic animate-fade-in-up">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl font-wedding-serif romantic-text-gradient">
              {t('hero.cta.title')}
            </CardTitle>
            <CardDescription className="text-lg">
              {t('hero.cta.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              className="wedding-button-hover bg-gradient-romantic border-0 text-primary-foreground font-medium px-12 py-3"
            >
              {t('hero.cta.button')}
              <Heart className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
