export interface KisiKisiItem {
  no: number;
  tujuanPembelajaran: string;
  materi: string;
  indikatorSoal: string;
  levelKognitif: string;
  bentukSoal: string;
  nomorSoal: number;
}

export interface SoalItem {
  nomorSoal: number;
  bentukSoal: string;
  rumusanSoal: string;
  pilihan: string[];
  kunciJawaban: string;
  pembahasan: string;
  tujuanPembelajaran: string;
  materi: string;
  indikatorSoal: string;
  levelKognitif: string;
}

export interface PaketSoalMeta {
  jenjang: string;
  kelas: string;
  mataPelajaran: string;
  topik: string;
  tipeSoal: string;
  jumlahSoal: number;
  levelKognitif: string;
  tahunAjaran?: string;
  semester?: string;
  namaSekolah?: string;
  penyusun?: string;
}

export interface PaketSoalResponse {
  meta: PaketSoalMeta;
  kisiKisi: KisiKisiItem[];
  soalList: SoalItem[];
}

export type ViewTab = 'soal' | 'kunci' | 'kisiKisi' | 'kartuSoal' | 'interaktif';
