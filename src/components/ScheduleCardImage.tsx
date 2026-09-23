import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas-pro';
import {
  Download,
  Copy,
  Check,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Tv,
  Users,
  MessageSquare,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { Schedule } from '../types';

interface ScheduleCardImageProps {
  schedule: Schedule;
  onSendNotificationReminder?: () => void;
}

export const ScheduleCardImage: React.FC<ScheduleCardImageProps> = ({
  schedule,
  onSendNotificationReminder,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Format date nicely (ex: Domingo, 20 de Setembro de 2026)
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Download high-resolution PNG for WhatsApp
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    setGenError(null);
    try {
      // Ultra-high resolution scale (3.5x) for razor-sharp WhatsApp sharing
      const canvas = await html2canvas(cardRef.current, {
        scale: 3.5,
        useCORS: true,
        backgroundColor: '#000000',
        logging: false,
        imageTimeout: 0,
        onclone: (_clonedDoc, clonedElement) => {
          clonedElement.style.backgroundColor = '#000000';
          clonedElement.style.color = '#ffffff';
          (clonedElement.style as any).webkitFontSmoothing = 'antialiased';
        },
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const safeTitle = schedule.eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.download = `escala-${safeTitle}-${schedule.eventDate}.png`;
      link.href = image;
      link.click();
    } catch (err: any) {
      console.error('Erro ao gerar imagem:', err);
      setGenError(err?.message || 'Falha ao processar a imagem da escala.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy image to clipboard
  const handleCopyImageToClipboard = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    setGenError(null);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3.0,
        useCORS: true,
        backgroundColor: '#000000',
        logging: false,
        imageTimeout: 0,
        onclone: (_clonedDoc, clonedElement) => {
          clonedElement.style.backgroundColor = '#000000';
          clonedElement.style.color = '#ffffff';
          (clonedElement.style as any).webkitFontSmoothing = 'antialiased';
        },
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2500);
          } catch (clipErr: any) {
            console.warn('Clipboard write permission denied, triggering download instead:', clipErr);
            // Fallback: trigger download if clipboard API is restricted
            const image = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.download = `escala-${schedule.eventDate}.png`;
            link.href = image;
            link.click();
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2500);
          }
        }
      }, 'image/png', 1.0);
    } catch (err: any) {
      console.error('Erro ao copiar imagem:', err);
      setGenError(err?.message || 'Falha ao processar a imagem da escala.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate WhatsApp formatted text message
  const handleCopyWhatsappText = () => {
    const formattedDate = formatDate(schedule.eventDate);
    const assignmentsText = schedule.assignments
      .map((a) => `• *${a.roleName}:* ${a.volunteerName || 'A Definir'}`)
      .join('\n');

    const message = `🎬 *ESCALA DE PRODUÇÃO - IBC FORTALEZA* 🎬
━━━━━━━━━━━━━━━━━━━━
📌 *Evento:* ${schedule.eventTitle}
📅 *Data:* ${formattedDate}
⏰ *Horário:* ${schedule.eventTime}
📍 *Local:* Campus Edson Queiroz
━━━━━━━━━━━━━━━━━━━━
👥 *EQUIPE ESCALADA:*
${assignmentsText}
━━━━━━━━━━━━━━━━━━━━
${schedule.notes ? `📝 *Orientações:* ${schedule.notes}\n━━━━━━━━━━━━━━━━━━━━\n` : ''}⚡ *Chegada pontual para passagem de som e oração da equipe.* Deus abençoe seu serviço! 🙌`;

    navigator.clipboard.writeText(message);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const isSunday = schedule.eventType === 'sunday';

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
        <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
          <Share2 className="w-4 h-4 text-white" />
          <span>Exportação para WhatsApp da Equipe</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyWhatsappText}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                Texto Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar Texto WhatsApp
              </>
            )}
          </button>

          <button
            onClick={handleCopyImageToClipboard}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {copiedImage ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                Imagem Copiada!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar Imagem
              </>
            )}
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {isGenerating ? 'Gerando...' : 'Baixar Imagem PNG (Alta Qualidade)'}
          </button>
        </div>
      </div>

      {genError && (
        <div className="p-3.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-white flex-shrink-0" />
            <span>Erro ao processar imagem: {genError}</span>
          </div>
          <button
            onClick={handleCopyWhatsappText}
            className="text-xs text-white underline font-bold"
          >
            Usar formato texto
          </button>
        </div>
      )}

      {/* The Printable / Renderable Card Element for WhatsApp */}
      <div className="flex justify-center overflow-x-auto p-2">
        <div
          ref={cardRef}
          className="w-full max-w-[560px] bg-black border-2 border-white/90 rounded-3xl p-7 text-white shadow-2xl space-y-6 relative overflow-hidden"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: '#000000',
            color: '#ffffff',
          }}
        >
          {/* Subtle geometric watermark */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: 'rgba(39, 39, 42, 0.4)' }}
          />

          {/* Top Header without prohibited names and logo */}
          <div
            className="flex items-center justify-between pb-4"
            style={{ borderBottom: '1px solid #27272a' }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                }}
              >
                ESCALA OFICIAL
              </span>
              <span
                className="inline-block px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  color: '#d4d4d8',
                }}
              >
                {isSunday ? 'Culto Dominical' : 'Programação Especial'}
              </span>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs font-bold" style={{ color: '#ffffff' }}>
                {schedule.eventDate}
              </span>
            </div>
          </div>

          {/* Event Details Badge */}
          <div
            className="space-y-1.5 p-4 rounded-2xl"
            style={{ backgroundColor: '#09090b', border: '1px solid #27272a' }}
          >
            <h2 className="text-xl font-black tracking-tight leading-snug" style={{ color: '#ffffff' }}>
              {schedule.eventTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1" style={{ color: '#d4d4d8' }}>
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
                <span>{formatDate(schedule.eventDate)}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold" style={{ color: '#ffffff' }}>
                <Clock className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
                <span>{schedule.eventTime}</span>
              </div>
              <div className="flex items-center gap-1.5" style={{ color: '#a1a1aa' }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
                <span>Campus Edson Queiroz</span>
              </div>
            </div>
          </div>

          {/* Scale Roster Table */}
          <div className="space-y-2.5">
            <div
              className="flex items-center justify-between pb-2"
              style={{ borderBottom: '1px solid #27272a' }}
            >
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#a1a1aa' }}>
                Função Técnica
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#a1a1aa' }}>
                Servo Escalado
              </span>
            </div>

            <div className="space-y-1.5">
              {schedule.assignments.map((assignment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-xl"
                  style={{
                    backgroundColor: '#09090b',
                    border: '1px solid #18181b',
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: '#ffffff' }}
                    />
                    <span className="text-xs font-bold truncate" style={{ color: '#e4e4e7' }}>
                      {assignment.roleName}
                    </span>
                  </div>

                  <div className="text-right pl-3 flex-shrink-0">
                    <span className="text-xs font-black tracking-wide" style={{ color: '#ffffff' }}>
                      {assignment.volunteerName || 'A Definir'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Footer */}
          {schedule.notes && (
            <div
              className="p-3 rounded-xl text-xs"
              style={{
                backgroundColor: '#09090b',
                border: '1px solid #27272a',
                color: '#d4d4d8',
              }}
            >
              <span className="font-bold uppercase text-[10px] tracking-wider block mb-1" style={{ color: '#ffffff' }}>
                Orientações da Liderança:
              </span>
              <p className="text-[11px] leading-relaxed" style={{ color: '#d4d4d8' }}>{schedule.notes}</p>
            </div>
          )}

          <div
            className="pt-2 flex items-center justify-between text-[10px]"
            style={{ borderTop: '1px solid #27272a', color: '#71717a' }}
          >
            <span>Escala Oficial • Equipe Técnica</span>
            <span className="font-mono" style={{ color: '#a1a1aa' }}>{schedule.eventDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
