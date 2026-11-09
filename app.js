/**
 * e-HUNTAP VERIKOST - Application Logic
 * Sistem Digitalisasi Verifikasi Biaya Riil & Audit Pengadaan Darurat
 * Sesuai PerLKPP No. 6 Tahun 2024 (Biaya Plus Imbalan)
 */

const STORAGE_KEY = 'e_huntap_verikost_data_v1';
const AUTH_KEY = 'e_huntap_verikost_session_v1';
const ROLE_PERMISSIONS = {
  pengembang: ['dashboard', 'klaim'],
  teknis: ['dashboard', 'klaim', 'verifikasi', 'lahan'],
  apip: ['dashboard', 'klaim', 'audit', 'lahan'],
  ppk: ['dashboard', 'audit', 'lahan', 'bav']
};

// Initial realistic dataset for 40 Unit Huntap Aceh Tenggara
const INITIAL_DATA = {
  paguTotal: 6400000000, // Rp 6.4 Milyar (40 unit x @Rp 160 Juta incl Lahan + PSU)
  feePercentage: 8,      // 8% Imbalan Tetap Pengembang (Cost Plus Fee)
  currentRole: 'teknis', // 'pengembang' | 'teknis' | 'apip' | 'ppk'
  auditClearanceIssued: false,
  auditRegNumber: 'APIP-PKP/AC-TG/2026/089',
  claims: [
    {
      id: 'CLM-001',
      tanggal: '2026-10-15',
      komponen: 'Lahan',
      uraian: 'Pengadaan Lahan Matang Ready-to-Build (Kec. Semadam, Sertifikat HM 0412)',
      penyedia: 'Koperasi Warga / Pemilik Asal via Pengembang',
      noBukti: 'AKTA-JB/2026/102',
      volume: 6000,
      satuan: 'm²',
      hargaSatuan: 150000,
      totalDiajukan: 900000000,
      totalDisetujui: 900000000,
      status: 'Approved', // 'Approved' | 'Pending' | 'Flagged' | 'Rejected'
      buktiDetail: {
        jenis: 'Sertifikat Hak Milik & Kuitansi Pembayaran Lahan',
        appraisalKJPP: 'Rp 150.000 / m² (Wajar Sesuai KJPP Anas Karim & Rekan)',
        catatan: 'Clear and clean, di luar KRB BPBD Aceh Tenggara, site plan 40 kaveling disahkan.'
      },
      checklist: {
        dokumenSah: true,
        spekTeknis: true,
        fisikTerpasang: true
      },
      catatanVerifikasi: 'Lolos uji zonasi BPBD dan verifikasi sertifikat BPN.'
    },
    {
      id: 'CLM-002',
      tanggal: '2026-10-22',
      komponen: 'Material',
      uraian: 'Panel Struktur RISHA Tipe 36 (Modul Panel P1, P2, P3 Tahap 1 untuk 20 Unit)',
      penyedia: 'PT. Beton Presisi Sumatera (Aplikator Resmi RISHA)',
      noBukti: 'INV-RISHA/2026/881',
      volume: 1380,
      satuan: 'Modul',
      hargaSatuan: 550000,
      totalDiajukan: 759000000,
      totalDisetujui: 759000000,
      status: 'Approved',
      buktiDetail: {
        jenis: 'Faktur Pajak Elektronik & Sertifikat Uji Tekan Beton fc 25 MPa',
        appraisalKJPP: 'Standar Lisensi Puskim Kementerian PU',
        catatan: 'Hasil uji laboratorium mutu beton sesuai SNI Tahan Gempa.'
      },
      checklist: {
        dokumenSah: true,
        spekTeknis: true,
        fisikTerpasang: true
      },
      catatanVerifikasi: 'Spesifikasi panel beton telah diuji tim pengawas teknis PKP.'
    },
    {
      id: 'CLM-003',
      tanggal: '2026-10-28',
      komponen: 'Material',
      uraian: 'Semen Portland Komposit 50kg (Batch 1 Konstruksi Pondasi & Pasangan Dinding)',
      penyedia: 'UD. Semen Maju Kutacane',
      noBukti: 'FAK-SMK/X/2026/045',
      volume: 1200,
      satuan: 'Zak',
      hargaSatuan: 78000,
      totalDiajukan: 93600000,
      totalDisetujui: 93600000,
      status: 'Approved',
      buktiDetail: {
        jenis: 'Faktur Penjualan, Surat Jalan Pengiriman, Kuitansi Lunas',
        appraisalKJPP: 'Batas toleransi darurat: Rp 80.000 / zak',
        catatan: 'Harga wajar di wilayah bencana Aceh Tenggara pasca longsor.'
      },
      checklist: {
        dokumenSah: true,
        spekTeknis: true,
        fisikTerpasang: true
      },
      catatanVerifikasi: 'Volume sesuai kebutuhan riil perakitan modul rumah.'
    },
    {
      id: 'CLM-004',
      tanggal: '2026-11-02',
      komponen: 'Material',
      uraian: 'Besi Beton Ulir D10 & D8 SNI untuk Baut Pengikat & Tulangan Tambahan',
      penyedia: 'Toko Besi Baja Pratama Kutacane',
      noBukti: 'INV-BBP/XI/2026/112',
      volume: 750,
      satuan: 'Batang',
      hargaSatuan: 95000,
      totalDiajukan: 71250000,
      totalDisetujui: 71250000,
      status: 'Approved',
      buktiDetail: {
        jenis: 'Nota Toko Asli, Surat Timbang, Sertifikat SNI Pabrik',
        appraisalKJPP: 'Batas wajar: Rp 97.000 / btg',
        catatan: 'Baut penyambung galvanis anti-karat disertakan.'
      },
      checklist: {
        dokumenSah: true,
        spekTeknis: true,
        fisikTerpasang: true
      },
      catatanVerifikasi: 'Kesesuaian diameter teruji dengan jangka sorong digital.'
    },
    {
      id: 'CLM-005',
      tanggal: '2026-11-04',
      komponen: 'Upah',
      uraian: 'Upah Tenaga Kerja Tukang Bersertifikat RISHA & Pekerja Lokal (Periode 14 Hari)',
      penyedia: 'Daftar Upah Kelompok Kerja Mandor Hasan',
      noBukti: 'KWT-UPH/2026/02',
      volume: 14,
      satuan: 'Hari Kerja (35 Orang)',
      hargaSatuan: 10500000,
      totalDiajukan: 147000000,
      totalDisetujui: 147000000,
      status: 'Approved',
      buktiDetail: {
        jenis: 'Daftar Hadir Fisik (Absensi Harian) + Tanda Tangan Penerima + Foto Opname',
        appraisalKJPP: 'Sesuai Standar UMR / Biaya Upah Konstruksi Aceh',
        catatan: 'Melibatkan 60% pekerja lokal terdampak bencana banjir.'
      },
      checklist: {
        dokumenSah: true,
        spekTeknis: true,
        fisikTerpasang: true
      },
      catatanVerifikasi: 'Daftar hadir dan foto kegiatan harian telah diverifikasi konsultan.'
    },
    {
      id: 'CLM-006',
      tanggal: '2026-11-05',
      komponen: 'Peralatan',
      uraian: 'Sewa Excavator PC-75 & 2 Dump Truck untuk Pembersihan Lahan & Mobilisasi Material',
      penyedia: 'CV. Rental Alat Berat Perkasa',
      noBukti: 'INV-RAB/2026/301',
      volume: 80,
      satuan: 'Jam Operasi',
      hargaSatuan: 450000,
      totalDiajukan: 36000000,
      totalDisetujui: 36000000,
      status: 'Approved',
      buktiDetail: {
        jenis: 'Timesheet Jam Alat, Bon BBM Solar Industri, Kuitansi Pembayaran',
        appraisalKJPP: 'Batas wajar: Rp 475.000 / jam',
        catatan: 'Digunakan untuk pemadatan dan perataan jalan akses masuk huntap.'
      },
      checklist: {
        dokumenSah: true,
        spekTeknis: true,
        fisikTerpasang: true
      },
      catatanVerifikasi: 'Timesheet jam kerja alat berat tervalidasi pengawas lapangan.'
    },
    {
      id: 'CLM-007',
      tanggal: '2026-11-06',
      komponen: 'PSU',
      uraian: 'Pekerjaan Saluran Drainase U-Ditch 40x40 & Paving Block Akses Jalan Utama Blok A',
      penyedia: 'Subkontraktor CV. Karya Drainase Aceh',
      noBukti: 'INV-KDA/XI/2026/019',
      volume: 1,
      satuan: 'Paket Tahap 1',
      hargaSatuan: 210000000,
      totalDiajukan: 210000000,
      totalDisetujui: 195000000,
      status: 'Flagged',
      buktiDetail: {
        jenis: 'Faktur Subkontraktor, Berita Acara Opname Fisik Sementara',
        appraisalKJPP: 'Evaluasi teknis menunjukkan pengurangan volume minor 15 meter saluran',
        catatan: 'Koreksi volume fisik riil oleh tim teknis sebesar Rp 15.000.000.'
      },
      checklist: {
        dokumenSah: true,
        spekTeknis: true,
        fisikTerpasang: false
      },
      catatanVerifikasi: 'Koreksi audit: Panjang terpasang 285 m dari klaim 300 m. Disetujui Rp 195 Jt.'
    },
    {
      id: 'CLM-008',
      tanggal: '2026-11-08',
      komponen: 'Material',
      uraian: 'Pasir Cor Pasang & Batu Split 2/3 Pengiriman Tahap 2',
      penyedia: 'Pangkalan Pasir Sungai Alas',
      noBukti: 'NOTA-PSA/2026/099',
      volume: 120,
      satuan: 'm³ (Dump Truck)',
      hargaSatuan: 260000,
      totalDiajukan: 31200000,
      totalDisetujui: 0,
      status: 'Pending',
      buktiDetail: {
        jenis: 'Nota Toko Kertas, Surat Jalan Tanpa Cap Basah',
        appraisalKJPP: 'Batas wajar: Rp 230.000 / m³ (Terdeteksi selisih +13%)',
        catatan: 'Perlu konfirmasi nota timbangan jembatan timbang resmi.'
      },
      checklist: {
        dokumenSah: false,
        spekTeknis: true,
        fisikTerpasang: false
      },
      catatanVerifikasi: 'Menunggu klarifikasi bukti transfer bank dan nota cap basah penyedia.'
    }
  ]
};

// Benchmark comparison for APIP Audit tab
const BENCHMARK_DATA = [
  { item: 'Lahan Matang Ready-to-build', satuan: 'm²', maxKJPP: 150000, klaim: 150000, status: 'Wajar', cat: 'Sesuai appraisal KJPP independen' },
  { item: 'Panel Struktur RISHA Tipe 36', satuan: 'Modul', maxKJPP: 560000, klaim: 550000, status: 'Wajar', cat: 'Di bawah pagu lisensi kementerian' },
  { item: 'Semen Portland Komposit 50kg', satuan: 'Zak', maxKJPP: 80000, klaim: 78000, status: 'Wajar', cat: 'Sesuai survei pasar darurat Aceh Tenggara' },
  { item: 'Besi Beton Ulir D10 SNI', satuan: 'Batang', maxKJPP: 97000, klaim: 95000, status: 'Wajar', cat: 'Terverifikasi sertifikat mutu pabrik' },
  { item: 'Upah Mandor RISHA', satuan: 'Org/Hari', maxKJPP: 175000, klaim: 170000, status: 'Wajar', cat: 'Standar upah tenaga bersertifikat' },
  { item: 'Sewa Excavator PC-75', satuan: 'Jam', maxKJPP: 475000, klaim: 450000, status: 'Wajar', cat: 'Termasuk BBM solar non-subsidi' },
  { item: 'Pasir Cor Pasang Sungai Alas', satuan: 'm³', maxKJPP: 230000, klaim: 260000, status: 'Warning', cat: 'Indikasi selisih +13% di atas batas wajar' }
];

// Main App Controller
class HuntapApp {
  constructor() {
    this.data = this.loadData();
    this.init();
  }

  loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  init() {
    this.renderAll();
    this.updateRoleUI();
    this.setAuthenticated(Boolean(sessionStorage.getItem(AUTH_KEY)));
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  setAuthenticated(authenticated) {
    const login = document.getElementById('loginScreen');
    const shell = document.getElementById('appShell');
    if (login) login.classList.toggle('hidden', authenticated);
    if (shell) shell.classList.toggle('hidden', !authenticated);
    if (authenticated && window.lucide) lucide.createIcons();
  }

  handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value.trim().toLowerCase();
    // Demo account mapping. In production this will be replaced by SSO/API authentication.
    let role = 'teknis';
    if (username.includes('mitra') || username.includes('pengembang')) role = 'pengembang';
    if (username.includes('apip') || username.includes('auditor')) role = 'apip';
    if (username.includes('ppk') || username.includes('pimpinan')) role = 'ppk';
    this.data.currentRole = role;
    this.saveData();
    sessionStorage.setItem(AUTH_KEY, JSON.stringify({ username, role, loggedAt: new Date().toISOString() }));
    this.setAuthenticated(true);
    this.updateRoleUI();
    this.switchTab('dashboard');
    this.showToast(`Selamat datang. Anda masuk sebagai ${this.getRoleName(role)}`);
  }

  demoLogin(role) {
    this.data.currentRole = role;
    this.saveData();
    sessionStorage.setItem(AUTH_KEY, JSON.stringify({ username: `demo-${role}`, role, loggedAt: new Date().toISOString() }));
    this.setAuthenticated(true);
    this.updateRoleUI();
    this.switchTab('dashboard');
    this.showToast(`Mode demo aktif: ${this.getRoleName(role)}`);
  }

  togglePassword() {
    const input = document.getElementById('loginPassword');
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  }

  logout() {
    sessionStorage.removeItem(AUTH_KEY);
    this.setAuthenticated(false);
    this.showToast('Anda telah keluar dari sistem');
  }

  renderAll() {
    this.renderDashboard();
    this.renderClaimsTable();
    this.renderVerificationCards();
    this.renderAuditBenchmark();
    this.renderBAV();
  }

  // Format IDR Currency
  formatIDR(num) {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  }

  // Role Management
  switchRole(role) {
    this.data.currentRole = role;
    this.saveData();
    this.updateRoleUI();
    this.showToast(`Mode pengguna beralih ke: ${this.getRoleName(role)}`);
  }

  getRoleName(role) {
    switch (role) {
      case 'pengembang': return 'Pengembang (Penyedia Terpilih)';
      case 'teknis': return 'Tim Teknis PKP (Verifikator)';
      case 'apip': return 'APIP / BPKP (Auditor Pengawas)';
      case 'ppk': return 'PPK & Pimpinan (Eksekutif)';
      default: return 'Pengguna';
    }
  }

  updateRoleUI() {
    const role = this.data.currentRole;
    const label = document.getElementById('currentRoleLabel');
    const sidebarRoleLabel = document.getElementById('sidebarRoleLabel');
    const selector = document.getElementById('roleSelector');
    const bannerTitle = document.getElementById('roleBannerTitle');
    const bannerDesc = document.getElementById('roleBannerDesc');
    const bannerBox = document.getElementById('roleContextBanner');
    const iconBox = document.getElementById('roleIconBox');

    if (selector) selector.value = role;
    if (label) label.textContent = this.getRoleName(role);
    if (sidebarRoleLabel) sidebarRoleLabel.textContent = this.getRoleName(role).replace(' (Verifikator)', '').replace(' (Auditor Pengawas)', '');

    if (bannerTitle && bannerDesc && bannerBox && iconBox) {
      if (role === 'pengembang') {
        bannerBox.className = 'mb-6 p-4 rounded-xl border border-amber-300 bg-amber-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs no-print';
        iconBox.className = 'w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0';
        bannerTitle.textContent = 'Peran Aktif: Pengembang / Penyedia Terpilih';
        bannerDesc.textContent = 'Anda dapat menginput bukti biaya riil, mengunggah faktur/kuitansi, dan memantau status persetujuan klaim.';
      } else if (role === 'teknis') {
        bannerBox.className = 'mb-6 p-4 rounded-xl border border-blue-200 bg-blue-50/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs no-print';
        iconBox.className = 'w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0';
        bannerTitle.textContent = 'Peran Aktif: Tim Teknis Kementerian PKP';
        bannerDesc.textContent = 'Anda berwenang menguji 3 pilar: Keabsahan dokumen, kepatuhan spesifikasi RISHA/RUSPIN, dan volume fisik opname lapangan.';
      } else if (role === 'apip') {
        bannerBox.className = 'mb-6 p-4 rounded-xl border border-purple-200 bg-purple-50/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs no-print';
        iconBox.className = 'w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0';
        bannerTitle.textContent = 'Peran Aktif: APIP Inspektorat / BPKP';
        bannerDesc.textContent = 'Anda menguji kewajaran harga pasar (Appraisal KJPP), mendeteksi anomali/markup, dan memberikan rekomendasi kelayakan bayar.';
      } else if (role === 'ppk') {
        bannerBox.className = 'mb-6 p-4 rounded-xl border border-slate-300 bg-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs no-print';
        iconBox.className = 'w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0';
        bannerTitle.textContent = 'Peran Aktif: Pejabat Pembuat Komitmen (PPK) & Pimpinan';
        bannerDesc.textContent = 'Anda mengesahkan Berita Acara Verifikasi (BAV), menyetujui perhitungan Fee Pengembang (8%), dan menerbitkan SPP/SPM.';
      }
    }

    const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.teknis;
    document.querySelectorAll('[id^="tab-"]').forEach(tab => {
      const tabId = tab.id.replace('tab-', '');
      tab.classList.toggle('role-hidden', !allowed.includes(tabId));
    });
    document.querySelectorAll('.side-nav-item[data-side-tab]').forEach(item => {
      item.classList.toggle('role-hidden', !allowed.includes(item.dataset.sideTab));
    });
    const canSubmit = role === 'pengembang';
    const canVerify = role === 'teknis';
    const canAudit = role === 'apip';
    const canPrint = role === 'ppk';
    ['newClaimButton'].forEach(id => document.getElementById(id)?.classList.toggle('role-hidden', !canSubmit));
    ['auditClearanceButton'].forEach(id => document.getElementById(id)?.classList.toggle('role-hidden', !canAudit));
    ['quickPrintBav', 'bavPrintButton'].forEach(id => document.getElementById(id)?.classList.toggle('role-hidden', !canPrint));
    document.querySelectorAll('#view-verifikasi input, #view-verifikasi textarea, #view-verifikasi button').forEach(el => el.classList.toggle('role-readonly', !canVerify));
    document.querySelectorAll('#view-audit button').forEach(el => el.classList.toggle('role-readonly', !canAudit));
  }

  // Navigation Tab Switching
  switchTab(tabId) {
    const allowed = ROLE_PERMISSIONS[this.data.currentRole] || ROLE_PERMISSIONS.teknis;
    if (!allowed.includes(tabId)) {
      this.showToast(`Akses menu ini tidak tersedia untuk role ${this.getRoleName(this.data.currentRole)}`);
      return;
    }
    document.querySelectorAll('.tab-view').forEach(view => view.classList.add('hidden'));
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active', 'border-amber-600', 'text-amber-700');
      tab.classList.add('border-transparent', 'text-slate-500');
    });
    document.querySelectorAll('.side-nav-item[data-side-tab]').forEach(item => {
      item.classList.toggle('active', item.dataset.sideTab === tabId);
    });

    const targetView = document.getElementById(`view-${tabId}`);
    const targetTab = document.getElementById(`tab-${tabId}`);

    if (targetView) targetView.classList.remove('hidden');
    if (targetTab) {
      targetTab.classList.add('active', 'border-amber-600', 'text-amber-700');
      targetTab.classList.remove('border-transparent', 'text-slate-500');
    }

    if (window.lucide) lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Calculations
  getTotals() {
    let totalDiajukan = 0;
    let totalDisetujui = 0;
    let approvedCount = 0;
    let pendingCount = 0;

    this.data.claims.forEach(c => {
      totalDiajukan += Number(c.totalDiajukan || 0);
      totalDisetujui += Number(c.totalDisetujui || 0);
      if (c.status === 'Approved') approvedCount++;
      if (c.status === 'Pending' || c.status === 'Flagged') pendingCount++;
    });

    const feeAmount = Math.round(totalDisetujui * (this.data.feePercentage / 100));
    const grandTotalBayar = totalDisetujui + feeAmount;
    const persentaseSah = totalDiajukan > 0 ? ((totalDisetujui / totalDiajukan) * 100).toFixed(1) : '0';

    return {
      totalDiajukan,
      totalDisetujui,
      feeAmount,
      grandTotalBayar,
      persentaseSah,
      approvedCount,
      pendingCount,
      totalCount: this.data.claims.length
    };
  }

  // Render Dashboard
  renderDashboard() {
    const totals = this.getTotals();

    // Summary cards
    document.getElementById('dashDiajukan').textContent = this.formatIDR(totals.totalDiajukan);
    document.getElementById('dashDisetujui').textContent = this.formatIDR(totals.totalDisetujui);
    document.getElementById('dashDisetujuiPersen').textContent = `${totals.persentaseSah}% dari yang diajukan`;
    document.getElementById('dashFee').textContent = this.formatIDR(totals.feeAmount);
    document.getElementById('dashTotalBayar').textContent = this.formatIDR(totals.grandTotalBayar);

    // Badges in Nav
    document.getElementById('badgeClaimCount').textContent = totals.totalCount;
    document.getElementById('badgePendingCount').textContent = `${totals.pendingCount} Antrean`;
    document.getElementById('statPassRate').textContent = `${totals.persentaseSah}%`;

    // Category progress bars
    const categories = ['Lahan', 'Material', 'Upah', 'Peralatan', 'PSU'];
    const catContainer = document.getElementById('componentBreakdownList');
    if (catContainer) {
      catContainer.innerHTML = categories.map(cat => {
        const catClaims = this.data.claims.filter(c => c.komponen === cat);
        const catDiajukan = catClaims.reduce((acc, c) => acc + c.totalDiajukan, 0);
        const catDisetujui = catClaims.reduce((acc, c) => acc + c.totalDisetujui, 0);
        const pct = catDiajukan > 0 ? Math.min(100, Math.round((catDisetujui / catDiajukan) * 100)) : 0;

        return `
          <div>
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-bold text-slate-800">${cat}</span>
              <span class="font-mono text-slate-600">${this.formatIDR(catDisetujui)} / <span class="text-slate-400">${this.formatIDR(catDiajukan)}</span> (${pct}%)</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
              <div class="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Dashboard Recent Table Preview
    const tableBody = document.getElementById('dashTableBody');
    if (tableBody) {
      const recent = this.data.claims.slice(0, 5);
      tableBody.innerHTML = recent.map(c => `
        <tr class="hover:bg-slate-50 transition">
          <td class="py-3 px-4 font-mono font-bold text-slate-700">${c.id}</td>
          <td class="py-3 px-4">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${this.getCategoryBadgeClass(c.komponen)}">${c.komponen}</span>
          </td>
          <td class="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">${c.uraian}</td>
          <td class="py-3 px-4 text-right font-mono text-slate-600">${this.formatIDR(c.totalDiajukan)}</td>
          <td class="py-3 px-4 text-right font-mono font-bold text-emerald-700">${this.formatIDR(c.totalDisetujui)}</td>
          <td class="py-3 px-4 text-center">
            <button onclick="app.previewBukti('${c.id}')" class="text-blue-600 hover:text-blue-800 underline font-semibold text-[11px]">
              ${c.noBukti}
            </button>
          </td>
          <td class="py-3 px-4 text-center">
            ${this.renderStatusBadge(c.status)}
          </td>
        </tr>
      `).join('');
    }
  }

  // Render Full Claims Table
  renderClaimsTable() {
    const filterKomponen = document.getElementById('filterKomponen')?.value || 'all';
    const filterStatus = document.getElementById('filterStatus')?.value || 'all';
    const tableBody = document.getElementById('fullClaimsTableBody');

    if (!tableBody) return;

    let filtered = this.data.claims.filter(c => {
      if (filterKomponen !== 'all' && c.komponen !== filterKomponen) return false;
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
      return true;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="10" class="py-8 text-center text-slate-400">Tidak ada bukti pengeluaran yang sesuai kriteria filter.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(c => `
      <tr class="hover:bg-slate-50 transition">
        <td class="py-3 px-4">
          <div class="font-mono font-bold text-slate-900">${c.id}</div>
          <div class="text-[10px] text-slate-400">${c.tanggal}</div>
        </td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${this.getCategoryBadgeClass(c.komponen)}">${c.komponen}</span>
        </td>
        <td class="py-3 px-4 text-slate-800">
          <div class="font-bold">${c.uraian}</div>
          <div class="text-[11px] text-slate-500">${c.penyedia}</div>
        </td>
        <td class="py-3 px-4 text-slate-600 font-mono text-[11px]">${c.penyedia}</td>
        <td class="py-3 px-4 text-right font-mono">${c.volume.toLocaleString('id-ID')} ${c.satuan}</td>
        <td class="py-3 px-4 text-right font-mono">${this.formatIDR(c.hargaSatuan)}</td>
        <td class="py-3 px-4 text-right font-mono font-bold text-slate-900">${this.formatIDR(c.totalDiajukan)}</td>
        <td class="py-3 px-4 text-center">
          <button onclick="app.previewBukti('${c.id}')" class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono flex items-center justify-center gap-1 mx-auto transition">
            <i data-lucide="file-text" class="w-3 h-3"></i> ${c.noBukti}
          </button>
        </td>
        <td class="py-3 px-4 text-center">
          ${this.renderStatusBadge(c.status)}
        </td>
        <td class="py-3 px-4 text-center">
          <button onclick="app.switchTab('verifikasi')" class="text-xs text-amber-600 hover:text-amber-800 font-bold">
            Uji Teknis
          </button>
        </td>
      </tr>
    `).join('');

    if (window.lucide) lucide.createIcons();
  }

  // Render 3-Pillar Verification Cards
  renderVerificationCards() {
    const container = document.getElementById('verificationCardList');
    if (!container) return;

    container.innerHTML = this.data.claims.map(c => `
      <div class="bg-white rounded-xl p-5 border ${c.status === 'Approved' ? 'border-emerald-200 bg-emerald-50/20' : c.status === 'Flagged' ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'} shadow-sm space-y-4">
        
        <!-- Header Item -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="font-mono text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-700">${c.id}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${this.getCategoryBadgeClass(c.komponen)}">${c.komponen}</span>
            <h3 class="text-sm font-bold text-slate-900">${c.uraian}</h3>
          </div>
          <div class="flex items-center gap-4 text-xs font-mono">
            <div>
              <span class="text-slate-400 text-[10px] block">Klaim Diajukan:</span>
              <span class="font-bold text-slate-800">${this.formatIDR(c.totalDiajukan)}</span>
            </div>
            <div>
              <span class="text-slate-400 text-[10px] block">Nilai Disetujui:</span>
              <span class="font-bold text-emerald-700 text-sm">${this.formatIDR(c.totalDisetujui)}</span>
            </div>
            <div>
              ${this.renderStatusBadge(c.status)}
            </div>
          </div>
        </div>

        <!-- 3 Pillars Checklist Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs border border-slate-200">
          
          <!-- Pilar 1 -->
          <label class="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 cursor-pointer transition">
            <input type="checkbox" ${c.checklist.dokumenSah ? 'checked' : ''} onchange="app.toggleChecklist('${c.id}', 'dokumenSah', this.checked)" class="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
            <div>
              <span class="font-bold text-slate-800 block">Pilar 1: Keabsahan Administratif</span>
              <span class="text-[11px] text-slate-500 block">Faktur sah, nota bermeterai/cap basah, bukti lunas transaksi transfer/kuitansi.</span>
            </div>
          </label>

          <!-- Pilar 2 -->
          <label class="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 cursor-pointer transition">
            <input type="checkbox" ${c.checklist.spekTeknis ? 'checked' : ''} onchange="app.toggleChecklist('${c.id}', 'spekTeknis', this.checked)" class="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
            <div>
              <span class="font-bold text-slate-800 block">Pilar 2: Spesifikasi Teknis RISHA</span>
              <span class="text-[11px] text-slate-500 block">Kesesuaian mutu SNI, sertifikat uji lab mutu beton modul tahan gempa RISHA/RUSPIN.</span>
            </div>
          </label>

          <!-- Pilar 3 -->
          <label class="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 cursor-pointer transition">
            <input type="checkbox" ${c.checklist.fisikTerpasang ? 'checked' : ''} onchange="app.toggleChecklist('${c.id}', 'fisikTerpasang', this.checked)" class="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
            <div>
              <span class="font-bold text-slate-800 block">Pilar 3: Opname Fisik Lapangan</span>
              <span class="text-[11px] text-slate-500 block">Pengecekan fisik 40 unit di tapak, volume material benar-benar terpasang di site.</span>
            </div>
          </label>

        </div>

        <!-- Action Bar & Notes -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs">
          <div class="text-slate-600 flex items-center gap-1.5">
            <i data-lucide="message-square" class="w-4 h-4 text-slate-400"></i>
            <span class="font-semibold">Catatan Verifikasi:</span>
            <input type="text" value="${c.catatanVerifikasi || ''}" onchange="app.updateCatatan('${c.id}', this.value)" placeholder="Tambahkan catatan hasil uji lapangan..." class="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs w-72 md:w-96 focus:ring-1 focus:ring-blue-500">
          </div>

          <div class="flex items-center gap-2">
            <button onclick="app.setClaimStatus('${c.id}', 'Approved')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 transition">
              <i data-lucide="check" class="w-3.5 h-3.5"></i> Setujui Penuh
            </button>
            <button onclick="app.openKoreksiModal('${c.id}')" class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-1 transition">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Koreksi Nilai
            </button>
            <button onclick="app.setClaimStatus('${c.id}', 'Rejected')" class="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1 transition">
              <i data-lucide="x" class="w-3.5 h-3.5"></i> Tolak
            </button>
          </div>
        </div>

      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  }

  // Render Benchmark Audit Table
  renderAuditBenchmark() {
    const tableBody = document.getElementById('benchmarkTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = BENCHMARK_DATA.map(b => {
      const deviasi = (((b.klaim - b.maxKJPP) / b.maxKJPP) * 100).toFixed(1);
      const isOver = b.klaim > b.maxKJPP;
      return `
        <tr class="hover:bg-slate-50 transition">
          <td class="py-3 px-4 font-bold text-slate-900">${b.item}</td>
          <td class="py-3 px-4 text-slate-500 font-mono">${b.satuan}</td>
          <td class="py-3 px-4 text-right font-mono text-slate-700">${this.formatIDR(b.maxKJPP)}</td>
          <td class="py-3 px-4 text-right font-mono font-bold ${isOver ? 'text-rose-600' : 'text-slate-900'}">${this.formatIDR(b.klaim)}</td>
          <td class="py-3 px-4 text-center font-mono ${isOver ? 'text-rose-600 font-bold' : 'text-emerald-700'}">
            ${deviasi > 0 ? '+' + deviasi : deviasi}%
          </td>
          <td class="py-3 px-4 text-center">
            ${isOver ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Red Flag / Warning</span>' : '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Harga Wajar</span>'}
          </td>
          <td class="py-3 px-4 text-xs text-slate-600">${b.cat}</td>
        </tr>
      `;
    }).join('');
  }

  // Render Printable Berita Acara (BAV)
  renderBAV() {
    const totals = this.getTotals();
    const bavBody = document.getElementById('bavTableBody');
    if (!bavBody) return;

    const categories = ['Lahan', 'Material', 'Upah', 'Peralatan', 'PSU'];
    let counter = 1;

    bavBody.innerHTML = categories.map(cat => {
      const catClaims = this.data.claims.filter(c => c.komponen === cat);
      const catDiajukan = catClaims.reduce((acc, c) => acc + c.totalDiajukan, 0);
      const catDisetujui = catClaims.reduce((acc, c) => acc + c.totalDisetujui, 0);

      let catatanTeknis = 'Telah diverifikasi sesuai bukti sah faktur/kuitansi & opname lapangan.';
      if (cat === 'Lahan') catatanTeknis = 'Berdasarkan Akta Pelepasan Hak & Nilai Wajar KJPP.';
      if (cat === 'Material') catatanTeknis = 'Uji mutu modul RISHA/RUSPIN dan material SNI.';

      return `
        <tr>
          <td class="border border-slate-400 p-2 text-center font-mono">${counter++}</td>
          <td class="border border-slate-400 p-2 font-bold">${cat} (Huntap 40 Unit)</td>
          <td class="border border-slate-400 p-2 text-right font-mono">${this.formatIDR(catDiajukan)}</td>
          <td class="border border-slate-400 p-2 text-right font-mono font-bold">${this.formatIDR(catDisetujui)}</td>
          <td class="border border-slate-400 p-2 text-[11px] text-slate-700">${catatanTeknis}</td>
        </tr>
      `;
    }).join('');

    document.getElementById('bavTotalDiajukan').textContent = this.formatIDR(totals.totalDiajukan);
    document.getElementById('bavTotalSah').textContent = this.formatIDR(totals.totalDisetujui);
    document.getElementById('bavFeeTetap').textContent = this.formatIDR(totals.feeAmount);
    document.getElementById('bavGrandTotal').textContent = this.formatIDR(totals.grandTotalBayar);
  }

  // Interactive Actions
  toggleChecklist(claimId, pillar, isChecked) {
    const claim = this.data.claims.find(c => c.id === claimId);
    if (!claim) return;

    claim.checklist[pillar] = isChecked;

    // Auto update status if all pillars checked
    if (claim.checklist.dokumenSah && claim.checklist.spekTeknis && claim.checklist.fisikTerpasang) {
      claim.status = 'Approved';
      claim.totalDisetujui = claim.totalDiajukan;
    } else if (!claim.checklist.dokumenSah || !claim.checklist.fisikTerpasang) {
      claim.status = 'Flagged';
    }

    this.saveData();
    this.renderAll();
    this.showToast(`Checklist ${pillar} diperbarui untuk ${claimId}`);
  }

  setClaimStatus(claimId, status) {
    const claim = this.data.claims.find(c => c.id === claimId);
    if (!claim) return;

    claim.status = status;
    if (status === 'Approved') {
      claim.totalDisetujui = claim.totalDiajukan;
      claim.checklist.dokumenSah = true;
      claim.checklist.spekTeknis = true;
      claim.checklist.fisikTerpasang = true;
    } else if (status === 'Rejected') {
      claim.totalDisetujui = 0;
    }

    this.saveData();
    this.renderAll();
    this.showToast(`Status klaim ${claimId} diubah menjadi: ${status}`);
  }

  openKoreksiModal(claimId) {
    const claim = this.data.claims.find(c => c.id === claimId);
    if (!claim) return;

    const nilaiBaru = prompt(`Masukkan nilai biaya riil yang disetujui (Rp) untuk:\n${claim.uraian}\n(Nilai diajukan: ${this.formatIDR(claim.totalDiajukan)})`, claim.totalDisetujui);
    if (nilaiBaru !== null) {
      const parsed = parseInt(nilaiBaru.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed)) {
        claim.totalDisetujui = parsed;
        claim.status = parsed < claim.totalDiajukan ? 'Flagged' : 'Approved';
        this.saveData();
        this.renderAll();
        this.showToast(`Nilai disetujui dikoreksi menjadi ${this.formatIDR(parsed)}`);
      }
    }
  }

  updateCatatan(claimId, val) {
    const claim = this.data.claims.find(c => c.id === claimId);
    if (claim) {
      claim.catatanVerifikasi = val;
      this.saveData();
    }
  }

  // Claim Modal Handling
  openNewClaimModal() {
    document.getElementById('newClaimModal').classList.remove('hidden');
    document.getElementById('newClaimForm').reset();
    document.getElementById('formTotalDisplay').textContent = 'Rp 0';
  }

  closeNewClaimModal() {
    document.getElementById('newClaimModal').classList.add('hidden');
  }

  calculateFormTotal() {
    const vol = parseFloat(document.getElementById('formVolume').value) || 0;
    const hrg = parseFloat(document.getElementById('formHarga').value) || 0;
    const total = vol * hrg;
    document.getElementById('formTotalDisplay').textContent = this.formatIDR(total);
  }

  handleNewClaimSubmit(e) {
    e.preventDefault();
    const komponen = document.getElementById('formKomponen').value;
    const noBukti = document.getElementById('formNoBukti').value.trim();
    const uraian = document.getElementById('formUraian').value.trim();
    const penyedia = document.getElementById('formPenyedia').value.trim();
    const tanggal = document.getElementById('formTanggal').value;
    const volume = parseFloat(document.getElementById('formVolume').value) || 1;
    const satuan = document.getElementById('formSatuan').value.trim();
    const hargaSatuan = parseFloat(document.getElementById('formHarga').value) || 0;
    const totalDiajukan = volume * hargaSatuan;

    // Check duplicate invoice number
    const isDup = this.data.claims.some(c => c.noBukti.toLowerCase() === noBukti.toLowerCase());
    if (isDup) {
      alert(`Peringatan Audit (Anti-Double Claim): Nomor bukti "${noBukti}" sudah pernah dicatat di sistem! Silakan periksa kembali.`);
      return;
    }

    const newId = `CLM-00${this.data.claims.length + 1}`;
    const newClaim = {
      id: newId,
      tanggal,
      komponen,
      uraian,
      penyedia,
      noBukti,
      volume,
      satuan,
      hargaSatuan,
      totalDiajukan,
      totalDisetujui: totalDiajukan, // Default pending review
      status: 'Pending',
      buktiDetail: {
        jenis: 'Faktur & Nota Digital Terunggah',
        appraisalKJPP: 'Dalam proses pengujian batas wajar harga',
        catatan: 'Pengajuan baru dari mitra pengembang.'
      },
      checklist: {
        dokumenSah: false,
        spekTeknis: true,
        fisikTerpasang: false
      },
      catatanVerifikasi: 'Menunggu verifikasi lapangan oleh Tim Teknis PKP.'
    };

    this.data.claims.push(newClaim);
    this.saveData();
    this.closeNewClaimModal();
    this.renderAll();
    this.showToast(`Klaim baru ${newId} berhasil diajukan!`);
  }

  // Preview Bukti Modal
  previewBukti(claimId) {
    const claim = this.data.claims.find(c => c.id === claimId);
    if (!claim) return;

    const modal = document.getElementById('previewBuktiModal');
    const title = document.getElementById('buktiModalTitle');
    const body = document.getElementById('buktiModalBody');

    title.textContent = `Bukti Transaksi Sah: ${claim.noBukti}`;
    body.innerHTML = `
      <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <span class="text-slate-400 block text-[10px] uppercase font-bold">Uraian Transaksi</span>
        <span class="font-bold text-slate-900 text-sm">${claim.uraian}</span>
        <div class="mt-1 flex items-center justify-between text-xs text-slate-600">
          <span>Penyedia: <b>${claim.penyedia}</b></span>
          <span class="font-mono text-emerald-700 font-bold">${this.formatIDR(claim.totalDiajukan)}</span>
        </div>
      </div>

      <div class="space-y-2 text-xs">
        <div>
          <span class="text-slate-500 font-semibold block">Jenis Dokumen Pendukung:</span>
          <span class="text-slate-800 font-medium">${claim.buktiDetail?.jenis || 'Faktur / Kuitansi Sah'}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block">Catatan Uji Kewajaran KJPP / APIP:</span>
          <span class="text-slate-800 font-medium">${claim.buktiDetail?.appraisalKJPP || 'Memenuhi toleransi pasar darurat'}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block">Status Legalitas Lahan & Fisik:</span>
          <span class="text-slate-800 font-medium">${claim.buktiDetail?.catatan || '-'}</span>
        </div>
      </div>

      <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-900">
        <i data-lucide="shield-check" class="w-5 h-5 text-blue-600 shrink-0"></i>
        <span class="text-[11px]">Tercatat dalam Ledger Digital PBJ Darurat LKPP No. 6/2024. Dokumen tersimpan aman.</span>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }

  closeBuktiModal() {
    document.getElementById('previewBuktiModal').classList.add('hidden');
  }

  // Issue Audit Clearance APIP
  issueAuditClearance() {
    this.data.auditClearanceIssued = true;
    this.saveData();
    alert(`AUDIT CLEARANCE DITERBITKAN!\n\nNomor Registrasi: ${this.data.auditRegNumber}\nLembaga: Inspektorat Jenderal Kementerian PKP & BPKP\n\nSeluruh uji kewajaran harga dan kepatuhan 4 tahapan lahan telah dinyatakan MEMENUHI SYARAT untuk pembayaran termin.`);
    this.showToast('Audit Clearance APIP berhasil disahkan!');
  }

  printBeritaAcara() {
    this.switchTab('bav');
    setTimeout(() => {
      window.print();
    }, 300);
  }

  // Helper Badges
  getCategoryBadgeClass(cat) {
    switch (cat) {
      case 'Lahan': return 'bg-emerald-100 text-emerald-800';
      case 'Material': return 'bg-blue-100 text-blue-800';
      case 'Upah': return 'bg-amber-100 text-amber-800';
      case 'Peralatan': return 'bg-purple-100 text-purple-800';
      case 'PSU': return 'bg-teal-100 text-teal-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  renderStatusBadge(status) {
    if (status === 'Approved') {
      return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Disetujui Sah</span>';
    } else if (status === 'Flagged') {
      return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Perlu Revisi</span>';
    } else if (status === 'Rejected') {
      return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Ditolak</span>';
    } else {
      return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Menunggu Uji</span>';
    }
  }

  // Modal Buka di HP
  openHpModal() {
    const modal = document.getElementById('hpModal');
    if (modal) {
      modal.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }
  }

  closeHpModal() {
    const modal = document.getElementById('hpModal');
    if (modal) modal.classList.add('hidden');
  }

  copyHpUrl() {
    const input = document.getElementById('hpUrlInput');
    if (input) {
      input.select();
      navigator.clipboard.writeText(input.value).then(() => {
        this.showToast('Link HP berhasil disalin ke clipboard!');
      }).catch(() => {
        this.showToast('Gunakan alamat: ' + input.value);
      });
    }
  }

  showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.remove('translate-y-2');

    setTimeout(() => {
      toast.classList.add('translate-y-2');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
  }
}

// Global App Instance
const app = new HuntapApp();
