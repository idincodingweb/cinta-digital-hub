import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Eye, Edit, Trash2, LogOut, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WeddingInvitation {
  id: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  slug: string;
  is_published: boolean;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [invitations, setInvitations] = useState<WeddingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchInvitations();
  }, [user, navigate]);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('wedding_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('message.error.loadInvitations'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvitation = async (id: string) => {
    if (!confirm(t('confirm.delete'))) return;

    try {
      const { error } = await supabase
        .from('wedding_invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInvitations(prev => prev.filter(inv => inv.id !== id));
      toast({
        title: t('common.success'),
        description: t('message.success.deleted')
      });
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('message.error.deleteInvitation'),
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="animate-heart-beat">
          <Heart className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-wedding-serif romantic-text-gradient mb-2">
              {t('dashboard.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('dashboard.welcome')} {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/about')}
              variant="outline"
              className="wedding-button-hover"
            >
              {t('dashboard.about')}
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="wedding-button-hover"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('dashboard.signOut')}
            </Button>
          </div>
        </div>

        {/* Create New Invitation */}
        <Card className="mb-8 shadow-soft wedding-card-hover animate-fade-in-up border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-wedding-serif">
              <Heart className="w-5 h-5 text-primary" />
              {t('dashboard.createNew.title')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.createNew.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/create')}
              className="wedding-button-hover bg-gradient-romantic border-0 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('dashboard.createNew.button')}
            </Button>
          </CardContent>
        </Card>

        {/* Invitations List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {invitations.map((invitation, index) => (
            <Card
              key={invitation.id}
              className="shadow-soft wedding-card-hover border-primary/10 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-wedding-script text-lg">
                    {invitation.bride_name} & {invitation.groom_name}
                  </CardTitle>
                  <Badge
                    variant={invitation.is_published ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {invitation.is_published ? t('dashboard.published') : t('dashboard.draft')}
                  </Badge>
                </div>
                <CardDescription>
                  {new Date(invitation.wedding_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/invitation/${invitation.slug}`)}
                    className="flex-1 transition-romantic"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t('dashboard.view')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/edit/${invitation.id}`)}
                    className="flex-1 transition-romantic"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t('dashboard.edit')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteInvitation(invitation.id)}
                    className="transition-romantic hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {invitations.length === 0 && (
          <div className="text-center py-12 animate-fade-in-up">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-wedding-serif text-muted-foreground mb-2">
              {t('dashboard.noInvitations.title')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('dashboard.noInvitations.description')}
            </p>
            <Button
              onClick={() => navigate('/create')}
              className="wedding-button-hover bg-gradient-romantic border-0 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('dashboard.noInvitations.button')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;