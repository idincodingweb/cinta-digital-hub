import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Upload, Heart, Calendar, MapPin, Camera, Music } from 'lucide-react';

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
  is_published: boolean;
}

const EditInvitation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [bridePhoto, setBridePhoto] = useState<string | null>(null);
  const [groomPhoto, setGroomPhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    weddingTime: '',
    venueName: '',
    venueAddress: '',
    additionalInfo: '',
    template: '1',
    music: '1'
  });
  const brideFileRef = useRef<HTMLInputElement>(null);
  const groomFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchInvitation();
  }, [user, navigate, id]);

  const fetchInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('wedding_invitations')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          brideName: data.bride_name,
          groomName: data.groom_name,
          weddingDate: data.wedding_date,
          weddingTime: data.wedding_time || '',
          venueName: data.venue_name || '',
          venueAddress: data.venue_address || '',
          additionalInfo: data.additional_info || '',
          template: data.template_id.toString(),
          music: data.music_choice.toString()
        });
        setBridePhoto(data.bride_photo_url);
        setGroomPhoto(data.groom_photo_url);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal memuat undangan",
        variant: "destructive"
      });
      navigate('/dashboard');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
        title: "Berhasil",
        description: "Foto berhasil diupload!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal upload foto",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (publish: boolean = false) => {
    if (!user || !id) return;

    setLoading(true);
    
    try {
      const invitationData = {
        bride_name: formData.brideName,
        groom_name: formData.groomName,
        wedding_date: formData.weddingDate,
        wedding_time: formData.weddingTime || null,
        venue_name: formData.venueName || null,
        venue_address: formData.venueAddress || null,
        additional_info: formData.additionalInfo || null,
        template_id: parseInt(formData.template) || 1,
        music_choice: parseInt(formData.music) || 1,
        bride_photo_url: bridePhoto,
        groom_photo_url: groomPhoto,
        is_published: publish
      };

      const { error } = await supabase
        .from('wedding_invitations')
        .update(invitationData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: publish ? "Undangan berhasil diperbarui dan dipublikasikan!" : "Undangan berhasil diperbarui!",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal memperbarui undangan: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || fetching) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-wedding-serif mb-4">Memuat undangan...</h2>
        </div>
      </div>
    );
  }

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
            Kembali ke Dashboard
          </Button>
          <div>
            <h1 className="text-4xl font-wedding-serif romantic-text-gradient">
              Edit Undangan Pernikahan
            </h1>
            <p className="text-muted-foreground mt-2">
              Perbarui informasi undangan pernikahan Anda
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Basic Information */}
          <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-wedding-serif">
                <Heart className="w-5 h-5 text-primary" />
                Informasi Dasar
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brideName">Nama Mempelai Wanita *</Label>
                <Input
                  id="brideName"
                  value={formData.brideName}
                  onChange={(e) => handleInputChange('brideName', e.target.value)}
                  required
                  className="transition-romantic"
                  placeholder="Nama lengkap mempelai wanita"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groomName">Nama Mempelai Pria *</Label>
                <Input
                  id="groomName"
                  value={formData.groomName}
                  onChange={(e) => handleInputChange('groomName', e.target.value)}
                  required
                  className="transition-romantic"
                  placeholder="Nama lengkap mempelai pria"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weddingDate">Tanggal Pernikahan *</Label>
                <Input
                  id="weddingDate"
                  value={formData.weddingDate}
                  onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                  type="date"
                  required
                  className="transition-romantic"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weddingTime">Waktu Pernikahan</Label>
                <Input
                  id="weddingTime"
                  value={formData.weddingTime}
                  onChange={(e) => handleInputChange('weddingTime', e.target.value)}
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
                Tempat Acara
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="venueName">Nama Tempat</Label>
                <Input
                  id="venueName"
                  value={formData.venueName}
                  onChange={(e) => handleInputChange('venueName', e.target.value)}
                  className="transition-romantic"
                  placeholder="Contoh: Gedung Serbaguna, Masjid Al-Ikhlas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venueAddress">Alamat Tempat</Label>
                <Textarea
                  id="venueAddress"
                  value={formData.venueAddress}
                  onChange={(e) => handleInputChange('venueAddress', e.target.value)}
                  className="transition-romantic"
                  placeholder="Alamat lengkap tempat acara"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Informasi Tambahan</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  className="transition-romantic"
                  placeholder="Dress code, petunjuk arah, atau pesan khusus..."
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
                Foto
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {/* Bride Photo */}
              <div className="space-y-4">
                <Label>Foto Mempelai Wanita</Label>
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
                        Ganti Foto
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
                        Upload Foto
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
                <Label>Foto Mempelai Pria</Label>
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
                        Ganti Foto
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
                        Upload Foto
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
                  Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.template} onValueChange={(value) => handleInputChange('template', value)}>
                  <SelectTrigger className="transition-romantic">
                    <SelectValue placeholder="Pilih Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Klasik</SelectItem>
                    <SelectItem value="2">Modern</SelectItem>
                    <SelectItem value="3">Bunga</SelectItem>
                    <SelectItem value="4">Vintage</SelectItem>
                    <SelectItem value="5">Minimalis</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Music Selection */}
            <Card className="shadow-soft wedding-card-hover animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-wedding-serif">
                  <Music className="w-5 h-5 text-primary" />
                  Musik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.music} onValueChange={(value) => handleInputChange('music', value)}>
                  <SelectTrigger className="transition-romantic">
                    <SelectValue placeholder="Pilih Musik Latar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Piano Romantis</SelectItem>
                    <SelectItem value="2">Gitar Akustik</SelectItem>
                    <SelectItem value="3">Instrumental</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              onClick={() => handleSubmit(false)}
              variant="outline"
              disabled={loading}
              className="wedding-button-hover"
            >
              {loading ? "Menyimpan..." : "Simpan Draft"}
            </Button>
            <Button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="wedding-button-hover bg-gradient-romantic border-0 text-primary-foreground"
            >
              {loading ? "Menyimpan..." : "Simpan & Publikasikan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvitation;