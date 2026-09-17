import React from "react";
import { BookOpen, GraduationCap, Award, FileText, Download, Sparkles } from "lucide-react";

interface HeaderProps {
  hasData: boolean;
  onDownloadDoc?: () => void;
  onOpenInteractive?: () => void;
  onOpenKartuSoal?: () => void;
  isGenerating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  hasData,
  onDownloadDoc,
  onOpenInteractive,
  onOpenKartuSoal,
  isGenerating
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm ring-4 ring-blue-50">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Aplikasi Pembuat Soal
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <GraduationCap className="w-3 h-3" /> Kurikulum Merdeka
                </span>
              </div>
              <p className="text-sm font-semibold text-blue-600 flex items-center gap-1.5 mt-0.5">
                <span>By Ronal Hasan</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-normal">SMA / MA / SMK Terstandar Nasional</span>
              </p>
            </div>
          </div>

          {hasData && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onDownloadDoc}
                id="btn-download-doc-header"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                title="Download Naskah Soal & Kisi-kisi ke Microsoft Word (.doc)"
              >
                <Download className="w-4 h-4" />
                <span>Download .doc</span>
              </button>

              <button
                type="button"
                onClick={onOpenInteractive}
                id="btn-interactive-html-header"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
                title="Buka Kuis Interaktif HTML"
              >
                <Sparkles className="w-4 h-4" />
                <span>Kuis HTML</span>
              </button>

              <button
                type="button"
                onClick={onOpenKartuSoal}
                id="btn-kartu-soal-header"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
                title="Lihat Kartu Soal Terformat"
              >
                <FileText className="w-4 h-4" />
                <span>Kartu Soal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
