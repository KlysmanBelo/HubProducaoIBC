import React, { useState } from 'react';
import {
  Music,
  Search,
  Copy,
  Check,
  ExternalLink,
  Tv,
  FileText,
  Layers,
  Sparkles,
  AlertTriangle,
  ClipboardPaste,
  BookOpen,
  Info,
  Download,
  FileDown,
  Globe,
} from 'lucide-react';
import { SongLyricResult } from '../types';
import {
  findWorshipSong,
  formatLyricsToSlides,
  WORSHIP_SONGS_DATABASE,
} from '../lib/worshipDatabase';

export const LyricsSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SongLyricResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'full' | 'slides'>('slides');
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedSlides, setCopiedSlides] = useState(false);
  const [copiedHolyrics, setCopiedHolyrics] = useState(false);

  // Manual paste modal state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualArtist, setManualArtist] = useState('');
  const [manualLyrics, setManualLyrics] = useState('');

  // Quick suggestions of worship songs commonly played at IBC Fortaleza & Brazilian churches
  const worshipCategories = [
    {
      name: 'Mais Tocados',
      songs: [
        'Bondade de Deus - Isaías Saad',
        'A Casa É Sua - Casa Worship',
        'Ruja o Leão - Talita Catanzaro',
        'Me Atraiu - Gabriela Rocha',
        'Lugar Secreto - Gabriela Rocha',
        'Ousado Amor - Isaías Saad',
      ],
    },
    {
      name: 'Adoração & Presença',
      songs: [
        'Quero Conhecer Jesus - Alessandro Vilas Boas',
        'Santo Espírito - Laura Souguellis',
        'Todavia Me Alegrarei - Samuel Messias',
        'Caminho no Deserto - Soraya Moraes',
        'Oceanos - Ana Nóbrega',
        'Só Tu És Santo - Morada',
      ],
    },
    {
      name: 'Harpa Cristã & Clássicos',
      songs: [
        'Porque Ele Vive - Harpa Cristã',
        'Grandioso És Tu - Harpa Cristã',
        'Alvo Mais Que a Neve - Harpa Cristã',
        'A Ele a Glória - Diante do Trono',
        'Deus de Promessas - Davi Sacer',
        'Nenhum Outro Nome - Gabriela Rocha',
      ],
    },
  ];

  const handleSearch = async (searchQuery: string) => {
    const term = searchQuery.trim();
    if (!term) return;

    setLoading(true);
    setError(null);

    // 1. Instant client-side check from rich Christian worship database
    const localSong = findWorshipSong(term);
    if (localSong) {
      setResult({
        ...localSong,
        isOfflineFallback: false,
        groundingSources: localSong.groundingSources || [
          {
            title: `Google: Letra ${localSong.title}`,
            url: `https://www.google.com/search?q=${encodeURIComponent('letra musica crista ' + localSong.title + ' ' + localSong.artist)}`,
          },
          {
            title: `Cifra Club: ${localSong.title}`,
            url: `https://www.google.com/search?q=${encodeURIComponent('cifra club ' + localSong.title + ' ' + localSong.artist)}`,
          },
        ],
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/search-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: term }),
      });

      if (response.ok) {
        const data: SongLyricResult = await response.json();
        setResult(data);
        return;
      }

      // Build structured fallback template for any custom song
      const parts = term.split(/[-–]/);
      const title = parts[0]?.trim() || term;
      const artist = parts[1]?.trim() || 'Louvor Cristão';
      setResult({
        title,
        artist,
        key: 'A definir no ensaio',
        bpm: 'Andamento de culto',
        composers: 'Louvor Cristão',
        fullLyrics: `Letra de ${title} - ${artist}\n\n[Clique no botão "Buscar no Google" ao lado para abrir a letra oficial e em "Colar Letra Manualmente" para importar os slides em 1 clique]`,
        slidesFormat: [
          `${title}\n${artist}`,
          `Equipe de Multimídia • Produção IBC`,
        ],
        groundingSources: [
          {
            title: `Buscar no Google: ${title}`,
            url: `https://www.google.com/search?q=${encodeURIComponent('letra musica crista ' + title + ' ' + artist)}`,
          },
          {
            title: `Buscar no Cifra Club: ${title}`,
            url: `https://www.google.com/search?q=${encodeURIComponent('cifra club ' + title + ' ' + artist)}`,
          },
        ],
        isOfflineFallback: true,
        notice: `Busca no Google preparada para "${title}". Use o link abaixo para abrir a letra no Google e importar com um clique!`,
      });
    } catch (err: any) {
      console.warn('Lyrics search request handled gracefully:', err);
      const parts = term.split(/[-–]/);
      const title = parts[0]?.trim() || term;
      const artist = parts[1]?.trim() || 'Louvor Cristão';
      setResult({
        title,
        artist,
        key: 'A definir',
        bpm: 'Andamento de culto',
        fullLyrics: `Letra de ${title} - ${artist}\n\n[Clique no botão "Buscar no Google" para visualizar a letra e utilize "Colar Letra Manualmente" para formatar os slides instantaneamente]`,
        slidesFormat: [
          `${title}\n${artist}`,
          `Multimídia • IBC Fortaleza`,
        ],
        groundingSources: [
          {
            title: `Buscar no Google: ${term}`,
            url: `https://www.google.com/search?q=${encodeURIComponent('letra musica crista ' + term)}`,
          },
        ],
        isOfflineFallback: true,
        notice: `Busca no Google pronta para "${term}". Clique no botão do Google para abrir a letra oficial e colar no importador.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualLyrics.trim()) return;

    const title = manualTitle.trim() || 'Música de Louvor';
    const artist = manualArtist.trim() || 'IBC Louvor';
    const slides = formatLyricsToSlides(manualLyrics.trim());

    setResult({
      title,
      artist,
      fullLyrics: manualLyrics.trim(),
      slidesFormat: slides.length > 0 ? slides : [manualLyrics.trim()],
      isOfflineFallback: true,
      notice: 'Letra convertida manualmente com sucesso para slides do ProPresenter / Holyrics.',
    });

    setIsManualModalOpen(false);
    setManualLyrics('');
    setManualTitle('');
    setManualArtist('');
    setError(null);
  };

  const copyFullLyrics = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.fullLyrics);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const copySlidesFormat = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.slidesFormat.join('\n\n---\n\n'));
    setCopiedSlides(true);
    setTimeout(() => setCopiedSlides(false), 2000);
  };

  const copyHolyricsFormat = () => {
    if (!result) return;
    let holyricsContent = `[título]\n${result.title}\n\n[artista]\n${result.artist}\n\n`;
    if (result.key && result.key !== 'A definir') holyricsContent += `[tom]\n${result.key}\n\n`;
    if (result.bpm && result.bpm !== 'A definir') holyricsContent += `[bpm]\n${result.bpm}\n\n`;
    holyricsContent += `[letra]\n${result.fullLyrics}`;
    navigator.clipboard.writeText(holyricsContent);
    setCopiedHolyrics(true);
    setTimeout(() => setCopiedHolyrics(false), 2000);
  };

  const downloadHolyricsFile = () => {
    if (!result) return;
    let holyricsContent = `[título]\n${result.title}\n\n`;
    holyricsContent += `[artista]\n${result.artist}\n\n`;
    if (result.key && result.key !== 'A definir') {
      holyricsContent += `[tom]\n${result.key}\n\n`;
    }
    if (result.bpm && result.bpm !== 'A definir') {
      holyricsContent += `[bpm]\n${result.bpm}\n\n`;
    }
    if (result.composers && result.composers !== 'Não informado') {
      holyricsContent += `[compositores]\n${result.composers}\n\n`;
    }
    holyricsContent += `[letra]\n${result.fullLyrics}\n`;

    const blob = new Blob([holyricsContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (result.title || 'musica').replace(/[^a-zA-Z0-9À-ÿ\s-]/g, '').trim();
    link.href = url;
    link.download = `${safeName} - Holyrics.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadProPresenterFile = () => {
    if (!result) return;
    // Standard ProPresenter format: metadata followed by slides delimited by blank lines
    let proContent = `// Title: ${result.title}\n`;
    proContent += `// Artist: ${result.artist}\n`;
    if (result.key && result.key !== 'A definir') proContent += `// Key: ${result.key}\n`;
    if (result.bpm && result.bpm !== 'A definir') proContent += `// BPM: ${result.bpm}\n`;
    proContent += `\n`;
    proContent += result.slidesFormat.join('\n\n');

    const blob = new Blob([proContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (result.title || 'musica').replace(/[^a-zA-Z0-9À-ÿ\s-]/g, '').trim();
    link.href = url;
    link.download = `${safeName} - ProPresenter.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Music className="w-3.5 h-3.5 text-white" />
            Multimídia 1 & 2 • Projeção de Letras
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Pesquisa de Letras & Slides (Holyrics / ProPresenter)
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Encontre letras de louvores com fontes verificadas ou converta letras coladas em blocos de slides para projeção na nave.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex-shrink-0"
        >
          <ClipboardPaste className="w-4 h-4 text-white" />
          Colar Letra Manualmente
        </button>
      </div>

      {/* Search Input Box */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite o nome do louvor, artista ou trecho (ex: Bondade de Deus Isaías Saad)..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-black" />
              {loading ? 'Buscando...' : 'Buscar Letra'}
            </button>

            {query.trim() && (
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent('letra musica crista ' + query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0"
                title="Abrir pesquisa direta no Google"
              >
                <Globe className="w-3.5 h-3.5 text-white" />
                <span>Google</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            )}
          </div>
        </form>

        {/* Worship Categories and Quick Suggestions */}
        <div className="space-y-2 pt-2 border-t border-zinc-900">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Music className="w-3 h-3 text-zinc-400" />
              Músicas Cristãs Populares (Busca Rápida):
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
              <Globe className="w-3 h-3 text-emerald-400" />
              Pesquisa Google & Catálogo IBC
            </span>
          </div>

          <div className="space-y-2">
            {worshipCategories.map((cat, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold text-zinc-400 px-2 py-0.5 rounded bg-zinc-900/80 border border-zinc-800">
                  {cat.name}:
                </span>
                {cat.songs.map((song, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuery(song);
                      handleSearch(song);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    {song}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-xs text-zinc-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-white flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3 py-1 bg-white text-black font-bold rounded-lg text-xs"
          >
            Colar Manualmente
          </button>
        </div>
      )}

      {/* Manual Paste Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardPaste className="w-5 h-5 text-white" />
                <h3 className="text-base font-bold text-white">Formatar Letra para Slides</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="text-zinc-500 hover:text-white text-xs font-bold"
              >
                ✕ Fechar
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Cole a letra de qualquer louvor (do WhatsApp, Letras.mus.br ou Cifra Club). O sistema dividirá automaticamente em blocos de 2 linhas por slide.
            </p>

            <form onSubmit={handleManualConvert} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-zinc-400 block mb-1">
                    Nome da Música
                  </label>
                  <input
                    type="text"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="Ex: Bondade de Deus"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-zinc-400 block mb-1">
                    Artista / Ministério
                  </label>
                  <input
                    type="text"
                    value={manualArtist}
                    onChange={(e) => setManualArtist(e.target.value)}
                    placeholder="Ex: Isaías Saad"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-zinc-400 block mb-1">
                  Cole a Letra Completa *
                </label>
                <textarea
                  rows={8}
                  value={manualLyrics}
                  onChange={(e) => setManualLyrics(e.target.value)}
                  placeholder="Cole aqui a letra da música..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 font-mono leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Gerar Slides ProPresenter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-6">
          {/* Notice banner if offline fallback or quota message */}
          {result.notice && (
            <div className="p-3.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-white flex-shrink-0" />
                <span>{result.notice}</span>
              </div>
              <button
                onClick={() => setIsManualModalOpen(true)}
                className="text-xs text-white font-bold underline flex-shrink-0 cursor-pointer"
              >
                Colar Letra
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                Música Encontrada
              </span>
              <h2 className="text-xl font-black text-white">{result.title}</h2>
              <p className="text-xs text-zinc-400 font-semibold">{result.artist}</p>

              {(result.key || result.bpm) && (
                <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-400">
                  {result.key && (
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      Tom: <strong className="text-white">{result.key}</strong>
                    </span>
                  )}
                  {result.bpm && (
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      Andamento: <strong className="text-white">{result.bpm}</strong>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* View Mode Toggle & Copy Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setViewMode('slides')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'slides' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Slides ProPresenter
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('full')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'full' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Letra Completa
                </button>
              </div>

              {viewMode === 'slides' ? (
                <button
                  type="button"
                  onClick={copySlidesFormat}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  {copiedSlides ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSlides ? 'Copiado!' : 'Copiar Slides'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={copyFullLyrics}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  {copiedFull ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedFull ? 'Copiado!' : 'Copiar Letra'}
                </button>
              )}
            </div>
          </div>

          {/* Software File Export Buttons (Holyrics & ProPresenter) */}
          <div className="flex flex-wrap items-center gap-2 p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
              <Download className="w-3.5 h-3.5 text-white" />
              Formatos de Arquivo p/ Projeção:
            </span>

            <button
              type="button"
              onClick={downloadHolyricsFile}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              title="Baixar arquivo .txt formatado com tags [título], [artista], [tom] e [letra] para importar no Holyrics"
            >
              <FileDown className="w-3.5 h-3.5" />
              Baixar p/ Holyrics (.txt)
            </button>

            <button
              type="button"
              onClick={downloadProPresenterFile}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
              title="Baixar arquivo .txt separado em slides para ProPresenter 7 ou 6"
            >
              <FileDown className="w-3.5 h-3.5 text-white" />
              Baixar p/ ProPresenter (.txt)
            </button>

            <button
              type="button"
              onClick={copyHolyricsFormat}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              title="Copiar texto pronto com tags para colar direto no Holyrics"
            >
              {copiedHolyrics ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedHolyrics ? 'Copiado p/ Holyrics!' : 'Copiar Formato Holyrics'}
            </button>

            <div className="flex items-center gap-1.5 ml-auto flex-wrap">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent('letra musica crista ' + result.title + ' ' + result.artist)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold rounded-xl transition-all"
                title="Abrir pesquisa da letra no Google"
              >
                <Globe className="w-3.5 h-3.5 text-white" />
                Google Letra
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent('cifra ' + result.title + ' ' + result.artist)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-semibold rounded-xl transition-all"
                title="Abrir cifra da música"
              >
                Cifra Club
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            </div>
          </div>

          {/* Slides Mode */}
          {viewMode === 'slides' ? (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Letra segmentada em blocos de 2 a 3 linhas, padrão para telão e projeção na nave:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {result.slidesFormat.map((slide, index) => (
                  <div
                    key={index}
                    className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-xl flex flex-col justify-between space-y-2 min-h-[100px]"
                  >
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">
                      Slide {index + 1}
                    </span>
                    <p className="text-xs text-white font-medium whitespace-pre-line leading-relaxed">
                      {slide}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Full Lyrics Mode */
            <div className="p-5 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <pre className="text-xs text-zinc-200 font-sans whitespace-pre-wrap leading-relaxed">
                {result.fullLyrics}
              </pre>
            </div>
          )}

          {/* Grounding Sources */}
          {result.groundingSources && result.groundingSources.length > 0 && (
            <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-zinc-500 font-medium">Fontes consultadas:</span>
              {result.groundingSources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-zinc-400 hover:text-white underline flex items-center gap-1"
                >
                  {source.title || 'Letra oficial'} <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
