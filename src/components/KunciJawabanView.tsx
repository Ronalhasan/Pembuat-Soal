import React, { useState } from "react";
import { SoalItem, PaketSoalMeta } from "../types";
import { KeyRound, Copy, Check, Printer } from "lucide-react";

interface KunciJawabanViewProps {
  soalList: SoalItem[];
  meta: PaketSoalMeta;
}

export const KunciJawabanView: React.FC<KunciJawabanViewProps> = ({ soalList, meta }) => {
  const [copied, setCopied] = useState(false);

  const clean = (text: string) => (text ? text.replace(/[#*]/g, "").trim() : "");

  const handleCopyKunci = () => {
    const text = [
      `KUNCI JAWABAN DAN PEMBAHASAN SOAL`,
      `Jenjang: ${meta.jenjang} | Kelas: ${meta.kelas}`,
      `Mata Pelajaran: ${meta.mataPelajaran} | Topik: ${meta.topik || 'Umum'}`,
      `Penyusun: By Ronal Hasan\n`,
      `No\tKunci Jawaban\tPembahasan / Rubrik`,
      ...soalList.map((s) => `${s.nomorSoal}\t${clean(s.kunciJawaban)}\t${clean(s.pembahasan)}`)
    ].join("\n");

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
            <KeyRound className="w-5 h-5 text-emerald-600" />
            Kunci Jawaban & Pembahasan (Terpisah)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumen pedoman penskoran dan kunci jawaban resmi untuk guru
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyKunci}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Tersalin" : "Salin Kunci"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Kunci</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Grid of Keys */}
      <div className="p-6 bg-emerald-50/50 border-b border-emerald-100">
        <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3">
          Ringkasan Cepat Kunci Jawaban
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {soalList.map((item) => (
            <div
              key={item.nomorSoal}
              className="bg-white border border-emerald-200 rounded-lg p-2 text-center shadow-2xs"
            >
              <div className="text-[11px] text-slate-500 font-medium">No. {item.nomorSoal}</div>
              <div className="text-sm font-bold text-emerald-700 truncate" title={clean(item.kunciJawaban)}>
                {clean(item.kunciJawaban)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border-b border-slate-300">
              <th className="py-3 px-3.5 text-center w-14 border-r border-slate-200">No</th>
              <th className="py-3 px-4 w-44 border-r border-slate-200">Kunci Jawaban</th>
              <th className="py-3 px-4">Pembahasan & Rubrik Penskoran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700 text-xs sm:text-sm">
            {soalList.map((item) => (
              <tr key={item.nomorSoal} className="hover:bg-emerald-50/30 transition-colors">
                <td className="py-3 px-3.5 text-center font-bold text-slate-900 border-r border-slate-200 bg-slate-50/50">
                  {item.nomorSoal}
                </td>
                <td className="py-3 px-4 font-bold text-emerald-700 border-r border-slate-200 bg-emerald-50/20">
                  {clean(item.kunciJawaban)}
                </td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed">
                  <p>{clean(item.pembahasan)}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Indikator: {clean(item.indikatorSoal)} ({clean(item.levelKognitif)})
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
