import React, { useState } from 'react';
import {
  Bell,
  Send,
  Users,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationCenter: React.FC = () => {
  const { volunteers, notifications, sendNotification, fcmToken, requestFcmPermission } = useApp();

  const [recipient, setRecipient] = useState<'all' | string>('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notifType, setNotifType] = useState<'reminder' | 'announcement' | 'scale_change' | 'general'>('reminder');
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Quick templates
  const applyTemplate = (type: 'sunday_reminder' | 'availability_call' | 'technical_alert') => {
    if (type === 'sunday_reminder') {
      setTitle('⏰ Lembrete de Escala • Culto de Domingo');
      setMessage('Paz, servos! Lembramos que o culto é neste domingo. Chegada com 1 hora de antecedência para oração e passagem técnica de som, luz e câmeras!');
      setNotifType('reminder');
    } else if (type === 'availability_call') {
      setTitle('📋 Formulário de Disponibilidade Aberto');
      setMessage('A liderança de Produção da IBC liberou as datas dos próximos cultos e eventos de semana. Por favor, acesse o link público e marque seus dias disponíveis!');
      setNotifType('announcement');
    } else if (type === 'technical_alert') {
      setTitle('🛠️ Alinhamento Técnico da Produção');
      setMessage('Atenção equipe de vídeo e som: teremos passagem de cabos e ajuste de presets no switcher antes do culto. Favor chegar pontualmente!');
      setNotifType('scale_change');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSending(true);
    try {
      const selectedVol = volunteers.find((v) => v.id === recipient);
      await sendNotification({
        title: title.trim(),
        message: message.trim(),
        type: notifType,
        recipient,
        recipientName: recipient === 'all' ? 'Todos os Voluntários' : selectedVol?.name,
      });

      setSuccessMsg(true);
      setTitle('');
      setMessage('');
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error('Erro ao disparar notificação:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5 text-white" />
            Firebase Cloud Messaging (FCM)
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Central de Notificações & Lembretes Push
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Envie alertas push e comunicados urgentes para toda a equipe de produção ou para voluntários específicos.
          </p>
        </div>

        <button
          onClick={requestFcmPermission}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold rounded-xl transition-all cursor-pointer self-start md:self-auto"
        >
          <Bell className="w-3.5 h-3.5 text-white" />
          {fcmToken ? '✓ FCM Ativo no Navegador' : 'Ativar Push FCM'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dispatch Form */}
        <div className="lg:col-span-7 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-white" />
            Disparar Nova Notificação
          </h2>

          {/* Quick template chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              Modelos Rápidos da Produção:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate('sunday_reminder')}
                className="text-xs px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                ⏰ Lembrete Culto Domingo
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('availability_call')}
                className="text-xs px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                📋 Convocar Disponibilidade
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('technical_alert')}
                className="text-xs px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                🛠️ Alerta Técnico
              </button>
            </div>
          </div>

          <form onSubmit={handleSend} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Destinatário *
              </label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
              >
                <option value="all">📢 Todos os Voluntários ({volunteers.length} servos)</option>
                {volunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    👤 {v.name} ({v.roles.join(', ')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Título do Alerta *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Lembrete de Escala do Culto de Domingo"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Mensagem Push *
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva a mensagem clara para a equipe..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white outline-none focus:border-white"
              />
            </div>

            {successMsg && (
              <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>Notificação enviada com sucesso para os destinatários!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {sending ? 'Disparando FCM...' : 'Enviar Notificação Agora'}
            </button>
          </form>
        </div>

        {/* Recent Notifications Log */}
        <div className="lg:col-span-5 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            Histórico de Disparos
          </h2>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">
                Nenhuma notificação disparada recentemente.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">{n.title}</span>
                    <span className="text-[10px] text-zinc-500 font-mono flex-shrink-0">
                      {n.sentAt ? new Date(n.sentAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">{n.message}</p>
                  <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800">
                    <span>Para: {n.recipientName || (n.recipient === 'all' ? 'Todos' : 'Individual')}</span>
                    <span className="text-white font-semibold">Push FCM Entregue</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
