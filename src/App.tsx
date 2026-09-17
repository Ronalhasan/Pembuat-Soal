/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Header } from "./components/Header";
import { FormPembuatSoal, FormValues } from "./components/FormPembuatSoal";
import { KisiKisiTable } from "./components/KisiKisiTable";
import { NaskahSoalView } from "./components/NaskahSoalView";
import { KunciJawabanView } from "./components/KunciJawabanView";
import { KartuSoalView } from "./components/KartuSoalView";
import { InteractiveQuizView } from "./components/InteractiveQuizView";
import { PaketSoalResponse, ViewTab } from "./types";
import { downloadWordDocument } from "./utils/docExporter";
import { downloadInteractiveHtml } from "./utils/htmlQuizExporter";
import {
  FileText,
  KeyRound,
  Table,
  IdCard,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

// Default initial starter package
const INITIAL_DATA: PaketSoalResponse = {
  meta: {
    jenjang: "SMA",
    kelas: "Kelas 10",
    mataPelajaran: "Bahasa Indonesia",
    topik: "Teks Laporan Hasil Observasi (LHO)",
    tipeSoal: "Pilihan Ganda dengan alternatif jawaban ada 5",
    jumlahSoal: 5,
    levelKognitif: "Level Standar (Campuran C1-C4) untuk PTS/PAS dan Ujian Umum",
    tahunAjaran: "2025/2026",
    semester: "Semester Ganjil"
  },
  kisiKisi: [
    {
      no: 1,
      tujuanPembelajaran: "Peserta didik mampu mengidentifikasi karakteristik dan struktur utama teks laporan hasil observasi.",
      materi: "Struktur Teks Laporan Hasil Observasi",
      indikatorSoal: "Disajikan kutipan teks LHO, peserta didik dapat menentukan bagian struktur definisi umum dengan tepat.",
      levelKognitif: "C1 (Mengingat)",
      bentukSoal: "Pilihan Ganda",
      nomorSoal: 1
    },
    {
      no: 2,
      tujuanPembelajaran: "Peserta didik mampu membedakan kalimat definisi dan kalimat deskripsi dalam teks laporan hasil observasi.",
      materi: "Ciri Kebahasaan Teks LHO",
      indikatorSoal: "Disajikan beberapa contoh kalimat, peserta didik dapat memilih kalimat yang merupakan kalimat definisi secara tepat.",
      levelKognitif: "C2 (Memahami)",
      bentukSoal: "Pilihan Ganda",
      nomorSoal: 2
    },
    {
      no: 3,
      tujuanPembelajaran: "Peserta didik mampu menganalisis keakuratan data dan fakta objektif dalam teks laporan hasil observasi.",
      materi: "Fakta dan Opini dalam Teks LHO",
      indikatorSoal: "Disajikan sebuah paragraf observasi lingkungan, peserta didik dapat menemukan kalimat yang mengandung fakta objektif.",
      levelKognitif: "C3 (Menerapkan)",
      bentukSoal: "Pilihan Ganda",
      nomorSoal: 3
    },
    {
      no: 4,
      tujuanPembelajaran: "Peserta didik mampu mengevaluasi kesalahan penggunaan kaidah kebahasaan pada teks laporan hasil observasi.",
      materi: "Kaidah Kebahasaan (Kata Berimbuhan & Istilah Ilmiah)",
      indikatorSoal: "Disajikan kalimat yang memuat istilah teknis dan imbuhan, peserta didik dapat mengidentifikasi penulisan yang tepat.",
      levelKognitif: "C4 (Menganalisis)",
      bentukSoal: "Pilihan Ganda",
      nomorSoal: 4
    },
    {
      no: 5,
      tujuanPembelajaran: "Peserta didik mampu menyimpulkan pesan dan fungsi sosial dari teks laporan hasil observasi bertema kelestarian hayati.",
      materi: "Fungsi dan Manfaat Teks LHO",
      indikatorSoal: "Disajikan kutipan observasi tentang ekosistem mangrove, peserta didik dapat menyimpulkan fungsi penting keberadaan mangrove bagi lingkungan pesisir.",
      levelKognitif: "C4 (Menganalisis)",
      bentukSoal: "Pilihan Ganda",
      nomorSoal: 5
    }
  ],
  soalList: [
    {
      nomorSoal: 1,
      bentukSoal: "Pilihan Ganda",
      rumusanSoal: "Perhatikan kutipan teks berikut:\n\nBelalang anggrek (Hymenopus coronatus) adalah salah satu jenis belalang sentadu yang memiliki kemampuan kamuflase luar biasa menyerupai mahkota bunga anggrek. Serangga ini umumnya hidup di kawasan hutan hujan tropis Asia Tenggara.\n\nDalam struktur teks laporan hasil observasi, kutipan di atas menempati bagian...",
      pilihan: [
        "A. Definisi umum (pernyataan umum)",
        "B. Deskripsi bagian rinci",
        "C. Deskripsi manfaat",
        "D. Penegasan ulang dan kesimpulan",
        "E. Rekomendasi penulis"
      ],
      kunciJawaban: "A",
      pembahasan: "Kutipan teks tersebut memuat pengenalan objek secara umum dengan kata kopula 'adalah', yang merupakan ciri khas bagian definisi umum atau pernyataan umum.",
      tujuanPembelajaran: "Peserta didik mampu mengidentifikasi karakteristik dan struktur utama teks laporan hasil observasi.",
      materi: "Struktur Teks Laporan Hasil Observasi",
      indikatorSoal: "Disajikan kutipan teks LHO, peserta didik dapat menentukan bagian struktur definisi umum dengan tepat.",
      levelKognitif: "C1 (Mengingat)"
    },
    {
      nomorSoal: 2,
      bentukSoal: "Pilihan Ganda",
      rumusanSoal: "Manakah di antara kalimat-kalimat berikut yang merupakan contoh kalimat definisi?",
      pilihan: [
        "A. Burung merak jantan memiliki ekor panjang berbulu indah dengan corak mata yang memikat.",
        "B. Karang penghalang besar membentang ribuan kilometer di lepas pantai timur laut Australia.",
        "C. Fotosintesis adalah proses biokimia pembentukan karbohidrat dari bahan anorganik dengan bantuan energi cahaya matahari.",
        "D. Bunga bangkai mengeluarkan aroma menyengat ketika mekar sempurna pada sore hari.",
        "E. Daun tanaman kantong semar menghasilkan cairan manis untuk memikat serangga mangsa."
      ],
      kunciJawaban: "C",
      pembahasan: "Kalimat C menggunakan kata relasional 'adalah' untuk menerangkan konsep esensial mengenai fotosintesis, sehingga tergolong ke dalam kalimat definisi.",
      tujuanPembelajaran: "Peserta didik mampu membedakan kalimat definisi dan kalimat deskripsi dalam teks laporan hasil observasi.",
      materi: "Ciri Kebahasaan Teks LHO",
      indikatorSoal: "Disajikan beberapa contoh kalimat, peserta didik dapat memilih kalimat yang merupakan kalimat definisi secara tepat.",
      levelKognitif: "C2 (Memahami)"
    },
    {
      nomorSoal: 3,
      bentukSoal: "Pilihan Ganda",
      rumusanSoal: "Perhatikan kalimat-kalimat berikut:\n(1) Suhu rata-rata harian di kawasan hutan lindung ini berkisar antara 22 hingga 26 derajat Celsius.\n(2) Udara di tempat ini mungkin terasa sangat menyegarkan bagi para pengunjung kota.\n(3) Debit aliran sungai terpantau mencapai 15 meter kubik per detik pada musim hujan.\n(4) Hutan ini tampak sangat memesona dibandingkan hutan lainnya di pulau tersebut.\n\nKalimat yang menyajikan data dan fakta objektif ditandai oleh nomor...",
      pilihan: [
        "A. (1) dan (2)",
        "B. (1) dan (3)",
        "C. (2) dan (3)",
        "D. (2) dan (4)",
        "E. (3) dan (4)"
      ],
      kunciJawaban: "B",
      pembahasan: "Kalimat (1) dan (3) menyajikan ukuran kuantitatif terukur dan fakta konkret tanpa bias opini subjektif, sedangkan kalimat (2) dan (4) mengandung kata opini 'mungkin' dan 'tampak sangat memesona'.",
      tujuanPembelajaran: "Peserta didik mampu menganalisis keakuratan data dan fakta objektif dalam teks laporan hasil observasi.",
      materi: "Fakta dan Opini dalam Teks LHO",
      indikatorSoal: "Disajikan sebuah paragraf observasi lingkungan, peserta didik dapat menemukan kalimat yang mengandung fakta objektif.",
      levelKognitif: "C3 (Menerapkan)"
    },
    {
      nomorSoal: 4,
      bentukSoal: "Pilihan Ganda",
      rumusanSoal: "Dalam penyusunan teks laporan hasil observasi bertema biologi, penggunaan istilah teknis harus cermat. Manakah kalimat berikut yang menggunakan kaidah pembentukan kata berimbuhan dan istilah teknis dengan tepat?",
      pilihan: [
        "A. Tumbuhan xerofit memodifikasi bentuk daunnya menjadi duri guna menekan laju transpirasi.",
        "B. Hewan karnivora tersebut mengkonsumsi daging sebagai sumber energi primer.",
        "C. Bakteri pengurai mensejahterakan unsur hara di dalam lapisan tanah humus.",
        "D. Burung hantu memperlihatkan aktifitas perburuan nocturnal di area persawahan.",
        "E. Seluruh anggota populasi saling berinteraksi secara simbiosa komensalisme."
      ],
      kunciJawaban: "A",
      pembahasan: "Kalimat A menggunakan kata berimbuhan 'memodifikasi' (bukan memodif), 'menekan' (bukan mentekan), serta istilah ilmiah 'transpirasi' yang tepat kaidah EYD.",
      tujuanPembelajaran: "Peserta didik mampu mengevaluasi kesalahan penggunaan kaidah kebahasaan pada teks laporan hasil observasi.",
      materi: "Kaidah Kebahasaan (Kata Berimbuhan & Istilah Ilmiah)",
      indikatorSoal: "Disajikan kalimat yang memuat istilah teknis dan imbuhan, peserta didik dapat mengidentifikasi penulisan yang tepat.",
      levelKognitif: "C4 (Menganalisis)"
    },
    {
      nomorSoal: 5,
      bentukSoal: "Pilihan Ganda",
      rumusanSoal: "Berdasarkan pengamatan di wilayah pesisir utara, vegetasi mangrove memiliki perakaran kokoh yang mampu memecah energi gelombang laut dan menahan sedimen lumpur. Selain itu, serasah daun mangrove menjadi sumber nutrisi utama bagi biota perairan dangkal.\n\nKesimpulan logis mengenai fungsi ekologis hutan mangrove berdasarkan teks di atas adalah...",
      pilihan: [
        "A. Hutan mangrove semata-mata dimanfaatkan sebagai objek pariwisata bahari komersial.",
        "B. Vegetasi mangrove berperan ganda sebagai pelindung fisik pantai dari abrasi sekaligus penopang rantai makanan pesisir.",
        "C. Tanaman mangrove hanya efektif tumbuh apabila terdapat intervensi pemupukan rutin dari manusia.",
        "D. Perakaran mangrove menghalangi sirkulasi air laut sehingga menurunkan populasi ikan pantai.",
        "E. Kerusakan hutan mangrove tidak berdampak langsung pada keberlanjutan biota laut dangkal."
      ],
      kunciJawaban: "B",
      pembahasan: "Teks secara eksplisit menguraikan dua fungsi: penahan abrasi gelombang laut (fisik) dan penghasil nutrisi bagi rantai makanan biota dangkal (biologis). Jadi kesimpulan yang tepat adalah pilihan B.",
      tujuanPembelajaran: "Peserta didik mampu menyimpulkan pesan dan fungsi sosial dari teks laporan hasil observasi bertema kelestarian hayati.",
      materi: "Fungsi dan Manfaat Teks LHO",
      indikatorSoal: "Disajikan kutipan observasi tentang ekosistem mangrove, peserta didik dapat menyimpulkan fungsi penting keberadaan mangrove bagi lingkungan pesisir.",
      levelKognitif: "C4 (Menganalisis)"
    }
  ]
};

export default function App() {
  const [data, setData] = useState<PaketSoalResponse>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<ViewTab>("soal");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async (values: FormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();
      if (result && result.soalList && result.soalList.length > 0) {
        setData(result);
        // Scroll smoothly to output tabs
        const resultsEl = document.getElementById("naskah-output-section");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        throw new Error("Format respons soal tidak sesuai");
      }
    } catch (err: any) {
      console.error("Gagal membuat soal:", err);
      setErrorMessage("Terjadi kendala saat memproses dengan AI, silakan coba kembali atau gunakan pengaturan standar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDoc = () => {
    downloadWordDocument(data);
  };

  const handleOpenHtmlQuiz = () => {
    setActiveTab("interaktif");
    const el = document.getElementById("naskah-output-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenKartuSoal = () => {
    setActiveTab("kartuSoal");
    const el = document.getElementById("naskah-output-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <Header
        hasData={Boolean(data && data.soalList?.length > 0)}
        onDownloadDoc={handleDownloadDoc}
        onOpenInteractive={handleOpenHtmlQuiz}
        onOpenKartuSoal={handleOpenKartuSoal}
        isGenerating={isLoading}
      />

      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error notification if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Pemberitahuan Sistem</p>
              <p className="text-xs text-amber-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* 7-Column Input Form */}
        <FormPembuatSoal
          onGenerate={handleGenerate}
          isLoading={isLoading}
          hasData={Boolean(data && data.soalList?.length > 0)}
          onDownloadDoc={handleDownloadDoc}
          onOpenHtmlQuiz={handleOpenHtmlQuiz}
          onOpenKartuSoal={handleOpenKartuSoal}
        />

        {/* Output Section */}
        <section id="naskah-output-section" className="space-y-6">
          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-2xs flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("soal")}
              id="tab-naskah-soal"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "soal"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Naskah Soal ({data.soalList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("kunci")}
              id="tab-kunci-jawaban"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "kunci"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Kunci Jawaban Terpisah</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("kisiKisi")}
              id="tab-kisi-kisi"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "kisiKisi"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Tabel Kisi-Kisi Soal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("kartuSoal")}
              id="tab-kartu-soal"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "kartuSoal"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <IdCard className="w-4 h-4" />
              <span>Tombol Kartu Soal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("interaktif")}
              id="tab-html-interaktif"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "interaktif"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Tombol HTML Interaktif</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div>
            {activeTab === "soal" && (
              <NaskahSoalView soalList={data.soalList} meta={data.meta} />
            )}

            {activeTab === "kunci" && (
              <KunciJawabanView soalList={data.soalList} meta={data.meta} />
            )}

            {activeTab === "kisiKisi" && (
              <KisiKisiTable kisiKisi={data.kisiKisi} meta={data.meta} />
            )}

            {activeTab === "kartuSoal" && (
              <KartuSoalView soalList={data.soalList} meta={data.meta} />
            )}

            {activeTab === "interaktif" && (
              <InteractiveQuizView data={data} />
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700">
            Aplikasi Pembuat Soal &bull; By Ronal Hasan
          </p>
          <p className="mt-1 text-slate-400">
            Mendukung kurikulum SMA, MA, dan SMK. Format bersih tanpa simbol pagar (#) atau bintang (*). Kunci jawaban terpisah, kisi-kisi tabel, kartu soal, ekspor .doc & kuis HTML.
          </p>
        </div>
      </footer>
    </div>
  );
}
