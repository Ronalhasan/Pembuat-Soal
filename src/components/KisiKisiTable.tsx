import React from "react";
import { KisiKisiItem, PaketSoalMeta } from "../types";
import { Table, Copy, Check, Printer } from "lucide-react";

interface KisiKisiTableProps {
  kisiKisi: KisiKisiItem[];
  meta: PaketSoalMeta;
}

export const KisiKisiTable: React.FC<KisiKisiTableProps> = ({ kisiKisi, meta }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = [
      `KISI-KISI PENULISAN SOAL`,
      `Jenjang: ${meta.jenjang} | Kelas: ${meta.kelas} | Mapel: ${meta.mataPelajaran}`,
      `Topik: ${meta.topik || 'Umum'} | Penyusun: By Ronal Hasan\n`,
      `No\tTujuan Pembelajaran\tMateri\tIndikator Soal\tLevel Kognitif\tBentuk Soal\tNomor Soal`,
      ...kisiKisi.map(k => `${k.no}\t${k.tujuanPembelajaran}\t${k.materi}\t${k.indikatorSoal}\t${k.levelKognitif}\t${k.bentukSoal}\t${k.nomorSoal}`)
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Table className="w-5 h-5 text-blue-600" />
            Tabel Kisi-Kisi Penulisan Soal
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Format matriks evaluasi pembelajaran berstandar Kurikulum Merdeka
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Tersalin" : "Salin Tabel"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border-b border-slate-300">
              <th className="py-3 px-3.5 text-center w-12 border-r border-slate-200">No</th>
              <th className="py-3 px-4 w-3/12 border-r border-slate-200">Tujuan Pembelajaran (TP)</th>
              <th className="py-3 px-4 w-2/12 border-r border-slate-200">Materi Pokok</th>
              <th className="py-3 px-4 w-3/12 border-r border-slate-200">Indikator Soal</th>
              <th className="py-3 px-3 text-center w-24 border-r border-slate-200">Level</th>
              <th className="py-3 px-3.5 w-28 border-r border-slate-200">Bentuk Soal</th>
              <th className="py-3 px-3 text-center w-16">No Soal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700 text-xs sm:text-sm">
            {kisiKisi.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                <td className="py-3 px-3.5 text-center font-bold text-slate-900 border-r border-slate-200 bg-slate-50/50">
                  {item.no}
                </td>
                <td className="py-3 px-4 font-medium text-slate-900 border-r border-slate-200 leading-relaxed">
                  {item.tujuanPembelajaran}
                </td>
                <td className="py-3 px-4 text-slate-700 border-r border-slate-200">
                  {item.materi}
                </td>
                <td className="py-3 px-4 text-slate-700 border-r border-slate-200 leading-relaxed">
                  {item.indikatorSoal}
                </td>
                <td className="py-3 px-3 text-center border-r border-slate-200">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    {item.levelKognitif}
                  </span>
                </td>
                <td className="py-3 px-3.5 text-slate-700 border-r border-slate-200 text-xs">
                  {item.bentukSoal}
                </td>
                <td className="py-3 px-3 text-center font-bold text-blue-700 bg-slate-50/50">
                  {item.nomorSoal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
