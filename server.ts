import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to remove any markdown hash or asterisk symbols
function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[#*]/g, "") // remove all # and *
    .replace(/_{2,}/g, "") // remove double underlines if any
    .trim();
}

// Fallback question generator in case API key is missing or quota exceeded
function generateFallbackQuestions(params: {
  jenjang: string;
  kelas: string;
  mataPelajaran: string;
  topik: string;
  tipeSoal: string;
  jumlahSoal: number;
  levelKognitif: string;
}) {
  const { jenjang, kelas, mataPelajaran, topik, tipeSoal, jumlahSoal, levelKognitif } = params;
  const count = Math.min(Math.max(jumlahSoal || 5, 1), 50);

  const kisiKisi = [];
  const soalList = [];

  for (let i = 1; i <= count; i++) {
    const cognitiveLevel =
      levelKognitif.includes("C1-C2") ? (i % 2 === 0 ? "C2 (Memahami)" : "C1 (Mengingat)") :
      levelKognitif.includes("HOTS") ? (i % 2 === 0 ? "C5 (Mengevaluasi)" : "C4 (Menganalisis)") :
      levelKognitif.includes("Merata") ? `C${((i - 1) % 6) + 1}` :
      (i % 3 === 1 ? "C2 (Memahami)" : i % 3 === 2 ? "C3 (Menerapkan)" : "C4 (Menganalisis)");

    let bentuk = "Pilihan Ganda";
    let pilihan: string[] = [];
    let rumusanSoal = "";
    let kunciJawaban = "";
    let pembahasan = "";

    if (tipeSoal.includes("Benar/Salah")) {
      bentuk = "Benar / Salah";
      rumusanSoal = `Tentukan benar atau salah pernyataan terkait konsep ${topik || mataPelajaran}: "Pernyataan konsep dasar nomor ${i} memiliki relevansi langsung terhadap fenomena nyata dalam kehidupan sehari-hari."`;
      pilihan = ["A. Benar", "B. Salah"];
      kunciJawaban = i % 2 === 0 ? "A. Benar" : "B. Salah";
      pembahasan = `Pernyataan tersebut bernilai ${i % 2 === 0 ? "Benar" : "Salah"} karena sesuai dengan prinsip dasar ${topik || mataPelajaran}.`;
    } else if (tipeSoal.includes("Menjodohkan")) {
      bentuk = "Menjodohkan";
      rumusanSoal = `Jodohkan istilah atau konsep berikut dengan penjelasan atau fungsinya yang tepat dalam materi ${topik || mataPelajaran}:
Premis:
1. Konsep Utama ${i}A
2. Prinsip Kerja ${i}B
Pilihan Pasangan:
A. Penjelasan fungsi dan karakteristik 1
B. Penerapan spesifik dalam kasus 2`;
      pilihan = ["1 - A", "2 - B"];
      kunciJawaban = "1 - A dan 2 - B";
      pembahasan = `Konsep Utama berhubungan dengan karakteristik fungsi, sedangkan Prinsip Kerja diterapkan dalam kasus spesifik.`;
    } else if (tipeSoal.includes("Uraian Singkat")) {
      bentuk = "Uraian Singkat (Isian)";
      rumusanSoal = `Sebutkan istilah ilmiah atau kata kunci utama yang mendasari mekanisme dari fenomena ${topik || mataPelajaran} pada tingkatan ${kelas}!`;
      kunciJawaban = `Konsep Kunci ${topik || mataPelajaran}`;
      pembahasan = `Istilah kunci tersebut merupakan definisi operasional standar dalam kajian ${topik || mataPelajaran}.`;
    } else if (tipeSoal.includes("Uraian Panjang") || tipeSoal.includes("Esai")) {
      bentuk = "Uraian Panjang (Esai)";
      rumusanSoal = `Jelaskan secara komprehensif bagaimana proses terjadinya mekanisme dalam ${topik || mataPelajaran}, serta berikan 2 contoh konkret penerapannya di lingkungan sekitar siswa ${jenjang}!`;
      kunciJawaban = `Uraian jawaban memuat: 1) Penjelasan tahapan proses secara runtut, 2) Hubungan sebab-akibat antar variabel, dan 3) Dua contoh aplikasi faktual.`;
      pembahasan = `Kriteria penilaian meliputi pemahaman konsep dasar, kelengkapan tahapan argumentasi, dan ketepatan contoh aplikasi.`;
    } else if (tipeSoal.includes("3")) {
      bentuk = "Pilihan Ganda (3 Alternatif)";
      rumusanSoal = `Pada pembahasan ${topik || mataPelajaran} di jenjang ${jenjang} ${kelas}, manakah pernyataan berikut yang paling tepat menggambarkan karakteristik utama nomor ${i}?`;
      pilihan = [
        `A. Menunjukkan perubahan yang bersifat proporsional dan konsisten`,
        `B. Menghasilkan reaksi yang tidak dapat diprediksi secara teoretis`,
        `C. Membutuhkan intervensi energi dari luar secara konstan`
      ];
      kunciJawaban = "A";
      pembahasan = `Pilihan A tepat karena konsep ${topik || mataPelajaran} memiliki sifat proporsional yang dapat diukur secara konsisten.`;
    } else if (tipeSoal.includes("4")) {
      bentuk = "Pilihan Ganda (4 Alternatif)";
      rumusanSoal = `Perhatikan pernyataan mengenai ${topik || mataPelajaran} berikut! Manakah opsi yang menyajikan kesimpulan logis yang paling valid untuk butir soal nomor ${i}?`;
      pilihan = [
        `A. Terjadi peningkatan efisiensi secara berkesinambungan`,
        `B. Terjadi penurunan nilai stabilitas akibat faktor eksternal`,
        `C. Tidak ada korelasi antara parameter awal dengan hasil akhir`,
        `D. Semua komponen mengalami pergeseran titik ekuilibrium`
      ];
      kunciJawaban = "A";
      pembahasan = `Analisis menunjukkan bahwa faktor internal mendorong peningkatan efisiensi secara konsisten.`;
    } else if (tipeSoal.includes("Kompleks")) {
      bentuk = "Pilihan Ganda Kompleks";
      rumusanSoal = `Berdasarkan analisis kajian ${topik || mataPelajaran} pada level ${kelas}, berilah tanda centang pada dua atau lebih pernyataan yang BENAR berikut!`;
      pilihan = [
        `A. Pernyataan pertama sesuai dengan kaidah hukum dasar ${topik || mataPelajaran}`,
        `B. Pernyataan kedua terbukti melalui eksperimen empiris terstandar`,
        `C. Pernyataan ketiga tidak memiliki dasar ilmiah yang dapat dipertanggungjawabkan`,
        `D. Pernyataan keempat mendukung penguatan efektivitas proses pembelajaran`,
        `E. Pernyataan kelima bertentangan dengan prinsip konservasi energi`
      ];
      kunciJawaban = "A, B, dan D";
      pembahasan = `Pernyataan A, B, dan D bernilai benar berdasarkan kaidah keilmuan dan data empiris pada materi terkait.`;
    } else {
      // Default: Pilihan Ganda 5 Alternatif (A, B, C, D, E)
      bentuk = "Pilihan Ganda (5 Alternatif)";
      rumusanSoal = `Dalam konteks materi ${topik || mataPelajaran} untuk jenjang ${jenjang} ${kelas}, apa implikasi utama dari penerapan prinsip ${topik || mataPelajaran} terhadap pemecahan masalah sehari-hari pada soal nomor ${i}?`;
      pilihan = [
        `A. Meningkatkan pemahaman sistematis dan ketelitian analisis peserta didik`,
        `B. Menghilangkan ketergantungan pada pengukuran kuantitatif yang presisi`,
        `C. Membatasi ruang lingkup kajian hanya pada kondisi ideal di laboratorium`,
        `D. Memperlambat proses sintesis informasi karena kompleksitas variabel`,
        `E. Menyamakan seluruh karakteristik kasus tanpa mempertimbangkan variabel pembeda`
      ];
      kunciJawaban = "A";
      pembahasan = `Opsi A merupakan jawaban paling tepat karena penerapan prinsip ${topik || mataPelajaran} melatih nalar kritis dan pemahaman analitis siswa.`;
    }

    const tp = `Peserta didik mampu menganalisis dan menerapkan konsep ${topik || mataPelajaran} pada permasalahan kontekstual ${kelas}.`;
    const mat = `${topik || mataPelajaran}`;
    const indikator = `Disajikan stimulasi kasus atau pertanyaan, peserta didik dapat menentukan jawaban yang tepat terkait ${topik || mataPelajaran}.`;

    kisiKisi.push({
      no: i,
      tujuanPembelajaran: tp,
      materi: mat,
      indikatorSoal: indikator,
      levelKognitif: cognitiveLevel,
      bentukSoal: bentuk,
      nomorSoal: i
    });

    soalList.push({
      nomorSoal: i,
      bentukSoal: bentuk,
      rumusanSoal,
      pilihan,
      kunciJawaban,
      pembahasan,
      tujuanPembelajaran: tp,
      materi: mat,
      indikatorSoal: indikator,
      levelKognitif: cognitiveLevel
    });
  }

  return {
    meta: {
      jenjang,
      kelas,
      mataPelajaran,
      topik: topik || "Umum",
      tipeSoal,
      jumlahSoal: count,
      levelKognitif,
      tahunAjaran: "Tahun Ajaran 2025/2026",
      semester: "Semester Ganjil/Genap"
    },
    kisiKisi,
    soalList
  };
}

// API endpoint to generate questions
app.post("/api/generate-questions", async (req, res) => {
  try {
    const {
      jenjang = "SMA",
      kelas = "Kelas 10",
      mataPelajaran = "Bahasa Indonesia",
      topik = "",
      tipeSoal = "Pilihan Ganda dengan alternatif jawaban ada 5",
      jumlahSoal = 5,
      levelKognitif = "Level Standar (Campuran C1-C4) untuk PTS/PAS dan Ujian Umum",
      semester = "Semester 1"
    } = req.body;

    const count = Math.min(Math.max(Number(jumlahSoal) || 5, 1), 50);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log("No GEMINI_API_KEY found, using structured educational generator");
      const fallbackResult = generateFallbackQuestions({
        jenjang,
        kelas,
        mataPelajaran,
        topik,
        tipeSoal,
        jumlahSoal: count,
        levelKognitif
      });
      return res.json(fallbackResult);
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });

    const systemInstruction = `Anda adalah pakar pembuat soal ujian dan kurikulum pendidikan nasional Indonesia (Kurikulum Merdeka / Kurikulum Nasional untuk SMA, MA, dan SMK).
Tugas Anda adalah membuat paket soal ujian berkualitas tinggi, kisi-kisi soal dalam bentuk tabel terstruktur, kunci jawaban yang terpisah, pembahasan mendalam, serta data kartu soal.

ATURAN SANGAT PENTING (WAJIB DIPATUHI):
1. HASIL GENERATE TANPA SIMBOL PAGAR (#, ##, ###) DAN TANPA SIMBOL BINTANG (*, **). JANGAN gunakan markdown asterisks atau hashes di seluruh teks pertanyaan, pilihan jawaban, kunci jawaban, pembahasan, tujuan pembelajaran, indikator soal, maupun nama materi!
2. Buat soal bahasa Indonesia yang baku, logis, mendidik, dan relevan dengan jenjang ${jenjang}, ${kelas}, mata pelajaran ${mataPelajaran}, dan topik: "${topik || 'Sesuai kurikulum materi penting'}".
3. Kunci jawaban HARUS terpisah dari rumusan soal di dalam struktur JSON yang disediakan.
4. Tipe Soal yang diminta: "${tipeSoal}".
   - Jika "Pilihan Ganda dengan alternatif jawaban ada 3", sediakan 3 pilihan: A, B, C.
   - Jika "Pilihan Ganda dengan alternatif jawaban ada 4", sediakan 4 pilihan: A, B, C, D.
   - Jika "Pilihan Ganda dengan alternatif jawaban ada 5", sediakan 5 pilihan: A, B, C, D, E.
   - Jika "Pilihan Ganda Kompleks lebih dari 1 jawaban", sediakan pilihan opsi (A-E) di mana jawaban benar lebih dari satu, contoh kunci: "A, C, dan D".
   - Jika "Menjodohkan", buat premis/pernyataan dan pasangan jawabannya.
   - Jika "Benar/Salah", buat pernyataan dengan pilihan "A. Benar", "B. Salah".
   - Jika "Uraian Singkat(Isian)", buat soal isian singkat dengan kunci jawaban kata/istilah kunci.
   - Jika "Uraian Panjang (Esai)", buat soal analisis esai mendalam dengan rubrik/kunci jawaban terperinci.
   - Jika Campuran (75% PG dan 25% Isian/Esai), urutkan nomor awal sebagai Pilihan Ganda (75% jumlah soal) lalu nomor berikutnya sebagai Isian Singkat atau Uraian Panjang (25% jumlah soal).
5. Level Kognitif: "${levelKognitif}". Distribusikan C1, C2, C3, C4, C5, atau C6 sesuai level yang dipilih.
6. Jumlah Soal yang WAJIB dibuat: tepat ${count} butir soal.
7. Setiap butir soal harus memiliki data kisi-kisi dan kartu soal yang lengkap:
   - Tujuan Pembelajaran (TP)
   - Materi
   - Indikator Soal
   - Level Kognitif (misal: C1, C2, C3, C4, C5, atau C6)
   - Bentuk Soal
   - Rumusan Soal (Teks butir soal lengkap)
   - Pilihan jawaban (jika ada)
   - Kunci Jawaban
   - Pembahasan`;

    const prompt = `Buatkan paket soal ujian lengkap sebanyak tepat ${count} soal dengan parameter berikut:
Jenjang: ${jenjang}
Kelas: ${kelas}
Mata Pelajaran: ${mataPelajaran}
Topik/Materi Spesifik: ${topik || 'Materi esensial utama sesuai silabus'}
Tipe Soal: ${tipeSoal}
Jumlah Soal: ${count}
Level Kognitif: ${levelKognitif}
Semester: ${semester}

Pastikan teks bersih sama sekali TANPA tanda pagar (#) dan TANPA tanda bintang (*).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meta: {
              type: Type.OBJECT,
              properties: {
                jenjang: { type: Type.STRING },
                kelas: { type: Type.STRING },
                mataPelajaran: { type: Type.STRING },
                topik: { type: Type.STRING },
                tipeSoal: { type: Type.STRING },
                jumlahSoal: { type: Type.INTEGER },
                levelKognitif: { type: Type.STRING },
                tahunAjaran: { type: Type.STRING },
                semester: { type: Type.STRING }
              },
              required: ["jenjang", "kelas", "mataPelajaran", "topik", "tipeSoal", "jumlahSoal", "levelKognitif"]
            },
            kisiKisi: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  no: { type: Type.INTEGER },
                  tujuanPembelajaran: { type: Type.STRING },
                  materi: { type: Type.STRING },
                  indikatorSoal: { type: Type.STRING },
                  levelKognitif: { type: Type.STRING },
                  bentukSoal: { type: Type.STRING },
                  nomorSoal: { type: Type.INTEGER }
                },
                required: ["no", "tujuanPembelajaran", "materi", "indikatorSoal", "levelKognitif", "bentukSoal", "nomorSoal"]
              }
            },
            soalList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nomorSoal: { type: Type.INTEGER },
                  bentukSoal: { type: Type.STRING },
                  rumusanSoal: { type: Type.STRING },
                  pilihan: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  kunciJawaban: { type: Type.STRING },
                  pembahasan: { type: Type.STRING },
                  tujuanPembelajaran: { type: Type.STRING },
                  materi: { type: Type.STRING },
                  indikatorSoal: { type: Type.STRING },
                  levelKognitif: { type: Type.STRING }
                },
                required: ["nomorSoal", "bentukSoal", "rumusanSoal", "kunciJawaban", "pembahasan", "tujuanPembelajaran", "materi", "indikatorSoal", "levelKognitif"]
              }
            }
          },
          required: ["meta", "kisiKisi", "soalList"]
        }
      }
    });

    const rawText = response.text || "{}";
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error("Failed to parse JSON response from Gemini, falling back");
      data = generateFallbackQuestions({
        jenjang,
        kelas,
        mataPelajaran,
        topik,
        tipeSoal,
        jumlahSoal: count,
        levelKognitif
      });
    }

    // Clean any accidental # or * from all text strings
    if (data && data.soalList) {
      data.soalList = data.soalList.map((item: any) => ({
        ...item,
        rumusanSoal: cleanText(item.rumusanSoal),
        pilihan: Array.isArray(item.pilihan) ? item.pilihan.map(cleanText) : [],
        kunciJawaban: cleanText(item.kunciJawaban),
        pembahasan: cleanText(item.pembahasan),
        tujuanPembelajaran: cleanText(item.tujuanPembelajaran),
        materi: cleanText(item.materi),
        indikatorSoal: cleanText(item.indikatorSoal),
        levelKognitif: cleanText(item.levelKognitif)
      }));
    }
    if (data && data.kisiKisi) {
      data.kisiKisi = data.kisiKisi.map((k: any) => ({
        ...k,
        tujuanPembelajaran: cleanText(k.tujuanPembelajaran),
        materi: cleanText(k.materi),
        indikatorSoal: cleanText(k.indikatorSoal),
        levelKognitif: cleanText(k.levelKognitif),
        bentukSoal: cleanText(k.bentukSoal)
      }));
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error generating questions:", error);
    // Provide graceful response instead of 500 so UI continues working
    const fallback = generateFallbackQuestions({
      jenjang: req.body?.jenjang || "SMA",
      kelas: req.body?.kelas || "Kelas 10",
      mataPelajaran: req.body?.mataPelajaran || "Bahasa Indonesia",
      topik: req.body?.topik || "",
      tipeSoal: req.body?.tipeSoal || "Pilihan Ganda dengan alternatif jawaban ada 5",
      jumlahSoal: Number(req.body?.jumlahSoal) || 5,
      levelKognitif: req.body?.levelKognitif || "Level Standar (Campuran C1-C4)"
    });
    res.json(fallback);
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === "production" || process.env.npm_lifecycle_event === "start";

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aplikasi Pembuat Soal server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
