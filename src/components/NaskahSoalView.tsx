import React, { useState } from "react";
import { SoalItem, PaketSoalMeta } from "../types";
import { FileText, Copy, Check, Printer } from "lucide-react";

interface NaskahSoalViewProps {
  soalList: SoalItem[];
  meta: PaketSoalMeta;
}

export const NaskahSoalView: React.FC<NaskahSoalViewProps> = ({ soalList, meta }) => {
  const [copied, setCopied] = useState(false);

  // Helper to ensure absolutely no # or *
  const clean = (text: string) => (text ? text.replace(/[#*]/g, "").trim() : "");

  const handleCopySoal = () => {
    const text = [
      `NASKAH SOAL EVALUASI PEMBELAJARAN`,
      `Jenjang: ${meta.jenjang} | Kelas: ${meta.kelas}`,
      `Mata Pelajaran: ${meta.mataPelajaran} | Topik: ${meta.topik || 'Umum'}`,
      `Bentuk Soal: ${meta.tipeSoal} | Jumlah: ${soalList.length} Butir Soal`,
      `Penyusun: By Ronal Hasan\n`,
      `PETUNJUK: Pilihlah atau jawablah butir pertanyaan berikut dengan tepat!\n`,
      ...soalList.map((item) => {
        const pilihanText =
          item.pilihan && item.pilihan.length > 0
            ? "\n" + item.pilihan.map((p) => `   ${clean(p)}`).join("\n")
            : "";
        return `${item.nomorSoal}. ${clean(item.rumusanSoal)}${pilihanText}\n`;
      })
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* View Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Daftar Butir Soal (Lembar Siswa)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kunci jawaban terpisah secara ketat dan teks bebas dari tanda pagar (#) atau bintang (*)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySoal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Tersalin" : "Salin Naskah Soal"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Soal</span>
          </button>
        </div>
      </div>

      {/* Kop Soal Box */}
      <div className="p-6 bg-slate-50 border-b border-slate-200 text-slate-800 text-sm">
        <div className="max-w-3xl mx-auto text-center pb-4 border-b border-slate-300">
          <h4 className="font-bold text-base tracking-wide text-slate-900 uppercase">
            Naskah Evaluasi Penilaian Pembelajaran
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            Jenjang: <strong>{meta.jenjang}</strong> &bull; Kelas: <strong>{meta.kelas}</strong> &bull; Mapel: <strong>{meta.mataPelajaran}</strong>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Topik: <strong>{meta.topik || "Umum"}</strong> &bull; Bentuk: <strong>{meta.tipeSoal}</strong> &bull; Penyusun: <strong>By Ronal Hasan</strong>
          </p>
        </div>

        <div className="mt-3 text-xs text-slate-500 text-center italic">
          Petunjuk Umum: Bacalah setiap butir soal berikut dengan teliti sebelum memberikan jawaban pada lembar jawaban yang tersedia.
        </div>
      </div>

      {/* Soal List */}
      <div className="p-6 divide-y divide-slate-100">
        {soalList.map((item) => (
          <div key={item.nomorSoal} className="py-5 first:pt-2 last:pb-2">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                {item.nomorSoal}
              </span>
              <div className="grow">
                <p className="text-slate-900 font-medium text-sm sm:text-base leading-relaxed">
                  {clean(item.rumusanSoal)}
                </p>

                {item.pilihan && item.pilihan.length > 0 && (
                  <div className="mt-3.5 space-y-2 pl-1 sm:pl-3">
                    {item.pilihan.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className="flex items-start gap-2.5 text-sm text-slate-800 bg-slate-50/70 hover:bg-slate-100/70 p-2 rounded-lg border border-slate-200/80 transition-colors"
                      >
                        <span className="font-bold text-blue-700 shrink-0">
                          {opt.trim().substring(0, 2)}
                        </span>
                        <span className="grow">
                          {clean(opt.trim().replace(/^[A-E]\.\s*/, ""))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Question Metadata pill (Level kognitif & bentuk) */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    Bentuk: {clean(item.bentukSoal)}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    Level: {clean(item.levelKognitif)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
