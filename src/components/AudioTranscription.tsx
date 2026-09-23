import React, { useState, useRef } from 'react';
import {
  Mic,
  Square,
  Upload,
  Check,
  Copy,
  Users,
  AlertTriangle,
  Play,
  FileAudio,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AudioMeetingAnalysis } from '../types';

export const AudioTranscription: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [meetingContext, setMeetingContext] = useState('Reunião Geral da Produção IBC');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AudioMeetingAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start Recording
  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Audio recording access error:', err);
      setError('Permissão de microfone negada ou não disponível.');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  // Handle local audio file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
    setError(null);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Send to Gemini Audio Processing Endpoint
  const handleAnalyzeAudio = async () => {
    if (!audioBlob) return;
    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);

      const base64Audio = await base64Promise;
      const mimeType = audioBlob.type || 'audio/webm';

      const response = await fetch('/api/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: base64Audio,
          mimeType,
          meetingContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao processar o áudio com a IA Gemini.');
      }

      const data: AudioMeetingAnalysis = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error('Audio transcription error:', err);
      setError(err.message || 'Erro ao transcrever e resumir a reunião.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            IA Gemini • Transcrição e Análise Técnica
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Transcrição & Resumo de Reuniões Técnicas
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Grave o áudio do alinhamento da produção ou envie uma gravação. O Gemini extrai a ata, tarefas por área e pontos críticos.
          </p>
        </div>
      </div>

      {/* Recording and Upload Station */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-6">
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">
            Contexto da Reunião
          </label>
          <input
            type="text"
            value={meetingContext}
            onChange={(e) => setMeetingContext(e.target.value)}
            placeholder="Ex: Alinhamento da Produção para a Conferência ou Pré-Culto de Domingo"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Live Record */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-white text-black animate-pulse'
                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
              }`}
            >
              <Mic className="w-6 h-6" />
            </div>

            <div>
              <span className="text-sm font-bold text-white block">
                {isRecording ? 'Gravando Reunião ao Vivo...' : 'Gravação com Microfone'}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {isRecording ? formatTime(recordDuration) : 'Clique para iniciar a gravação'}
              </span>
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-2 px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 text-white" />
                Parar Gravação
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4" />
                Iniciar Gravação
              </button>
            )}
          </div>

          {/* Card 2: Upload Audio File */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <span className="text-sm font-bold text-white block">
                Enviar Arquivo de Áudio
              </span>
              <span className="text-xs text-zinc-400">
                Suporta MP3, WAV, M4A, OGG ou gravações do WhatsApp
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <FileAudio className="w-4 h-4" />
              Selecionar Arquivo
            </button>
          </div>
        </div>

        {/* Audio Player and Action Trigger */}
        {audioUrl && (
          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <audio controls src={audioUrl} className="h-9 max-w-xs" />
              <span className="text-xs text-zinc-300 font-medium">Áudio pronto</span>
            </div>

            <button
              type="button"
              onClick={handleAnalyzeAudio}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Transcrevendo com Gemini IA...' : 'Transcrever & Gerar Resumo'}
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200">
            {error}
          </div>
        )}
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              Resultado da Análise da Reunião
            </h2>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(analysis.summary);
                setCopiedSummary(true);
                setTimeout(() => setCopiedSummary(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs rounded-lg transition-all cursor-pointer"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSummary ? 'Copiado!' : 'Copiar Resumo'}
            </button>
          </div>

          {/* Executive Summary */}
          <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Resumo Executivo
            </span>
            <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line">
              {analysis.summary}
            </p>
          </div>

          {/* Action Items Table */}
          {analysis.actionItems && analysis.actionItems.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white block">
                Tarefas & Encaminhamentos
              </span>
              <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
                {analysis.actionItems.map((item, i) => (
                  <div key={i} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <span className="text-zinc-200">{item.action}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700 font-bold text-[11px]">
                        {item.assignee}
                      </span>
                      {item.deadline && (
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {item.deadline}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Urgent Notes */}
          {analysis.urgentNotes && analysis.urgentNotes.length > 0 && (
            <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-white" />
                Pontos de Atenção Crítica:
              </span>
              <ul className="list-disc list-inside text-xs text-zinc-300 space-y-0.5">
                {analysis.urgentNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Raw Transcription */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Transcrição Literal do Áudio
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(analysis.transcription);
                  setCopiedTranscript(true);
                  setTimeout(() => setCopiedTranscript(false), 2000);
                }}
                className="text-xs text-zinc-400 hover:text-white underline cursor-pointer flex items-center gap-1"
              >
                {copiedTranscript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedTranscript ? 'Copiado!' : 'Copiar Transcrição'}
              </button>
            </div>
            <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/80 max-h-56 overflow-y-auto">
              <p className="text-xs text-zinc-400 leading-relaxed font-mono whitespace-pre-wrap">
                {analysis.transcription}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
