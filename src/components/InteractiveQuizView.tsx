import React, { useState } from "react";
import { SoalItem, PaketSoalMeta, PaketSoalResponse } from "../types";
import { Sparkles, CheckCircle, XCircle, RotateCcw, Download, Award, AlertCircle, HelpCircle } from "lucide-react";
import { downloadInteractiveHtml } from "../utils/htmlQuizExporter";

interface InteractiveQuizViewProps {
  data: PaketSoalResponse;
}

export const InteractiveQuizView: React.FC<InteractiveQuizViewProps> = ({ data }) => {
  const { meta, soalList } = data;
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<{ correct: number; total: number; percentage: number }>({
    correct: 0,
    total: soalList.length,
    percentage: 0
  });

  const clean = (text: string) => (text ? text.replace(/[#*]/g, "").trim() : "");

  const handleSelectSingle = (nomor: number, letter: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [nomor]: letter }));
  };

  const handleToggleMulti = (nomor: number, letter: string) => {
    if (isSubmitted) return;
    const current = (userAnswers[nomor] as string[]) || [];
    const exists = current.includes(letter);
    const updated = exists ? current.filter(l => l !== letter) : [...current, letter];
    setUserAnswers(prev => ({ ...prev, [nomor]: updated }));
  };

  const handleTextAnswer = (nomor: number, text: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [nomor]: text }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    let gradedCount = 0;

    soalList.forEach(item => {
      const isEssay = item.bentukSoal.toLowerCase().includes("uraian") || item.bentukSoal.toLowerCase().includes("esai");
      const isComplex = item.bentukSoal.toLowerCase().includes("kompleks");

      if (isEssay) {
        // Essay is self-graded or evaluated with rubric
        return;
      }

      gradedCount++;
      const userAns = userAnswers[item.nomorSoal];

      if (isComplex) {
        const checked = Array.isArray(userAns) ? [...userAns].sort().join(", ") : "";
        const cleanKey = item.kunciJawaban.toUpperCase().replace(/[^A-Z]/g, "").split("").sort().join(", ");
        if (checked && cleanKey.includes(checked.charAt(0))) {
          correctCount++;
        }
      } else {
        const keyLetter = item.kunciJawaban.trim().substring(0, 1).toUpperCase();
        if (typeof userAns === "string" && userAns.toUpperCase() === keyLetter) {
          correctCount++;
        }
      }
    });

    const totalGraded = gradedCount > 0 ? gradedCount : soalList.length;
    const percentage = Math.round((correctCount / totalGraded) * 100);

    setScore({
      correct: correctCount,
      total: totalGraded,
      percentage
    });
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScore({ correct: 0, total: soalList.length, percentage: 0 });
  };

  const handleExportHtml = () => {
    downloadInteractiveHtml(data);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-indigo-50/60">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Mode Kuis Interaktif HTML
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Siswa dapat langsung mengerjakan secara interaktif, memeriksa skor otomatis, atau mengunduh file HTML mandiri
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportHtml}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
            title="Download file .html mandiri offline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download File HTML Interaktif</span>
          </button>
        </div>
      </div>

      {/* Score Banner when submitted */}
      {isSubmitted && (
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
          <Award className="w-12 h-12 mx-auto text-yellow-300 mb-2" />
          <h4 className="text-lg font-bold">Hasil Evaluasi Kuis</h4>
          <div className="text-4xl font-black tracking-tight my-2">
            {score.percentage} <span className="text-xl font-medium text-blue-200">/ 100</span>
          </div>
          <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto">
            Anda berhasil menjawab benar <strong>{score.correct}</strong> dari <strong>{score.total}</strong> butir soal objektif.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ulangi Kuis
            </button>
          </div>
        </div>
      )}

      {/* Quiz Form Questions */}
      <div className="p-6 space-y-6">
        {soalList.map((item) => {
          const isComplex = item.bentukSoal.toLowerCase().includes("kompleks");
          const isEssay = item.bentukSoal.toLowerCase().includes("uraian") || item.bentukSoal.toLowerCase().includes("esai");
          const userAns = userAnswers[item.nomorSoal];
          const keyLetter = item.kunciJawaban.trim().substring(0, 1).toUpperCase();

          let isCorrect = false;
          if (isSubmitted && !isEssay) {
            if (isComplex) {
              const checked = Array.isArray(userAns) ? [...userAns].sort().join(", ") : "";
              const cleanKey = item.kunciJawaban.toUpperCase().replace(/[^A-Z]/g, "").split("").sort().join(", ");
              isCorrect = Boolean(checked && cleanKey.includes(checked.charAt(0)));
            } else {
              isCorrect = typeof userAns === "string" && userAns.toUpperCase() === keyLetter;
            }
          }

          return (
            <div
              key={item.nomorSoal}
              className={`p-5 rounded-xl border transition-all ${
                isSubmitted
                  ? isEssay
                    ? "border-slate-300 bg-slate-50/50"
                    : isCorrect
                    ? "border-emerald-300 bg-emerald-50/30 ring-1 ring-emerald-200"
                    : "border-rose-300 bg-rose-50/30 ring-1 ring-rose-200"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  Soal Nomor {item.nomorSoal} ({clean(item.bentukSoal)})
                </span>
                {isSubmitted && !isEssay && (
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}>
                    {isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {isCorrect ? "Benar" : "Salah"}
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed mb-4">
                {clean(item.rumusanSoal)}
              </p>

              {/* Options */}
              {!isEssay && item.pilihan && item.pilihan.length > 0 ? (
                <div className="space-y-2">
                  {item.pilihan.map((opt, optIdx) => {
                    const optLetter = opt.trim().substring(0, 1).toUpperCase();
                    const isChecked = isComplex
                      ? Array.isArray(userAns) && userAns.includes(optLetter)
                      : userAns === optLetter;

                    return (
                      <label
                        key={optIdx}
                        className={`flex items-start gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-all ${
                          isChecked
                            ? "border-indigo-500 bg-indigo-50/60 font-semibold text-indigo-950"
                            : "border-slate-200 hover:bg-slate-50 text-slate-800"
                        }`}
                        onClick={() => {
                          if (isComplex) {
                            handleToggleMulti(item.nomorSoal, optLetter);
                          } else {
                            handleSelectSingle(item.nomorSoal, optLetter);
                          }
                        }}
                      >
                        <input
                          type={isComplex ? "checkbox" : "radio"}
                          name={`q_${item.nomorSoal}`}
                          checked={isChecked}
                          onChange={() => {}}
                          disabled={isSubmitted}
                          className="mt-1 accent-indigo-600 cursor-pointer"
                        />
                        <span className="grow">{clean(opt)}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={(userAns as string) || ""}
                  onChange={(e) => handleTextAnswer(item.nomorSoal, e.target.value)}
                  disabled={isSubmitted}
                  placeholder="Ketikkan jawaban uraian Anda di sini..."
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                />
              )}

              {/* Feedback and Explanation after submission */}
              {isSubmitted && (
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span>Kunci Jawaban: {clean(item.kunciJawaban)}</span>
                  </div>
                  <div className="text-slate-600 leading-relaxed pl-6">
                    <strong className="text-slate-700">Pembahasan:</strong> {clean(item.pembahasan)}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Submit or Reset controls */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Periksa Jawaban Kuis</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Pengerjaan</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportHtml}
            className="px-4 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-2xs transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Ekspor File .html Interaktif</span>
          </button>
        </div>
      </div>
    </div>
  );
};
