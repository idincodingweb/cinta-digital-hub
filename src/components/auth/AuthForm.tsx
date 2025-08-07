import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('signin-email') as string;
    const password = formData.get('signin-password') as string;

    const { error } = await signIn(email, password);
    
    if (!error) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('signup-email') as string;
    const password = formData.get('signup-password') as string;
    const fullName = formData.get('signup-fullname') as string;

    await signUp(email, password, fullName);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="animate-fade-in-up">
        <Card className="w-full max-w-md shadow-romantic border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-romantic rounded-full flex items-center justify-center animate-heart-beat">
              <span className="text-2xl">💕</span>
            </div>
            <CardTitle className="text-2xl font-wedding-serif romantic-text-gradient">
              {t('auth.title')}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('auth.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" className="transition-romantic">{t('auth.signin')}</TabsTrigger>
                <TabsTrigger value="signup" className="transition-romantic">{t('auth.signup')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t('auth.email')}</Label>
                    <Input
                      id="signin-email"
                      name="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="transition-romantic"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">{t('auth.password')}</Label>
                    <Input
                      id="signin-password"
                      name="signin-password"
                      type="password"
                      required
                      className="transition-romantic"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full wedding-button-hover bg-gradient-romantic border-0 text-primary-foreground font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? t('auth.signingIn') : t('auth.signin')}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname">{t('auth.fullName')}</Label>
                    <Input
                      id="signup-fullname"
                      name="signup-fullname"
                      type="text"
                      placeholder="Nama lengkap Anda"
                      required
                      className="transition-romantic"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('auth.email')}</Label>
                    <Input
                      id="signup-email"
                      name="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="transition-romantic"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('auth.password')}</Label>
                    <Input
                      id="signup-password"
                      name="signup-password"
                      type="password"
                      required
                      className="transition-romantic"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full wedding-button-hover bg-gradient-romantic border-0 text-primary-foreground font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;