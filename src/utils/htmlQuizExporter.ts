import { PaketSoalResponse } from "../types";

export function generateInteractiveHtmlContent(data: PaketSoalResponse): string {
  const { meta, soalList } = data;

  const sanitize = (text: string) => {
    if (!text) return "";
    return text.replace(/[#*]/g, "").trim();
  };

  const quizDataJson = JSON.stringify(soalList);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kuis Interaktif: ${sanitize(meta.mataPelajaran)} - ${sanitize(meta.kelas)}</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #64748b;
      --success: #16a34a;
      --error: #dc2626;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 24px 16px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    .quiz-card {
      background: var(--card-bg);
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
      padding: 24px;
      margin-bottom: 24px;
    }
    .header-box {
      text-align: center;
      border-bottom: 2px solid var(--border);
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .header-box h1 {
      font-size: 1.5rem;
      color: #1e3a8a;
      margin-bottom: 4px;
    }
    .header-box .byline {
      font-size: 0.9rem;
      font-weight: 600;
      color: #3b82f6;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 10px;
      background: #f1f5f9;
      padding: 12px;
      border-radius: 8px;
      font-size: 0.88rem;
      margin-bottom: 20px;
    }
    .question-block {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      transition: all 0.2s ease;
    }
    .q-number {
      display: inline-block;
      background: #e0e7ff;
      color: #3730a3;
      font-weight: 700;
      font-size: 0.85rem;
      padding: 3px 10px;
      border-radius: 6px;
      margin-bottom: 10px;
    }
    .q-text {
      font-size: 1.05rem;
      font-weight: 600;
      margin-bottom: 14px;
      color: #1e293b;
    }
    .options-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .opt-label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.95rem;
      background: #ffffff;
      transition: background 0.15s, border-color 0.15s;
    }
    .opt-label:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    .opt-label input {
      margin-top: 4px;
      cursor: pointer;
    }
    .essay-input {
      width: 100%;
      min-height: 80px;
      padding: 10px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.95rem;
      resize: vertical;
    }
    .feedback-box {
      margin-top: 14px;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 0.9rem;
      display: none;
    }
    .feedback-correct {
      background: #dcfce7;
      border: 1px solid #86efac;
      color: #166534;
      display: block;
    }
    .feedback-wrong {
      background: #fee2e2;
      border: 1px solid #fca5a5;
      color: #991b1b;
      display: block;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      margin-top: 24px;
    }
    .btn {
      padding: 12px 24px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-primary {
      background: var(--primary);
      color: #ffffff;
    }
    .btn-primary:hover {
      background: var(--primary-dark);
    }
    .btn-secondary {
      background: #e2e8f0;
      color: #334155;
    }
    .btn-secondary:hover {
      background: #cbd5e1;
    }
    .score-banner {
      background: #eff6ff;
      border: 2px solid #bfdbfe;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin-bottom: 24px;
      display: none;
    }
    .score-number {
      font-size: 2.2rem;
      font-weight: 800;
      color: #1d4ed8;
      margin: 8px 0;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .quiz-card { border: none; box-shadow: none; padding: 0; }
      .controls { display: none; }
    }
  </style>
</head>
<body>

<div class="container">
  <div class="quiz-card">
    <div class="header-box">
      <h1>Aplikasi Pembuat Soal - Kuis Interaktif</h1>
      <div class="byline">By Ronal Hasan</div>
    </div>

    <div class="meta-grid">
      <div><strong>Jenjang / Kelas:</strong> ${sanitize(meta.jenjang)} / ${sanitize(meta.kelas)}</div>
      <div><strong>Mata Pelajaran:</strong> ${sanitize(meta.mataPelajaran)}</div>
      <div><strong>Topik:</strong> ${sanitize(meta.topik || 'Umum')}</div>
      <div><strong>Tipe:</strong> ${sanitize(meta.tipeSoal)}</div>
    </div>

    <div id="scoreBanner" class="score-banner">
      <h3>Hasil Penilaian Kuis</h3>
      <div id="scoreDisplay" class="score-number">0 / 100</div>
      <p id="scoreSummary">Jawaban benar: 0 dari ${soalList.length} butir soal.</p>
    </div>

    <form id="quizForm">
      ${soalList.map((item, idx) => {
        const isComplex = item.bentukSoal.toLowerCase().includes('kompleks');
        const isEssay = item.bentukSoal.toLowerCase().includes('uraian') || item.bentukSoal.toLowerCase().includes('esai');
        const inputType = isComplex ? 'checkbox' : 'radio';

        return `
          <div class="question-block" id="qBlock_${idx}">
            <div class="q-number">Soal Nomor ${item.nomorSoal} (${sanitize(item.bentukSoal)})</div>
            <div class="q-text">${sanitize(item.rumusanSoal)}</div>

            ${!isEssay && item.pilihan && item.pilihan.length > 0 ? `
              <div class="options-group">
                ${item.pilihan.map((opt, optIdx) => {
                  const optLetter = opt.trim().substring(0, 1).toUpperCase();
                  return `
                    <label class="opt-label">
                      <input type="${inputType}" name="question_${idx}" value="${optLetter}">
                      <span>${sanitize(opt)}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            ` : `
              <textarea class="essay-input" name="question_${idx}" placeholder="Tuliskan jawaban Anda di sini..."></textarea>
            `}

            <div class="feedback-box" id="feedback_${idx}">
              <div style="font-weight: bold; margin-bottom: 4px;">Kunci Jawaban: ${sanitize(item.kunciJawaban)}</div>
              <div><strong>Pembahasan:</strong> ${sanitize(item.pembahasan)}</div>
            </div>
          </div>
        `;
      }).join('')}

      <div class="controls">
        <button type="button" class="btn btn-primary" onclick="submitQuiz()">Periksa Jawaban</button>
        <button type="button" class="btn btn-secondary" onclick="resetQuiz()">Ulangi Kuis</button>
        <button type="button" class="btn btn-secondary" onclick="window.print()">Cetak Lembar</button>
      </div>
    </form>
  </div>
</div>

<script>
  const quizData = ${quizDataJson};

  function submitQuiz() {
    let correctCount = 0;
    let gradedCount = 0;

    quizData.forEach((item, idx) => {
      const block = document.getElementById('qBlock_' + idx);
      const feedback = document.getElementById('feedback_' + idx);
      feedback.style.display = 'block';

      const isEssay = item.bentukSoal.toLowerCase().includes('uraian') || item.bentukSoal.toLowerCase().includes('esai');
      const isComplex = item.bentukSoal.toLowerCase().includes('kompleks');

      if (isEssay) {
        feedback.className = 'feedback-box feedback-correct';
        feedback.innerHTML = '<strong>Panduan Rubrik & Kunci:</strong> ' + item.kunciJawaban + '<br><em>' + item.pembahasan + '</em>';
      } else if (isComplex) {
        gradedCount++;
        const checked = Array.from(document.querySelectorAll('input[name="question_' + idx + '"]:checked')).map(el => el.value);
        const userAns = checked.sort().join(', ');
        const cleanKey = item.kunciJawaban.toUpperCase().replace(/[^A-Z]/g, '').split('').sort().join(', ');

        const isCorrect = checked.length > 0 && cleanKey.includes(checked[0]);
        if (isCorrect) {
          correctCount++;
          feedback.className = 'feedback-box feedback-correct';
        } else {
          feedback.className = 'feedback-box feedback-wrong';
        }
      } else {
        gradedCount++;
        const selected = document.querySelector('input[name="question_' + idx + '"]:checked');
        const userVal = selected ? selected.value.toUpperCase() : '';
        const keyLetter = item.kunciJawaban.trim().substring(0, 1).toUpperCase();

        if (userVal === keyLetter) {
          correctCount++;
          feedback.className = 'feedback-box feedback-correct';
        } else {
          feedback.className = 'feedback-box feedback-wrong';
        }
      }
    });

    const scoreBanner = document.getElementById('scoreBanner');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const scoreSummary = document.getElementById('scoreSummary');

    const totalGraded = gradedCount > 0 ? gradedCount : quizData.length;
    const finalScore = Math.round((correctCount / totalGraded) * 100);

    scoreDisplay.innerText = finalScore + ' / 100';
    scoreSummary.innerText = 'Jawaban Pilihan Ganda/Objektif Benar: ' + correctCount + ' dari ' + totalGraded + ' soal.';
    scoreBanner.style.display = 'block';
    scoreBanner.scrollIntoView({ behavior: 'smooth' });
  }

  function resetQuiz() {
    document.getElementById('quizForm').reset();
    document.querySelectorAll('.feedback-box').forEach(el => el.style.display = 'none');
    document.getElementById('scoreBanner').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

</body>
</html>`;
}

export function downloadInteractiveHtml(data: PaketSoalResponse, filename?: string) {
  const content = generateInteractiveHtmlContent(data);
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const mapelClean = (data.meta.mataPelajaran || "Soal").replace(/[^a-zA-Z0-9]/g, "_");
  const kelasClean = (data.meta.kelas || "Kelas").replace(/[^a-zA-Z0-9]/g, "_");
  a.download = filename || `Kuis_Interaktif_${mapelClean}_${kelasClean}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
