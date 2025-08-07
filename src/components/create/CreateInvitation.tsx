import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Upload, Heart, Calendar, MapPin, Camera, Music } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CreateInvitation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [bridePhoto, setBridePhoto] = useState<string | null>(null);
  const [groomPhoto, setGroomPhoto] = useState<string | null>(null);
  const brideFileRef = useRef<HTMLInputElement>(null);
  const groomFileRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handlePhotoUpload = async (file: File, type: 'bride' | 'groom') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${type}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('wedding-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(fileName);

      if (type === 'bride') {
        setBridePhoto(data.publicUrl);
      } else {
        setGroomPhoto(data.publicUrl);
      }

      toast({
        title: t('common.success'),
        description: "Foto berhasil diupload!",
      });
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('message.error.uploadPhoto'),
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, publish: boolean = false) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      const invitationData = {
        user_id: user.id,
        bride_name: formData.get('brideName') as string,
        groom_name: formData.get('groomName') as string,
        wedding_date: formData.get('weddingDate') as string,
        wedding_time: formData.get('weddingTime') as string || null,
        venue_name: formData.get('venueName') as string || null,
        venue_address: formData.get('venueAddress') as string || null,
        additional_info: formData.get('additionalInfo') as string || null,
        template_id: parseInt(formData.get('template') as string) || 1,
        music_choice: parseInt(formData.get('music') as string) || 1,
        bride_photo_url: bridePhoto,
        groom_photo_url: groomPhoto,
        is_published: publish
      };

      const { data, error } = await supabase
        .from('wedding_invitations')
        .insert([invitationData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: publish ? "Undangan berhasil dibuat dan dipublikasikan!" : t('message.success.created'),
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('message.error.createInvitation'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
            {t('create.backToDashboard')}
          </Button>
          <div>
            <h1 className="text-4xl font-wedding-serif romantic-text-gradient">
              {t('create.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('create.description')}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          {/* Basic Information */}
          <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-wedding-serif">
                <Heart className="w-5 h-5 text-primary" />
                {t('create.basicInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brideName">{t('create.brideName')} *</Label>
                <Input
                  id="brideName"
                  name="brideName"
                  required
                  className="transition-romantic"
                  placeholder="Nama lengkap mempelai wanita"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groomName">{t('create.groomName')} *</Label>
                <Input
                  id="groomName"
                  name="groomName"
                  required
                  className="transition-romantic"
                  placeholder="Nama lengkap mempelai pria"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weddingDate">{t('create.weddingDate')} *</Label>
                <Input
                  id="weddingDate"
                  name="weddingDate"
                  type="date"
                  required
                  className="transition-romantic"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weddingTime">{t('create.weddingTime')}</Label>
                <Input
                  id="weddingTime"
                  name="weddingTime"
                  type="time"
                  className="transition-romantic"
                />
              </div>
            </CardContent>
          </Card>

          {/* Venue Information */}
          <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-wedding-serif">
                <MapPin className="w-5 h-5 text-primary" />
                {t('create.venue')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="venueName">{t('create.venueName')}</Label>
                <Input
                  id="venueName"
                  name="venueName"
                  className="transition-romantic"
                  placeholder="Contoh: Gedung Serbaguna, Masjid Al-Ikhlas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venueAddress">{t('create.venueAddress')}</Label>
                <Textarea
                  id="venueAddress"
                  name="venueAddress"
                  className="transition-romantic"
                  placeholder="Alamat lengkap tempat acara"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">{t('create.additionalInfo')}</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  className="transition-romantic"
                  placeholder={t('create.additionalInfoPlaceholder')}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-wedding-serif">
                <Camera className="w-5 h-5 text-primary" />
                {t('create.photos')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {/* Bride Photo */}
              <div className="space-y-4">
                <Label>{t('create.bridePhoto')}</Label>
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center space-y-4">
                  {bridePhoto ? (
                    <>
                      <img 
                        src={bridePhoto} 
                        alt="Bride" 
                        className="w-32 h-32 object-cover rounded-lg mx-auto shadow-soft"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => brideFileRef.current?.click()}
                        className="transition-romantic"
                      >
                        {t('create.changePhoto')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => brideFileRef.current?.click()}
                        className="transition-romantic"
                      >
                        {t('create.uploadPhoto')}
                      </Button>
                    </>
                  )}
                  <input
                    ref={brideFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(file, 'bride');
                    }}
                  />
                </div>
              </div>

              {/* Groom Photo */}
              <div className="space-y-4">
                <Label>{t('create.groomPhoto')}</Label>
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center space-y-4">
                  {groomPhoto ? (
                    <>
                      <img 
                        src={groomPhoto} 
                        alt="Groom" 
                        className="w-32 h-32 object-cover rounded-lg mx-auto shadow-soft"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => groomFileRef.current?.click()}
                        className="transition-romantic"
                      >
                        {t('create.changePhoto')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => groomFileRef.current?.click()}
                        className="transition-romantic"
                      >
                        {t('create.uploadPhoto')}
                      </Button>
                    </>
                  )}
                  <input
                    ref={groomFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(file, 'groom');
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template and Music */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Template Selection */}
            <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-wedding-serif">
                  <Heart className="w-5 h-5 text-primary" />
                  {t('create.template')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select name="template" defaultValue="1">
                  <SelectTrigger className="transition-romantic">
                    <SelectValue placeholder={t('create.chooseTemplate')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t('template.classic')}</SelectItem>
                    <SelectItem value="2">{t('template.modern')}</SelectItem>
                    <SelectItem value="3">{t('template.floral')}</SelectItem>
                    <SelectItem value="4">{t('template.vintage')}</SelectItem>
                    <SelectItem value="5">{t('template.minimalist')}</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Music Selection */}
            <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-wedding-serif">
                  <Music className="w-5 h-5 text-primary" />
                  {t('create.music')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select name="music" defaultValue="1">
                  <SelectTrigger className="transition-romantic">
                    <SelectValue placeholder={t('create.chooseMusic')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t('music.romantic')}</SelectItem>
                    <SelectItem value="2">{t('music.acoustic')}</SelectItem>
                    <SelectItem value="3">{t('music.instrumental')}</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="submit"
              variant="outline"
              disabled={loading}
              className="wedding-button-hover"
            >
              {loading ? t('create.saving') : t('create.saveDraft')}
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e as any, true)}
              disabled={loading}
              className="wedding-button-hover bg-gradient-romantic border-0 text-primary-foreground"
            >
              {loading ? t('create.saving') : t('create.saveAndPublish')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvitation;