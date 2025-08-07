import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  id: {
    translation: {
      // Landing Page
      "hero.title": "Undangan Pernikahan",
      "hero.subtitle": "Yang Indah",
      "hero.description": "Buat undangan pernikahan digital yang menakjubkan dengan desain elegan, animasi romantis, dan musik yang indah. Bagikan hari istimewa Anda dengan orang tercinta melalui tautan undangan yang dipersonalisasi.",
      "hero.getStarted": "Mulai Sekarang",
      "hero.viewDemo": "Lihat Demo",
      "hero.cta.title": "Siap Membuat Undangan Impian Anda?",
      "hero.cta.description": "Bergabunglah dengan ribuan pasangan yang telah memilih platform kami untuk hari istimewa mereka",
      "hero.cta.button": "Buat Undangan Anda",
      
      // Features
      "features.templates.title": "Template Elegan",
      "features.templates.description": "Pilih dari 10 template undangan pernikahan yang indah",
      "features.photos.title": "Upload Foto",
      "features.photos.description": "Upload foto mempelai pria dan wanita untuk mempersonalisasi undangan Anda",
      "features.animations.title": "Animasi Romantis",
      "features.animations.description": "Animasi dan transisi yang indah untuk pengalaman yang tak terlupakan",
      "features.rsvp.title": "Manajemen RSVP",
      "features.rsvp.description": "Kelola respons tamu dan lacak kehadiran dengan mudah",

      // Auth
      "auth.title": "Undangan Pernikahan",
      "auth.description": "Buat undangan pernikahan digital yang indah",
      "auth.signin": "Masuk",
      "auth.signup": "Daftar",
      "auth.email": "Email",
      "auth.password": "Kata Sandi",
      "auth.fullName": "Nama Lengkap",
      "auth.signingIn": "Sedang masuk...",
      "auth.creatingAccount": "Membuat akun...",
      "auth.createAccount": "Buat Akun",

      // Dashboard
      "dashboard.title": "Undangan Pernikahan Saya",
      "dashboard.welcome": "Selamat datang kembali,",
      "dashboard.about": "Tentang",
      "dashboard.signOut": "Keluar",
      "dashboard.createNew.title": "Buat Undangan Baru",
      "dashboard.createNew.description": "Mulai membuat undangan pernikahan yang indah",
      "dashboard.createNew.button": "Buat Undangan Baru",
      "dashboard.published": "Dipublikasikan",
      "dashboard.draft": "Draft",
      "dashboard.view": "Lihat",
      "dashboard.edit": "Edit",
      "dashboard.noInvitations.title": "Belum ada undangan",
      "dashboard.noInvitations.description": "Buat undangan pernikahan pertama Anda yang indah",
      "dashboard.noInvitations.button": "Buat Undangan Pertama Anda",

      // Create Invitation
      "create.title": "Buat Undangan Pernikahan",
      "create.description": "Lengkapi informasi di bawah ini untuk membuat undangan pernikahan Anda",
      "create.backToDashboard": "Kembali ke Dashboard",
      "create.basicInfo": "Informasi Dasar",
      "create.brideName": "Nama Mempelai Wanita",
      "create.groomName": "Nama Mempelai Pria",
      "create.weddingDate": "Tanggal Pernikahan",
      "create.weddingTime": "Waktu Pernikahan",
      "create.venue": "Tempat Acara",
      "create.venueName": "Nama Tempat",
      "create.venueAddress": "Alamat Tempat",
      "create.additionalInfo": "Informasi Tambahan",
      "create.additionalInfoPlaceholder": "Dress code, petunjuk arah, atau pesan khusus...",
      "create.photos": "Foto",
      "create.bridePhoto": "Foto Mempelai Wanita",
      "create.groomPhoto": "Foto Mempelai Pria",
      "create.uploadPhoto": "Upload Foto",
      "create.changePhoto": "Ganti Foto",
      "create.template": "Template",
      "create.chooseTemplate": "Pilih Template",
      "create.music": "Musik",
      "create.chooseMusic": "Pilih Musik Latar",
      "create.saveDraft": "Simpan Draft",
      "create.saveAndPublish": "Simpan & Publikasikan",
      "create.saving": "Menyimpan...",

      // Templates
      "template.classic": "Klasik",
      "template.modern": "Modern",
      "template.floral": "Bunga",
      "template.vintage": "Vintage",
      "template.minimalist": "Minimalis",

      // Music
      "music.romantic": "Piano Romantis",
      "music.acoustic": "Gitar Akustik",
      "music.instrumental": "Instrumental",

      // Messages
      "message.success.created": "Undangan berhasil dibuat!",
      "message.success.updated": "Undangan berhasil diperbarui!",
      "message.success.deleted": "Undangan berhasil dihapus!",
      "message.success.signIn": "Selamat datang kembali!",
      "message.success.signUp": "Periksa email Anda untuk mengkonfirmasi akun!",
      "message.success.signOut": "Anda telah berhasil keluar.",
      "message.error.generic": "Terjadi kesalahan. Silakan coba lagi.",
      "message.error.loadInvitations": "Gagal memuat undangan Anda",
      "message.error.deleteInvitation": "Gagal menghapus undangan",
      "message.error.createInvitation": "Gagal membuat undangan",
      "message.error.updateInvitation": "Gagal memperbarui undangan",
      "message.error.uploadPhoto": "Gagal upload foto",

      // About
      "about.title": "Tentang Platform Ini",
      "about.backToDashboard": "Kembali ke Dashboard",
      "about.platform.title": "Platform Undangan Pernikahan",
      "about.platform.description": "Buat undangan pernikahan digital yang indah",
      "about.platform.content": "Platform ini memungkinkan pasangan untuk membuat undangan pernikahan digital yang menakjubkan dengan template elegan, upload foto, dan animasi yang indah. Bagikan hari istimewa Anda dengan orang tercinta melalui tautan undangan yang dipersonalisasi.",
      "about.features.title": "Fitur Utama",
      "about.features.templates": "• Template pernikahan elegan yang beragam",
      "about.features.photos": "• Upload foto untuk mempelai pria dan wanita",
      "about.features.music": "• Musik latar romantis",
      "about.features.rsvp": "• Manajemen RSVP",
      "about.features.links": "• Tautan undangan yang dapat dibagikan",
      "about.features.responsive": "• Desain responsif untuk semua perangkat",
      "about.developer.title": "Informasi Developer",
      "about.developer.description": "Dibuat dengan cinta dan perhatian terhadap detail",
      "about.developer.name": "Idin Iskandar",
      "about.developer.role": "Full Stack Developer",
      "about.developer.content": "Bersemangat menciptakan aplikasi web yang indah dan fungsional yang membawa kegembiraan pada momen istimewa pengguna.",
      "about.tech.title": "Stack Teknologi",
      "about.tech.description": "Dibangun dengan teknologi web modern untuk kinerja optimal",

      // Common
      "common.loading": "Memuat...",
      "common.save": "Simpan",
      "common.cancel": "Batal",
      "common.delete": "Hapus",
      "common.edit": "Edit",
      "common.view": "Lihat",
      "common.back": "Kembali",
      "common.next": "Selanjutnya",
      "common.previous": "Sebelumnya",
      "common.confirm": "Konfirmasi",
      "common.error": "Error",
      "common.success": "Berhasil",

      // Validation
      "validation.required": "Field ini wajib diisi",
      "validation.email": "Format email tidak valid",
      "validation.minLength": "Minimal {count} karakter",
      "validation.maxLength": "Maksimal {count} karakter",

      // Confirmation
      "confirm.delete": "Apakah Anda yakin ingin menghapus undangan ini?",
      "confirm.signOut": "Apakah Anda yakin ingin keluar?"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id',
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;