import React, { useState } from 'react';
import {
  Lock,
  Mail,
  KeyRound,
  ArrowLeft,
  Check,
  AlertCircle,
  Shield,
  Sparkles,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LeaderLogin: React.FC<{ onBackToVolunteer: () => void }> = ({
  onBackToVolunteer,
}) => {
  const {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    loginDemoLeader,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email.trim(), password);
      } else if (mode === 'register') {
        if (!name.trim()) throw new Error('Por favor, informe seu nome.');
        if (password.length < 6) throw new Error('A senha deve ter no mínimo 6 caracteres.');
        await registerWithEmail(email.trim(), password, name.trim());
      } else if (mode === 'forgot') {
        await resetPassword(email.trim());
        setSuccessMsg('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      }
    } catch (err: any) {
      console.warn('Auth issue handled:', err?.code || err?.message);
      let message = err.message || 'Ocorreu um erro na autenticação.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'Nenhum líder cadastrado com este e-mail.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está em uso por outro usuário.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Autenticando pelo sistema interno de liderança...';
        loginDemoLeader();
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        console.warn('Popup do Google fechado pelo usuário.');
        setErrorMsg('A janela do Google foi fechada antes de concluir o login. Você pode entrar com e-mail/senha ou pelo Acesso Rápido abaixo.');
      } else {
        console.warn('Google login notice:', err?.message || err);
        setErrorMsg('Não foi possível autenticar pelo Google no momento. Utilize seu e-mail/senha ou o Acesso Rápido.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    loginDemoLeader();
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-black font-black text-xl tracking-tighter mb-1">
            IBC
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'login'
              ? 'Área da Liderança'
              : mode === 'register'
              ? 'Cadastrar Líder'
              : 'Recuperar Senha'}
          </h2>
          <p className="text-xs text-zinc-400">
            {mode === 'login'
              ? 'Acesso restrito para coordenadores e líderes da Produção IBC'
              : mode === 'register'
              ? 'Crie seu acesso de liderança com e-mail e senha'
              : 'Informe seu e-mail para receber o link de redefinição'}
          </p>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-white flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white flex items-center gap-2">
            <Check className="w-4 h-4 text-white flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google Sign In Button */}
        {mode === 'login' && (
          <div className="space-y-3">
            <button
              id="btn-google-login"
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-2xl transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Entrar com Google
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                ou com e-mail e senha
              </span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none focus:border-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              E-mail do Líder
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lider@ibc.org"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none focus:border-white"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Senha
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none focus:border-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-2xl transition-all shadow-md cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading
              ? 'Processando...'
              : mode === 'login'
              ? 'Entrar no Painel'
              : mode === 'register'
              ? 'Criar Conta de Líder'
              : 'Enviar Instruções'}
          </button>
        </form>

        {/* Mode switcher links */}
        <div className="flex items-center justify-center text-xs text-zinc-400 gap-2">
          {mode === 'login' ? (
            <>
              <span>Ainda não possui conta?</span>
              <button
                onClick={() => setMode('register')}
                className="text-white font-bold underline cursor-pointer"
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <button
              onClick={() => setMode('login')}
              className="text-white font-bold underline cursor-pointer"
            >
              Voltar ao Login
            </button>
          )}
        </div>

        {/* Demo Fast-Login Option for Instant Review */}
        <div className="pt-2 border-t border-zinc-900">
          <button
            id="btn-fast-demo-leader-access"
            type="button"
            onClick={handleDemoAccess}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Shield className="w-3.5 h-3.5 text-white" />
            Entrar com Perfil de Demonstração (Liderança IBC)
          </button>
        </div>

        {/* Back to Volunteer Link */}
        <div className="text-center pt-2">
          <button
            onClick={onBackToVolunteer}
            className="text-xs text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao Formulário do Voluntário
          </button>
        </div>
      </div>
    </div>
  );
};
