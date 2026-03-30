export type DonationPresetId =
  | "20k"
  | "50k"
  | "100k"
  | "200k"
  | "500k"
  | "custom";

export interface DonationPreset {
  id: DonationPresetId;
  amount: number | null;
  label: string;
  description: string;
}

export const DONATION_PRESETS: DonationPreset[] = [
  {
    id: "20k",
    amount: 20000,
    label: "Rp20.000",
    description: "Setara 1 kopi",
  },
  {
    id: "50k",
    amount: 50000,
    label: "Rp50.000",
    description: "Bantu biaya server 1 hari",
  },
  {
    id: "100k",
    amount: 100000,
    label: "Rp100.000",
    description: "Bantu pengembangan fitur baru",
  },
  {
    id: "200k",
    amount: 200000,
    label: "Rp200.000",
    description: "Support jangka panjang",
  },
  {
    id: "500k",
    amount: 500000,
    label: "Rp500.000",
    description: "Bantu cover biaya bulanan",
  },
  {
    id: "custom",
    amount: null,
    label: "Nominal lain",
    description: "Kamu yang tentukan",
  },
];

export type BankKey = "bca" | "bri" | "bni" | "mandiri" | "lain";

export interface BankGuideStep {
  text: string;
  highlightNumber?: boolean;
}

export interface BankGuide {
  id: BankKey;
  label: string;
  title: string;
  steps: BankGuideStep[];
}

export const BANK_GUIDES: BankGuide[] = [
  {
    id: "bca",
    label: "BCA",
    title: "1. Dari bank BCA",
    steps: [
      { text: "Buka aplikasi myBCA / m-BCA / ATM BCA." },
      { text: "Pilih menu Transfer > ke Virtual Account / e-Wallet." },
      {
        text: "Pilih tujuan GoPay (jika ada) atau masukkan kode sesuai petunjuk di aplikasi bank.",
      },
      { text: "Masukkan nomor GoPay:", highlightNumber: true },
      { text: "Masukkan nominal donasi sesuai yang tertera." },
      { text: "Periksa detail, lalu konfirmasi dan selesaikan transaksi." },
    ],
  },
  {
    id: "bri",
    label: "BRI",
    title: "2. Dari bank BRI",
    steps: [
      { text: "Buka BRImo / Internet Banking / ATM BRI." },
      { text: "Pilih menu Pembayaran / e-Wallet / BRIVA." },
      { text: "Pilih atau cari tujuan GoPay." },
      { text: "Masukkan nomor GoPay:", highlightNumber: true },
      {
        text: "Isi nominal donasi, lalu lanjutkan hingga pembayaran berhasil.",
      },
    ],
  },
  {
    id: "bni",
    label: "BNI",
    title: "3. Dari bank BNI",
    steps: [
      { text: "Buka aplikasi BNI Mobile Banking atau gunakan ATM BNI." },
      { text: "Pilih menu e-Wallet / Pembayaran." },
      { text: "Pilih tujuan GoPay bila tersedia." },
      { text: "Masukkan nomor GoPay:", highlightNumber: true },
      { text: "Masukkan jumlah donasi dan konfirmasi transaksi." },
    ],
  },
  {
    id: "mandiri",
    label: "Mandiri",
    title: "4. Dari bank Mandiri",
    steps: [
      { text: "Buka Livin' by Mandiri atau ATM Mandiri." },
      { text: "Pilih menu Bayar / e-Wallet." },
      { text: "Pilih GoPay sebagai tujuan." },
      { text: "Masukkan nomor GoPay:", highlightNumber: true },
      { text: "Isi nominal donasi dan selesaikan pembayaran." },
    ],
  },
  {
    id: "lain",
    label: "Bank lain",
    title: "5. Dari bank lain",
    steps: [
      {
        text: "Buka aplikasi mobile banking / internet banking / ATM bank kamu.",
      },
      {
        text: "Cari menu e-Wallet / Dompet Digital / Virtual Account.",
      },
      { text: "Pilih tujuan GoPay bila tersedia." },
      { text: "Masukkan nomor GoPay:", highlightNumber: true },
      { text: "Isi nominal donasi lalu lanjutkan hingga transaksi berhasil." },
    ],
  },
];

export const GOPAY_NUMBER = "081398632939";
