-- Create messages table for guest messages
CREATE TABLE public.guest_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES wedding_invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for guest messages
-- Anyone can view messages for published invitations
CREATE POLICY "Anyone can view messages for published invitations" 
ON public.guest_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM wedding_invitations 
    WHERE wedding_invitations.id = guest_messages.invitation_id 
    AND wedding_invitations.is_published = true
  )
);

-- Anyone can create messages for published invitations
CREATE POLICY "Anyone can create messages for published invitations" 
ON public.guest_messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM wedding_invitations 
    WHERE wedding_invitations.id = guest_messages.invitation_id 
    AND wedding_invitations.is_published = true
  )
);

-- Invitation owners can view all messages for their invitations
CREATE POLICY "Invitation owners can view all messages" 
ON public.guest_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM wedding_invitations 
    WHERE wedding_invitations.id = guest_messages.invitation_id 
    AND wedding_invitations.user_id = auth.uid()
  )
);

-- Invitation owners can delete messages from their invitations
CREATE POLICY "Invitation owners can delete messages" 
ON public.guest_messages 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM wedding_invitations 
    WHERE wedding_invitations.id = guest_messages.invitation_id 
    AND wedding_invitations.user_id = auth.uid()
  )
);

-- Create index for better performance
CREATE INDEX idx_guest_messages_invitation_id ON public.guest_messages(invitation_id);
CREATE INDEX idx_guest_messages_created_at ON public.guest_messages(created_at DESC);