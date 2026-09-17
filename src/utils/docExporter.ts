import { PaketSoalResponse } from "../types";

export function generateWordDocContent(data: PaketSoalResponse): string {
  const { meta, kisiKisi, soalList } = data;

  const sanitize = (text: string) => {
    if (!text) return "";
    return text.replace(/[#*]/g, "").trim();
  };

  const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${sanitize(meta.mataPelajaran)} - ${sanitize(meta.kelas)}</title>
<style>
  body {
    font-family: 'Calibri', 'Times New Roman', serif;
    font-size: 11pt;
    line-height: 1.4;
    color: #111827;
    margin: 20px;
  }
  h1, h2, h3, h4 {
    font-family: 'Calibri', 'Arial', sans-serif;
    color: #1f2937;
    margin-top: 18pt;
    margin-bottom: 6pt;
    text-align: center;
  }
  .header-kop {
    text-align: center;
    border-bottom: 2px solid #000;
    padding-bottom: 8px;
    margin-bottom: 16px;
  }
  .header-kop h2 {
    margin: 0;
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
  }
  .header-kop p {
    margin: 2px 0;
    font-size: 10pt;
  }
  .meta-table {
    width: 100%;
    margin-bottom: 18px;
    border-collapse: collapse;
  }
  .meta-table td {
    padding: 3px 6px;
    font-size: 10pt;
    vertical-align: top;
  }
  table.content-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  table.content-table th, table.content-table td {
    border: 1px solid #000;
    padding: 6px 8px;
    font-size: 10pt;
    vertical-align: top;
  }
  table.content-table th {
    background-color: #f3f4f6;
    font-weight: bold;
    text-align: center;
  }
  .soal-item {
    margin-bottom: 14px;
    page-break-inside: avoid;
  }
  .soal-nomor {
    font-weight: bold;
    display: inline;
  }
  .soal-teks {
    display: inline;
  }
  .pilihan-list {
    margin-left: 20px;
    margin-top: 4px;
  }
  .pilihan-item {
    margin-bottom: 3px;
  }
  .kartu-container {
    border: 1.5px solid #000;
    padding: 12px;
    margin-bottom: 24px;
    page-break-inside: avoid;
  }
  .kartu-header {
    text-align: center;
    font-weight: bold;
    font-size: 11pt;
    margin-bottom: 8px;
    border-bottom: 1px solid #000;
    padding-bottom: 4px;
  }
  .page-break {
    page-break-before: always;
  }
</style>
</head>
<body>

<!-- KOP NASKAH -->
<div class="header-kop">
  <h2>NASKAH SOAL EVALUASI PEMBELAJARAN</h2>
  <p><strong>JENJANG ${sanitize(meta.jenjang)} | ${sanitize(meta.kelas)}</strong></p>
  <p>Mata Pelajaran: ${sanitize(meta.mataPelajaran)} | Topik: ${sanitize(meta.topik || 'Umum')}</p>
  <p>Penyusun: By Ronal Hasan</p>
</div>

<table class="meta-table">
  <tr>
    <td style="width: 18%;"><strong>Mata Pelajaran</strong></td>
    <td style="width: 2%;">:</td>
    <td style="width: 35%;">${sanitize(meta.mataPelajaran)}</td>
    <td style="width: 18%;"><strong>Bentuk Soal</strong></td>
    <td style="width: 2%;">:</td>
    <td style="width: 25%;">${sanitize(meta.tipeSoal)}</td>
  </tr>
  <tr>
    <td><strong>Kelas / Jenjang</strong></td>
    <td>:</td>
    <td>${sanitize(meta.kelas)} / ${sanitize(meta.jenjang)}</td>
    <td><strong>Jumlah Soal</strong></td>
    <td>:</td>
    <td>${meta.jumlahSoal} Butir</td>
  </tr>
  <tr>
    <td><strong>Tingkat Kognitif</strong></td>
    <td>:</td>
    <td>${sanitize(meta.levelKognitif)}</td>
    <td><strong>Alokasi Waktu</strong></td>
    <td>:</td>
    <td>${meta.jumlahSoal * 2.5} Menit</td>
  </tr>
</table>

<!-- BAGIAN I: KISI-KISI SOAL DALAM BENTUK TABEL -->
<h3 style="text-align: left; border-bottom: 1px solid #333; padding-bottom: 4px;">A. KISI-KISI PENYUSUNAN SOAL</h3>
<table class="content-table">
  <thead>
    <tr>
      <th style="width: 5%;">No</th>
      <th style="width: 28%;">Tujuan Pembelajaran</th>
      <th style="width: 18%;">Materi</th>
      <th style="width: 27%;">Indikator Soal</th>
      <th style="width: 7%;">Level</th>
      <th style="width: 10%;">Bentuk</th>
      <th style="width: 5%;">No Soal</th>
    </tr>
  </thead>
  <tbody>
    ${kisiKisi.map(item => `
      <tr>
        <td style="text-align: center;">${item.no}</td>
        <td>${sanitize(item.tujuanPembelajaran)}</td>
        <td>${sanitize(item.materi)}</td>
        <td>${sanitize(item.indikatorSoal)}</td>
        <td style="text-align: center;">${sanitize(item.levelKognitif)}</td>
        <td>${sanitize(item.bentukSoal)}</td>
        <td style="text-align: center;">${item.nomorSoal}</td>
      </tr>
    `).join('')}
  </tbody>
</table>

<div class="page-break"></div>

<!-- BAGIAN II: NASKAH BUTIR SOAL (KUNCI TERPISAH) -->
<h3 style="text-align: left; border-bottom: 1px solid #333; padding-bottom: 4px;">B. DAFTAR BUTIR SOAL</h3>
<p style="font-size: 10pt; font-style: italic; margin-bottom: 12px;">Petunjuk: Bacalah setiap butir pertanyaan dengan seksama dan tentukan jawaban yang paling tepat!</p>

${soalList.map(item => `
  <div class="soal-item">
    <div>
      <span class="soal-nomor">${item.nomorSoal}. </span>
      <span class="soal-teks">${sanitize(item.rumusanSoal)}</span>
    </div>
    ${item.pilihan && item.pilihan.length > 0 ? `
      <div class="pilihan-list">
        ${item.pilihan.map(opt => `
          <div class="pilihan-item">${sanitize(opt)}</div>
        `).join('')}
      </div>
    ` : ''}
  </div>
`).join('')}

<div class="page-break"></div>

<!-- BAGIAN III: KUNCI JAWABAN DAN PEMBAHASAN TERPISAH -->
<h3 style="text-align: left; border-bottom: 1px solid #333; padding-bottom: 4px;">C. KUNCI JAWABAN DAN PEDOMAN PENILAIAN</h3>
<table class="content-table">
  <thead>
    <tr>
      <th style="width: 8%;">No</th>
      <th style="width: 27%;">Kunci Jawaban</th>
      <th style="width: 65%;">Pembahasan / Rubrik Penilaian</th>
    </tr>
  </thead>
  <tbody>
    ${soalList.map(item => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${item.nomorSoal}</td>
        <td style="font-weight: bold;">${sanitize(item.kunciJawaban)}</td>
        <td>${sanitize(item.pembahasan)}</td>
      </tr>
    `).join('')}
  </tbody>
</table>

<div class="page-break"></div>

<!-- BAGIAN IV: KARTU SOAL -->
<h3 style="text-align: left; border-bottom: 1px solid #333; padding-bottom: 4px;">D. KARTU SOAL</h3>

${soalList.map(item => `
  <div class="kartu-container">
    <div class="kartu-header">
      KARTU SOAL NOMOR ${item.nomorSoal}<br>
      Mata Pelajaran: ${sanitize(meta.mataPelajaran)} | Kelas / Jenjang: ${sanitize(meta.kelas)} / ${sanitize(meta.jenjang)}
    </div>

    <!-- TABEL 1: Tujuan Pembelajaran, Nomor Soal, Kunci Jawaban -->
    <table class="content-table" style="margin-bottom: 10px;">
      <thead>
        <tr>
          <th style="width: 60%;">Tujuan Pembelajaran</th>
          <th style="width: 15%;">Nomor Soal</th>
          <th style="width: 25%;">Kunci Jawaban</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${sanitize(item.tujuanPembelajaran)}</td>
          <td style="text-align: center; font-weight: bold;">${item.nomorSoal}</td>
          <td style="font-weight: bold;">${sanitize(item.kunciJawaban)}</td>
        </tr>
      </tbody>
    </table>

    <!-- RUMUSAN SOAL -->
    <div style="background: #fafafa; border: 1px solid #e5e7eb; padding: 10px; margin-bottom: 10px;">
      <p style="margin: 0 0 6px 0; font-weight: bold;">Rumusan Butir Soal:</p>
      <p style="margin: 0;">${sanitize(item.rumusanSoal)}</p>
      ${item.pilihan && item.pilihan.length > 0 ? `
        <div style="margin-top: 6px; margin-left: 15px;">
          ${item.pilihan.map(opt => `<div style="margin-bottom: 2px;">${sanitize(opt)}</div>`).join('')}
        </div>
      ` : ''}
    </div>

    <!-- TABEL 2: Materi, Indikator Soal, dan Level Kognitif -->
    <table class="content-table" style="margin-bottom: 4px;">
      <thead>
        <tr>
          <th style="width: 35%;">Materi Pokok</th>
          <th style="width: 45%;">Indikator Soal</th>
          <th style="width: 20%;">Level Kognitif</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${sanitize(item.materi)}</td>
          <td>${sanitize(item.indikatorSoal)}</td>
          <td style="text-align: center;">${sanitize(item.levelKognitif)}</td>
        </tr>
      </tbody>
    </table>
  </div>
`).join('')}

</body>
</html>
  `.trim();

  return htmlContent;
}

export function downloadWordDocument(data: PaketSoalResponse, filename?: string) {
  const content = generateWordDocContent(data);
  const blob = new Blob(['\ufeff' + content], {
    type: 'application/msword;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const mapelClean = (data.meta.mataPelajaran || "Soal").replace(/[^a-zA-Z0-9]/g, "_");
  const kelasClean = (data.meta.kelas || "Kelas").replace(/[^a-zA-Z0-9]/g, "_");
  a.download = filename || `Soal_${mapelClean}_${kelasClean}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
