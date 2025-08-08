import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Send } from 'lucide-react';

interface MessageFormProps {
  invitationId: string;
  onMessageAdded: () => void;
}

const MessageForm = ({ invitationId, onMessageAdded }: MessageFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.guestName.trim() || !formData.message.trim()) {
      toast({
        title: "Error",
        description: "Nama dan pesan wajib diisi",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('guest_messages')
        .insert([
          {
            invitation_id: invitationId,
            guest_name: formData.guestName.trim(),
            guest_email: formData.guestEmail.trim() || null,
            message: formData.message.trim()
          }
        ]);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Pesan Anda berhasil dikirim!",
      });

      // Reset form
      setFormData({
        guestName: '',
        guestEmail: '',
        message: ''
      });

      // Notify parent to refresh messages
      onMessageAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal mengirim pesan: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-wedding-serif">
          <Heart className="w-5 h-5 text-primary" />
          Kirim Ucapan & Doa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guestName">Nama Anda *</Label>
              <Input
                id="guestName"
                value={formData.guestName}
                onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
                placeholder="Nama lengkap"
                required
                className="transition-romantic"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email (Opsional)</Label>
              <Input
                id="guestEmail"
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, guestEmail: e.target.value }))}
                placeholder="email@example.com"
                className="transition-romantic"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Ucapan & Doa *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Tuliskan ucapan selamat dan doa terbaik untuk kedua mempelai..."
              rows={4}
              required
              className="transition-romantic"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full wedding-button-hover bg-gradient-romantic border-0 text-primary-foreground"
          >
            {loading ? (
              "Mengirim..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Kirim Ucapan
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MessageForm;