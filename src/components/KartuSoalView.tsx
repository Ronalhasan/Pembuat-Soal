import React, { useState } from "react";
import { SoalItem, PaketSoalMeta } from "../types";
import { IdCard, Printer, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";

interface KartuSoalViewProps {
  soalList: SoalItem[];
  meta: PaketSoalMeta;
}

export const KartuSoalView: React.FC<KartuSoalViewProps> = ({ soalList, meta }) => {
  const [copied, setCopied] = useState(false);
  const [filterNo, setFilterNo] = useState<number | "all">("all");

  const clean = (text: string) => (text ? text.replace(/[#*]/g, "").trim() : "");

  const displayedList = filterNo === "all" ? soalList : soalList.filter(s => s.nomorSoal === filterNo);

  const handleCopyAllKartu = () => {
    const text = soalList.map(item => `
=========================================
KARTU SOAL NOMOR ${item.nomorSoal}
Nama Mapel: ${meta.mataPelajaran}
Kelas / Jenjang / Semester: ${meta.kelas} / ${meta.jenjang} / ${meta.semester || 'Ganjil'}
-----------------------------------------
[TABEL 1]
Tujuan Pembelajaran: ${clean(item.tujuanPembelajaran)}
Nomor Soal: ${item.nomorSoal}
Kunci Jawaban: ${clean(item.kunciJawaban)}
-----------------------------------------
[RUMUSAN SOAL]
${clean(item.rumusanSoal)}
${item.pilihan && item.pilihan.length > 0 ? item.pilihan.map(p => `   ${clean(p)}`).join('\n') : ''}
-----------------------------------------
[TABEL 2]
Materi: ${clean(item.materi)}
Indikator Soal: ${clean(item.indikatorSoal)}
Level Kognitif: ${clean(item.levelKognitif)}
=========================================
    `.trim()).join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <IdCard className="w-5 h-5 text-amber-600" />
            Kartu Soal Kurikulum Merdeka
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Format resmi: Tabel 1 (TP, No, Kunci), Rumusan Soal, Tabel 2 (Materi, Indikator, Level)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Tampilkan:</span>
            <select
              value={filterNo}
              onChange={(e) => setFilterNo(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 outline-hidden"
            >
              <option value="all">Semua Nomor ({soalList.length})</option>
              {soalList.map(s => (
                <option key={s.nomorSoal} value={s.nomorSoal}>Nomor {s.nomorSoal}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleCopyAllKartu}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Tersalin" : "Salin Kartu"}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Kartu</span>
          </button>
        </div>
      </div>

      {/* List of Kartu Soal */}
      <div className="p-6 space-y-8 bg-slate-50/50">
        {displayedList.map((item) => (
          <div
            key={item.nomorSoal}
            className="bg-white rounded-xl border-2 border-slate-300 shadow-xs p-5 max-w-4xl mx-auto break-inside-avoid"
          >
            {/* Header: Nama Mapel dan Kelas/Semester */}
            <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
              <h4 className="font-bold text-sm sm:text-base text-slate-900 uppercase tracking-wide">
                KARTU SOAL NOMOR {item.nomorSoal}
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-blue-800 mt-0.5">
                Mata Pelajaran: {clean(meta.mataPelajaran)} | Kelas: {clean(meta.kelas)} ({clean(meta.jenjang)}) | Semester: {clean(meta.semester || "Ganjil/Genap")}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Penyusun: By Ronal Hasan &bull; Bentuk Soal: {clean(item.bentukSoal)}
              </p>
            </div>

            {/* TABEL 1: (Tujuan pembelajaran, Nomor Soal, Kunci Jawaban, dibuat satu tabel) */}
            <div className="mb-4">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tabel 1: Spesifikasi Butir & Kunci
              </div>
              <table className="w-full border-collapse border border-slate-400 text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-400 p-2.5 text-left w-7/12 font-semibold">
                      Tujuan Pembelajaran (TP)
                    </th>
                    <th className="border border-slate-400 p-2.5 text-center w-2/12 font-semibold">
                      Nomor Soal
                    </th>
                    <th className="border border-slate-400 p-2.5 text-center w-3/12 font-semibold">
                      Kunci Jawaban
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 p-2.5 text-slate-800 leading-relaxed align-top">
                      {clean(item.tujuanPembelajaran)}
                    </td>
                    <td className="border border-slate-400 p-2.5 text-center font-bold text-blue-800 align-middle text-base">
                      {item.nomorSoal}
                    </td>
                    <td className="border border-slate-400 p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/30 align-middle">
                      {clean(item.kunciJawaban)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* RUMUSAN SOAL */}
            <div className="mb-4">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Rumusan Butir Soal
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-lg">
                <p className="text-sm font-medium text-slate-900 leading-relaxed mb-3">
                  {clean(item.rumusanSoal)}
                </p>

                {item.pilihan && item.pilihan.length > 0 && (
                  <div className="space-y-1.5 pl-2">
                    {item.pilihan.map((opt, optIdx) => (
                      <div key={optIdx} className="text-xs sm:text-sm text-slate-800 flex items-start gap-2">
                        <span className="font-bold text-slate-700">{opt.trim().substring(0, 2)}</span>
                        <span>{clean(opt.trim().replace(/^[A-E]\.\s*/, ""))}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* TABEL 2: (Materi, Indikator Soal dan Level Kognitif dibuat satu tabel) */}
            <div>
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tabel 2: Analisis Kompetensi & Materi
              </div>
              <table className="w-full border-collapse border border-slate-400 text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-400 p-2.5 text-left w-4/12 font-semibold">
                      Materi Pokok
                    </th>
                    <th className="border border-slate-400 p-2.5 text-left w-5/12 font-semibold">
                      Indikator Soal
                    </th>
                    <th className="border border-slate-400 p-2.5 text-center w-3/12 font-semibold">
                      Level Kognitif
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 p-2.5 text-slate-800 leading-relaxed align-top">
                      {clean(item.materi)}
                    </td>
                    <td className="border border-slate-400 p-2.5 text-slate-800 leading-relaxed align-top">
                      {clean(item.indikatorSoal)}
                    </td>
                    <td className="border border-slate-400 p-2.5 text-center align-middle">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        {clean(item.levelKognitif)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
