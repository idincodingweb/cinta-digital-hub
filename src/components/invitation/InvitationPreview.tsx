import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Calendar, MapPin, Music } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WeddingInvitation {
  id: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  wedding_time: string;
  venue_name: string;
  venue_address: string;
  additional_info: string;
  template_id: number;
  music_choice: number;
  bride_photo_url: string;
  groom_photo_url: string;
  slug: string;
}

const InvitationPreview = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<WeddingInvitation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const { data, error } = await supabase
          .from('wedding_invitations')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setInvitation(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Undangan tidak ditemukan",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchInvitation();
    }
  }, [slug, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-wedding-serif mb-4">Memuat undangan...</h2>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-wedding-serif mb-4">Undangan tidak ditemukan</h2>
          <Button onClick={() => window.location.href = '/'}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <div className="text-center py-16 px-6">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl font-wedding-serif romantic-text-gradient mb-4">
            {invitation.bride_name} & {invitation.groom_name}
          </h1>
          <p className="text-xl text-muted-foreground">
            Dengan penuh sukacita, kami mengundang Anda untuk hadir di pernikahan kami
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-16 max-w-4xl">
        <div className="space-y-8">
          {/* Photos */}
          {(invitation.bride_photo_url || invitation.groom_photo_url) && (
            <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
              <CardContent className="p-8">
                <div className="flex justify-center items-center gap-8">
                  {invitation.bride_photo_url && (
                    <div className="text-center">
                      <img 
                        src={invitation.bride_photo_url} 
                        alt={invitation.bride_name}
                        className="w-48 h-48 object-cover rounded-full mx-auto shadow-soft mb-4"
                      />
                      <h3 className="text-2xl font-wedding-serif text-primary">
                        {invitation.bride_name}
                      </h3>
                    </div>
                  )}
                  
                  <Heart className="w-12 h-12 text-primary animate-pulse" />
                  
                  {invitation.groom_photo_url && (
                    <div className="text-center">
                      <img 
                        src={invitation.groom_photo_url} 
                        alt={invitation.groom_name}
                        className="w-48 h-48 object-cover rounded-full mx-auto shadow-soft mb-4"
                      />
                      <h3 className="text-2xl font-wedding-serif text-primary">
                        {invitation.groom_name}
                      </h3>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Date & Time */}
          <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
            <CardContent className="p-8 text-center">
              <Calendar className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-wedding-serif romantic-text-gradient mb-4">
                Waktu Acara
              </h2>
              <p className="text-2xl font-semibold mb-2">
                {formatDate(invitation.wedding_date)}
              </p>
              {invitation.wedding_time && (
                <p className="text-xl text-muted-foreground">
                  Pukul {formatTime(invitation.wedding_time)} WIB
                </p>
              )}
            </CardContent>
          </Card>

          {/* Venue */}
          {(invitation.venue_name || invitation.venue_address) && (
            <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
              <CardContent className="p-8 text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-wedding-serif romantic-text-gradient mb-4">
                  Tempat Acara
                </h2>
                {invitation.venue_name && (
                  <p className="text-2xl font-semibold mb-2">
                    {invitation.venue_name}
                  </p>
                )}
                {invitation.venue_address && (
                  <p className="text-lg text-muted-foreground">
                    {invitation.venue_address}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          {invitation.additional_info && (
            <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-wedding-serif romantic-text-gradient mb-4">
                  Informasi Tambahan
                </h2>
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {invitation.additional_info}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center py-8 animate-fade-in-up">
            <p className="text-lg text-muted-foreground mb-4">
              Kehadiran dan doa restu Anda merupakan kehormatan bagi kami
            </p>
            <div className="flex justify-center items-center gap-2 text-primary">
              <Heart className="w-5 h-5" />
              <span className="font-wedding-serif text-xl">
                {invitation.bride_name} & {invitation.groom_name}
              </span>
              <Heart className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Background Music Icon */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-primary/10 backdrop-blur-sm rounded-full p-3 shadow-soft">
          <Music className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default InvitationPreview;