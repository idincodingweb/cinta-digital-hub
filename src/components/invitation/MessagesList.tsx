import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Message {
  id: string;
  guest_name: string;
  guest_email: string | null;
  message: string;
  created_at: string;
}

interface MessagesListProps {
  invitationId: string;
  refreshTrigger: number;
}

const MessagesList = ({ invitationId, refreshTrigger }: MessagesListProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, [invitationId, refreshTrigger]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('guest_messages')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-wedding-serif">
            <MessageCircle className="w-5 h-5 text-primary" />
            Ucapan & Doa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Memuat ucapan...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-wedding-serif">
          <MessageCircle className="w-5 h-5 text-primary" />
          Ucapan & Doa ({messages.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Belum ada ucapan. Jadilah yang pertama memberikan ucapan selamat!
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className="border-l-4 border-primary/30 pl-4 py-3 bg-muted/20 rounded-r-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-primary">
                    {message.guest_name}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(message.created_at), { 
                      addSuffix: true, 
                      locale: id 
                    })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {message.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessagesList;