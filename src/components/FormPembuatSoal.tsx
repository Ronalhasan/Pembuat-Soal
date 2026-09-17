import React, { useState, useEffect } from "react";
import {
  JENJANG_OPTIONS,
  KELAS_OPTIONS,
  MAPEL_SMA,
  MAPEL_MA,
  MAPEL_SMK,
  TIPE_SOAL_OPTIONS,
  LEVEL_KOGNITIF_OPTIONS
} from "../data/subjectOptions";
import {
  Sparkles,
  Loader2,
  FileDown,
  Globe,
  IdCard,
  Layers,
  BookMarked,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export interface FormValues {
  jenjang: string;
  kelas: string;
  mataPelajaran: string;
  topik: string;
  tipeSoal: string;
  jumlahSoal: number;
  levelKognitif: string;
  semester?: string;
}

interface FormPembuatSoalProps {
  onGenerate: (values: FormValues) => Promise<void>;
  isLoading: boolean;
  hasData: boolean;
  onDownloadDoc: () => void;
  onOpenHtmlQuiz: () => void;
  onOpenKartuSoal: () => void;
}

export const FormPembuatSoal: React.FC<FormPembuatSoalProps> = ({
  onGenerate,
  isLoading,
  hasData,
  onDownloadDoc,
  onOpenHtmlQuiz,
  onOpenKartuSoal
}) => {
  const [jenjang, setJenjang] = useState<string>("SMA");
  const [kelas, setKelas] = useState<string>("Kelas 10");
  const [mataPelajaran, setMataPelajaran] = useState<string>("Bahasa Indonesia");
  const [topik, setTopik] = useState<string>("");
  const [tipeSoal, setTipeSoal] = useState<string>(
    "Pilihan Ganda dengan alternatif jawaban ada 5"
  );
  const [jumlahSoal, setJumlahSoal] = useState<number>(5);
  const [levelKognitif, setLevelKognitif] = useState<string>(
    "Level Standar (Campuran C1-C4) untuk PTS/PAS dan Ujian Umum"
  );
  const [semester, setSemester] = useState<string>("Semester Ganjil");

  // Update mapel options dynamically based on Jenjang
  const currentMapelList =
    jenjang === "SMA" ? MAPEL_SMA :
    jenjang === "MA" ? MAPEL_MA : MAPEL_SMK;

  useEffect(() => {
    if (!currentMapelList.includes(mataPelajaran)) {
      setMataPelajaran(currentMapelList[0] || "Bahasa Indonesia");
    }
  }, [jenjang, currentMapelList, mataPelajaran]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      jenjang,
      kelas,
      mataPelajaran,
      topik,
      tipeSoal,
      jumlahSoal,
      levelKognitif,
      semester
    });
  };

  // Generate numbers 1 through 50
  const jumlahOptions = Array.from({ length: 50 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 px-6 py-5 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-200" />
              Pengaturan Pembuatan Soal & Kisi-Kisi
            </h2>
            <p className="text-xs text-blue-100 mt-1">
              Isi parameter di bawah ini untuk menghasilkan naskah soal berstandar nasional lengkap dengan kunci terpisah, kisi-kisi tabel, dan kartu soal.
            </p>
          </div>
          <div className="text-xs px-3 py-1 bg-white/10 rounded-full backdrop-blur-xs self-start sm:self-auto font-medium text-blue-50 border border-white/15">
            By Ronal Hasan
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {/* Kolom Pertama: Jenjang Pendidikan [SMA/MA/SMK] */}
          <div className="space-y-1.5">
            <label htmlFor="kolom-jenjang" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Jenjang Pendidikan
            </label>
            <select
              id="kolom-jenjang"
              value={jenjang}
              onChange={(e) => setJenjang(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all hover:bg-white"
            >
              {JENJANG_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 block">Pilihan: SMA / MA / SMK</span>
          </div>

          {/* Kolom Kedua: Kelas [Kelas 10 - Kelas 12] */}
          <div className="space-y-1.5">
            <label htmlFor="kolom-kelas" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Tingkat Kelas
            </label>
            <select
              id="kolom-kelas"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all hover:bg-white"
            >
              {KELAS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 block">Pilihan: Kelas 10 sampai Kelas 12</span>
          </div>

          {/* Kolom Ketiga: Mata Pelajaran */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
            <label htmlFor="kolom-mapel" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Mata Pelajaran ({jenjang})
            </label>
            <select
              id="kolom-mapel"
              value={mataPelajaran}
              onChange={(e) => setMataPelajaran(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all hover:bg-white"
            >
              {currentMapelList.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 block">
              {jenjang === "SMA"
                ? "Daftar mapel SMA terstandar lengkap"
                : `Daftar mapel disesuaikan untuk ${jenjang}`}
            </span>
          </div>

          {/* Kolom Keempat: Topik/Materi Spesifik */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
            <label htmlFor="kolom-topik" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              4. Topik / Materi Spesifik
            </label>
            <input
              id="kolom-topik"
              type="text"
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              placeholder="Contoh: Teks Eksplanasi, Hukum Newton, dsb."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all hover:bg-white placeholder:text-slate-400"
            />
            <span className="text-[11px] text-slate-500 block">Isikan bahasan/materi yang diujikan</span>
          </div>

          {/* Kolom Kelima: Tipe Soal */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
            <label htmlFor="kolom-tipe-soal" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              5. Tipe Soal
            </label>
            <select
              id="kolom-tipe-soal"
              value={tipeSoal}
              onChange={(e) => setTipeSoal(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all hover:bg-white"
            >
              {TIPE_SOAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 block">
              10 Format: Pilihan Ganda (3, 4, 5 opsi), Kompleks, Menjodohkan, B/S, Isian, Esai, atau Campuran
            </span>
          </div>

          {/* Kolom Keenam: Jumlah Soal (1 sampai 50) */}
          <div className="space-y-1.5">
            <label htmlFor="kolom-jumlah" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              6. Jumlah Soal (1 - 50)
            </label>
            <select
              id="kolom-jumlah"
              value={jumlahSoal}
              onChange={(e) => setJumlahSoal(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all hover:bg-white"
            >
              {jumlahOptions.map((num) => (
                <option key={num} value={num}>
                  {num} Butir Soal
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 block">Pilihan antara 1 sampai 50 butir</span>
          </div>

          {/* Kolom Ketujuh: Tingkat Kesulitan / Level Kognitif */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
            <label htmlFor="kolom-level" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              7. Level Kognitif
            </label>
            <select
              id="kolom-level"
              value={levelKognitif}
              onChange={(e) => setLevelKognitif(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all hover:bg-white"
            >
              {LEVEL_KOGNITIF_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 block">Dasar (C1-C2), Standar (C1-C4), HOTS, atau Paket Lengkap</span>
          </div>
        </div>

        {/* Status Message when generating */}
        {isLoading && (
          <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3 animate-pulse">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Pesan: Sedang Proses Pembuatan Soal...
              </p>
              <p className="text-xs text-blue-700">
                Mohon tunggu, sistem sedang menyusun naskah soal {mataPelajaran} ({jumlahSoal} butir), kisi-kisi dalam tabel, kunci jawaban terpisah, dan kartu soal.
              </p>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Tombol Buat Soal */}
            <button
              type="submit"
              disabled={isLoading}
              id="btn-buat-soal"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sedang Proses...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Buat Soal</span>
                </>
              )}
            </button>

            {hasData && (
              <>
                {/* Tombol Download ke .doc */}
                <button
                  type="button"
                  onClick={onDownloadDoc}
                  id="btn-download-doc"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
                  title="Download naskah soal lengkap ke format Microsoft Word .doc"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download .doc</span>
                </button>

                {/* Tombol html agar bisa dibuat interaktif */}
                <button
                  type="button"
                  onClick={onOpenHtmlQuiz}
                  id="btn-html-interaktif"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
                  title="Jalankan atau ekspor kuis interaktif HTML"
                >
                  <Globe className="w-4 h-4" />
                  <span>Tombol HTML Interaktif</span>
                </button>

                {/* Tombol Kartu Soal */}
                <button
                  type="button"
                  onClick={onOpenKartuSoal}
                  id="btn-kartu-soal"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
                  title="Buka format kartu soal terstruktur"
                >
                  <IdCard className="w-4 h-4" />
                  <span>Tombol Kartu Soal</span>
                </button>
              </>
            )}
          </div>

          {hasData && (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Soal berhasil dibuat tanpa simbol pagar (#) atau bintang (*)</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
