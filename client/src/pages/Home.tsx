import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaWhatsapp } from "react-icons/fa";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle,
  CheckCircle2,
  XCircle,
  Star,
  ArrowRight,
  TrendingUp,
  Globe,
  Users,
  Zap,
  Shield,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Clock,
  Award,
  Target,
  Gift,
  MapPin,
  Quote,
  AlertTriangle,
} from "lucide-react";

/* ─────────────── Logo ─────────────── */
function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="42" height="38" viewBox="0 0 42 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="21" cy="16" r="5"  stroke="white" strokeWidth="2.5" fill="none" />
        <circle cx="21" cy="16" r="10" stroke="white" strokeWidth="2"   fill="none" />
        <circle cx="21" cy="16" r="15" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M 11 35 L 11 20 L 23 30 L 18 30 L 21 37 L 18.5 38 L 15.5 31 L 11 35 Z" fill="white" />
      </svg>
      <span className="leading-none select-none">
        <span className="text-white font-black text-xl tracking-tight">mestres</span>
        <span className="text-white font-light text-xl tracking-tight">do</span>
        <span className="text-white font-black text-xl tracking-tight">site.</span>
      </span>
    </div>
  );
}

/* ─────────────── Constants ─────────────── */
const WHATSAPP_NUMBER = "5511940000000";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Vi o site da Mestres do Site e gostaria de saber mais sobre como vocês podem me ajudar a conseguir mais clientes."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
const TOTAL_VAGAS = 220;
const VAGAS_DISPONIVEIS = 9;

const leadSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(8, "Telefone inválido"),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
});
type LeadForm = z.infer<typeof leadSchema>;

/* ─────────────── Hooks ─────────────── */
function useCountdown(targetHours: number = 24) {
  const end = useRef(Date.now() + targetHours * 60 * 60 * 1000);
  const [remaining, setRemaining] = useState(() => end.current - Date.now());
  useEffect(() => {
    const id = setInterval(() => {
      const diff = end.current - Date.now();
      setRemaining(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { h: pad(h), m: pad(m), s: pad(s) };
}

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [inView, target, duration]);
  return { count, ref };
}

/* ─────────────── Small Components ─────────────── */
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="text-center px-2">
      <span ref={ref} className="text-4xl lg:text-5xl font-black text-yellow-400 tabular-nums">
        {count.toLocaleString("pt-BR")}{suffix}
      </span>
      <p className="text-blue-200 font-sans mt-2 text-sm tracking-wide">{label}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <button
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-blue-50/60 transition-colors duration-200"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-slate-900 pr-4 leading-snug">{question}</span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${open ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <p className="px-5 pb-5 pt-1 text-slate-600 font-sans leading-relaxed text-sm bg-white border-t border-slate-100">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScarcityBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 bg-red-600 text-white font-sans font-bold text-sm px-4 py-2 rounded-full shadow-lg ${className}`}>
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      Restam apenas {VAGAS_DISPONIVEIS} de {TOTAL_VAGAS} vagas disponíveis
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-blue-600 font-sans font-semibold text-xs uppercase tracking-widest mb-4">
      <span className="w-6 h-px bg-blue-400" />
      {children}
      <span className="w-6 h-px bg-blue-400" />
    </span>
  );
}

function SectionLabelLight({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-blue-300 font-sans font-semibold text-xs uppercase tracking-widest mb-4">
      <span className="w-6 h-px bg-blue-500" />
      {children}
      <span className="w-6 h-px bg-blue-500" />
    </span>
  );
}

/* ─────────────── Animation Variants ─────────────── */
const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};
const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const vp = { once: true, margin: "-60px" } as const;

/* ─────────────── Page ─────────────── */
export default function Home() {
  const [formSuccess, setFormSuccess] = useState(false);
  const formRef = useRef<HTMLElement>(null);
  const countdown = useCountdown(0.5);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadForm>({ resolver: zodResolver(leadSchema) });
  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => { setFormSuccess(true); reset(); setTimeout(() => setFormSuccess(false), 8000); },
  });

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white antialiased">

      {/* ── FIXED TOP BAR ── */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 py-2.5 px-4">
          <div className="container flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <div className="flex items-center gap-2 text-white font-sans text-xs sm:text-sm font-medium">
              <Clock className="h-3.5 w-3.5 text-yellow-300 flex-shrink-0" />
              <span>Oferta por tempo limitado — análise gratuita encerra em:</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-sm">
              {[countdown.h, countdown.m, countdown.s].map((unit, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="bg-yellow-400 text-blue-900 px-2 py-0.5 rounded font-bold tabular-nums">{unit}</span>
                  {i < 2 && <span className="text-yellow-300">:</span>}
                </span>
              ))}
            </div>
            <button onClick={scrollToForm} className="text-yellow-300 underline font-sans text-xs sm:text-sm font-semibold hover:text-yellow-200 transition-colors whitespace-nowrap">
              Garantir agora →
            </button>
          </div>
        </div>

        <nav className="bg-blue-900/95 backdrop-blur-sm shadow-lg shadow-blue-950/30">
          <div className="container py-3 flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/mestresdosite" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 text-blue-300 hover:text-white font-sans text-sm transition-colors duration-200">
                <Instagram className="h-4 w-4" /> @mestresdosite
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-sans font-semibold px-4 py-2 rounded-full text-sm transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30">
                <FaWhatsapp className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </nav>
      </div>

      <div className="h-[108px]" />

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-yellow-400/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        </div>

        <div className="relative container py-20 lg:py-32">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto text-center">
            <motion.div variants={fadeUp} className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 bg-yellow-400/15 border border-yellow-400/30 text-yellow-300 font-sans text-xs sm:text-sm font-semibold px-5 py-2 rounded-full backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 flex-shrink-0" /> +3.500 clientes conquistados em 9 anos
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] mb-6 tracking-tight">
              Pare de perder clientes{" "}
              <span className="text-yellow-400 relative">
                todos os dias
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400/40 rounded-full" />
              </span>{" "}
              por não ter um site que vende.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base sm:text-lg lg:text-xl text-blue-200 font-sans leading-relaxed mb-4 max-w-2xl mx-auto">
              Criamos sites profissionais e estratégias digitais que geram clientes reais — não só visitas. Mais contatos, mais vendas, mais crescimento.
            </motion.p>

            <motion.p variants={fadeUp} className="text-sm sm:text-base text-yellow-300/90 font-sans font-medium italic mb-8 max-w-xl mx-auto">
              "Em 30 minutos de bate-papo, você pode mudar a história da sua empresa."
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-sans font-black px-7 sm:px-8 py-4 rounded-full text-sm sm:text-base transition-all duration-300 shadow-xl shadow-yellow-500/20 hover:shadow-yellow-400/40 hover:scale-[1.03] flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                Quero mais clientes agora
              </a>
              <button
                onClick={scrollToForm}
                className="border border-white/25 hover:border-white/50 text-white font-sans font-semibold px-7 sm:px-8 py-4 rounded-full text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/8 backdrop-blur-sm"
              >
                Agendar sessão gratuita <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 flex justify-center px-4 sm:px-0">
              <ScarcityBadge />
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-blue-300 font-sans text-xs sm:text-sm">
              {["Sem compromisso", "Resultado em 30 dias", "Garantia total"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" /> {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />
      </section>

      {/* ── STATS ── */}
      <section className="bg-blue-800 py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {[
              { value: 3500, suffix: "+", label: "Clientes Conquistados" },
              { value: 9, suffix: " anos", label: "De Experiência" },
              { value: 98, suffix: "%", label: "Clientes Satisfeitos" },
              { value: 150, suffix: "+", label: "Sites Lançados/Ano" },
            ].map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <StatCounter {...s} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROBLEMA ── */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="container max-w-4xl mx-auto relative">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-12">
            <motion.div variants={fadeIn}>
              <SectionLabel>Diagnóstico</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-900 leading-tight max-w-3xl mx-auto">
              Se algum desses problemas parece familiar, então você{" "}
              <span className="font-extrabold underline decoration-yellow-400 decoration-2 underline-offset-2">PRECISA</span>{" "}
              desse diagnóstico!
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={staggerFast} className="grid sm:grid-cols-2 gap-3 mb-12">
            {[
              "Depende de indicações que nunca têm previsibilidade",
              "Já investe em marketing mas o resultado é bem abaixo do esperado",
              "Não tem clareza dos dados de investimento e retorno",
              "Depende demais da equipe comercial ou de networking",
              "Não sabe dizer se sua empresa vai crescer até o final do ano",
            ].map((problem) => (
              <motion.div
                key={problem}
                variants={fadeUp}
                className="flex items-start gap-3.5 bg-red-50 border border-red-100 rounded-2xl p-4 sm:p-5 hover:border-red-200 hover:shadow-sm transition-all duration-200"
              >
                <span className="text-lg flex-shrink-0 mt-0.5">😞</span>
                <p className="text-slate-700 font-sans text-sm sm:text-base leading-snug">{problem}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="text-center flex flex-col items-center gap-4">
            <ScarcityBadge />
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-green-500 hover:bg-green-400 text-white font-sans font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-green-500/30 inline-flex items-center gap-2"
            >
              <FaWhatsapp className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" /> Falar com a agência
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── BENEFÍCIOS DO DIAGNÓSTICO ── */}
      <section className="py-20 lg:py-28 bg-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <div className="container max-w-4xl mx-auto relative">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-12">
            <motion.div variants={fadeIn}>
              <SectionLabelLight>O que você recebe</SectionLabelLight>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
              O que você vai receber no diagnóstico...
            </motion.h2>
            <motion.p variants={fadeUp} className="text-blue-200 font-sans text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Em apenas uma sessão, vamos mapear os pontos críticos de crescimento e mostrar com clareza onde estão os gargalos.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={staggerFast} className="grid sm:grid-cols-2 gap-3 mb-12">
            {[
              "Descobrir o potencial máximo do seu mercado no digital",
              "Saber quanto desse mercado você pode dominar com o que já faz hoje",
              "Plano para dominar mais espaço e crescer na internet",
              "Quais ajustes estruturais podem acelerar seus resultados",
            ].map((benefit) => (
              <motion.div
                key={benefit}
                variants={fadeUp}
                className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="w-6 h-6 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-3.5 w-3.5 text-yellow-400" />
                </div>
                <p className="text-white font-sans font-medium text-sm sm:text-base leading-snug">{benefit}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="text-center">
            <p className="text-yellow-300/90 font-sans font-medium italic text-sm sm:text-base mb-6">
              "Em 30 minutos de bate-papo, você pode mudar a história da sua empresa."
            </p>
            <button
              onClick={scrollToForm}
              className="group bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-sans font-black px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] shadow-xl shadow-yellow-500/20 hover:shadow-yellow-400/30 inline-flex items-center gap-2"
            >
              Quero meu diagnóstico gratuito <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />
      </section>

      {/* ── SERVIÇOS ── */}
      <section className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-14">
            <motion.div variants={fadeIn}>
              <SectionLabel>Serviços</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-900 mb-4 leading-tight">
              O que você ganha trabalhando com a gente
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 font-sans text-base sm:text-lg max-w-2xl mx-auto">
              Não vendemos serviços — entregamos resultados mensuráveis para o seu negócio.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              { icon: <Globe className="h-6 w-6" />, title: "Sites que transformam visitantes em clientes", desc: "Um site profissional que vende enquanto você dorme — moderno, rápido e feito para converter.", color: "bg-blue-600", shadow: "shadow-blue-500/20" },
              { icon: <TrendingUp className="h-6 w-6" />, title: "Anúncios que trazem clientes prontos para comprar", desc: "Google e Meta Ads com foco em quem já quer o que você vende — sem desperdício de verba.", color: "bg-yellow-500", shadow: "shadow-yellow-500/20" },
              { icon: <Users className="h-6 w-6" />, title: "Apareça no Google e seja encontrado todo dia", desc: "SEO e conteúdo estratégico para você aparecer quando o cliente precisar exatamente do que você oferece.", color: "bg-green-600", shadow: "shadow-green-500/20" },
              { icon: <Zap className="h-6 w-6" />, title: "Leads qualificados chegando todo mês no automático", desc: "Estratégia completa de inbound marketing para atrair, nutrir e converter sem depender de indicação.", color: "bg-purple-600", shadow: "shadow-purple-500/20" },
            ].map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.25, ease } }}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col cursor-default"
              >
                <div className={`${s.color} ${s.shadow} w-11 h-11 rounded-xl flex items-center justify-center text-white mb-5 flex-shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  {s.icon}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-blue-900 mb-2 leading-snug">{s.title}</h3>
                <p className="text-slate-500 font-sans text-sm leading-relaxed flex-1">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="text-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-sans font-black px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-yellow-400/30 inline-flex items-center gap-2"
            >
              <FaWhatsapp className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" /> Quero mais clientes
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── OFERTA GRATUITA ── */}
      <section className="py-16 lg:py-20 bg-yellow-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #1e3a8a 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="container max-w-4xl mx-auto relative">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="flex flex-col lg:flex-row items-center gap-10">
            <motion.div variants={fadeUp} className="text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 bg-blue-900/10 border border-blue-900/20 text-blue-900 font-sans text-xs sm:text-sm px-4 py-1.5 rounded-full mb-5 font-semibold">
                <Gift className="h-4 w-4" /> 100% Gratuito — Sem Compromisso
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-900 mb-3 leading-tight">
                Ganhe uma análise completa do seu site agora
              </h2>
              <p className="text-blue-800 font-sans text-base sm:text-lg mb-2">
                Descubra exatamente por que você está perdendo clientes e o que fazer para mudar isso.
              </p>
              <ul className="space-y-2 mt-5">
                {[
                  "Diagnóstico completo da sua presença digital",
                  "Oportunidades de crescimento identificadas",
                  "Estratégia personalizada para seu negócio",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-blue-900 font-sans text-sm font-medium">
                    <CheckCircle className="h-4 w-4 text-blue-700 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col gap-3 items-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-blue-900 hover:bg-blue-800 text-white font-sans font-black px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] shadow-xl inline-flex items-center gap-2 whitespace-nowrap"
              >
                <FaWhatsapp className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" /> Falar com a agência
              </a>
              <button onClick={scrollToForm} className="text-blue-900 font-sans text-sm underline hover:text-blue-700 transition-colors duration-200">
                ou preencher formulário
              </button>
              <div className="bg-red-600 text-white font-sans font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <AlertTriangle className="h-3.5 w-3.5" /> Restam apenas {VAGAS_DISPONIVEIS} de {TOTAL_VAGAS} vagas
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── QUEM SOMOS / CEO ── */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="container max-w-5xl mx-auto relative">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <SectionLabel>Sobre nós</SectionLabel>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-900 mb-4 leading-tight">Quem está por trás dos seus resultados</h2>
              <p className="text-slate-500 font-sans text-base sm:text-lg max-w-2xl mx-auto">
                Não somos uma agência qualquer — somos especialistas obsessivos em gerar clientes para negócios brasileiros.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div variants={fadeUp} className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="relative mb-8">
                  <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl scale-110" />
                  <img
                    src="/ceo.jpg"
                    alt="Giovanni Ballarin — CEO da Mestres do Site"
                    className="relative w-44 h-44 rounded-full object-cover object-top shadow-2xl ring-4 ring-yellow-400/50"
                  />
                  <div className="absolute -bottom-3 -right-3 bg-yellow-400 rounded-full px-3 py-1 text-blue-900 text-xs font-black font-sans shadow-lg whitespace-nowrap">
                    CEO & Fundador
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-blue-900 mb-1">Giovanni Ballarin</h3>
                <p className="text-blue-600 font-sans text-sm font-semibold mb-5">CEO da Mestres do Site · Especialista em Marketing Digital</p>
                <p className="text-slate-600 font-sans leading-relaxed mb-4 text-sm sm:text-base">
                  Há mais de 9 anos, Giovanni lidera a transformação digital de negócios em todo o Brasil. Especialista em crescimento, tráfego pago e conversão, ele construiu a Mestres do Site com uma missão clara: garantir que nenhum empresário perca mais clientes por não ter uma presença digital que vende de verdade.
                </p>
                <p className="text-slate-600 font-sans leading-relaxed mb-6 text-sm sm:text-base">
                  Mais de 3.500 empresas já transformaram seus resultados com as estratégias que ele desenvolveu.
                </p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-sans font-bold px-5 py-2.5 rounded-full transition-all duration-300 text-sm shadow-lg hover:shadow-green-500/30">
                  <FaWhatsapp className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" /> Falar com a agência
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Award className="h-6 w-6 text-yellow-500" />, title: "9 anos", desc: "de experiência comprovada em marketing digital" },
                  { icon: <Users className="h-6 w-6 text-blue-500" />, title: "+3.500", desc: "clientes com resultados reais em todo o Brasil" },
                  { icon: <Target className="h-6 w-6 text-green-500" />, title: "98%", desc: "de satisfação dos clientes atendidos" },
                  { icon: <Globe className="h-6 w-6 text-purple-500" />, title: "+150", desc: "sites profissionais lançados por ano" },
                ].map((item) => (
                  <motion.div
                    key={item.title}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col gap-2 hover:shadow-md hover:border-blue-200 transition-all duration-300"
                  >
                    {item.icon}
                    <p className="text-2xl font-black text-blue-900">{item.title}</p>
                    <p className="text-slate-500 font-sans text-xs leading-snug">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="mt-16 bg-blue-900 rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              <Quote className="h-8 w-8 text-yellow-400 mx-auto mb-5 opacity-70 relative" />
              <p className="relative text-blue-100 font-sans text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-6 italic">
                "Todo empresário merece uma presença digital que trabalha por ele 24 horas por dia. Minha missão é garantir que você nunca mais perca um cliente para o concorrente por falta de um site que vende."
              </p>
              <cite className="relative text-yellow-400 font-sans font-bold text-sm not-italic">— Giovanni Ballarin, CEO da Mestres do Site</cite>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-14">
            <motion.div variants={fadeIn}>
              <SectionLabel>Resultados reais</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-900 mb-4 leading-tight">
              Empresários que pararam de perder clientes
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 font-sans text-base sm:text-lg">Resultados reais de quem confiou na Mestres do Site.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              {
                name: "João Silva", city: "São Paulo, SP", role: "Clínica Odontológica", result: "+40 agendamentos/mês",
                text: "Depois que refiz meu site com a Mestres do Site, comecei a receber clientes toda semana pelo Google. Em 2 meses, triplicamos os agendamentos. Não consigo imaginar meu negócio sem eles.",
              },
              {
                name: "Ana Beatriz Lima", city: "Belo Horizonte, MG", role: "Loja de Moda Feminina", result: "+R$18k em vendas/mês",
                text: "Passei de 3 vendas por semana para mais de 15. As campanhas de tráfego pago foram um divisor de águas para minha loja. O ROI é impressionante — para cada R$1 investido, tenho R$8 de retorno.",
              },
              {
                name: "Carlos Mendonça", city: "Curitiba, PR", role: "Escritório de Contabilidade", result: "Primeira página do Google",
                text: "Em 3 meses aparecemos na primeira página do Google para nosso segmento. Hoje recebo em média 12 contatos por semana sem gastar nada em anúncios. O SEO faz o trabalho por mim.",
              },
              {
                name: "Fernanda Costa", city: "Rio de Janeiro, RJ", role: "Consultora de Imagem", result: "+25 novos clientes/mês",
                text: "Nunca pensei que um site pudesse mudar tanto meu negócio. Antes dependia só de indicação. Hoje tenho um fluxo constante de clientes chegando todo mês — e continua crescendo.",
              },
            ].map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.25, ease } }}
                className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 cursor-default"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold font-sans px-3 py-1 rounded-full">{t.result}</span>
                </div>
                <p className="text-slate-600 font-sans text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-sm flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-blue-900 text-sm">{t.name}</p>
                    <div className="flex items-center gap-1.5 text-slate-400 font-sans text-xs">
                      <MapPin className="h-3 w-3" /> {t.city} · {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={fadeUp} className="text-center mt-12">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-sans font-black px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-yellow-400/30 inline-flex items-center gap-2"
            >
              <FaWhatsapp className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" /> Quero ser o próximo caso de sucesso
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── QUEBRA DE OBJEÇÃO ── */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-70 pointer-events-none" />
        <div className="container max-w-3xl mx-auto relative">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <SectionLabel>Antes de continuar</SectionLabel>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-900 leading-tight">
                Mas atenção...
              </h2>
            </motion.div>

            <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-4 mb-5">
              {[
                { label: "Não é aula" },
                { label: "Não é apresentação comercial" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <XCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <p className="text-slate-700 font-sans font-semibold text-base">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-5 bg-blue-900 rounded-2xl p-6 sm:p-7 shadow-xl shadow-blue-900/20">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-blue-900" />
              </div>
              <div className="text-left">
                <p className="text-yellow-400 font-sans text-xs font-bold uppercase tracking-widest mb-1">O que é de verdade</p>
                <p className="text-white font-sans font-bold text-base sm:text-lg leading-snug">
                  É uma conversa estratégica focada na sua realidade
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        <div className="container max-w-3xl mx-auto text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <motion.div variants={fadeIn}>
              <SectionLabelLight>Próximo passo</SectionLabelLight>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              Agende esse negócio{" "}
              <span className="text-yellow-400">agora</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-blue-200 font-sans text-base sm:text-lg mb-10 italic max-w-xl mx-auto">
              "Em 30 minutos de bate-papo, você pode mudar a história da sua empresa."
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 px-4 sm:px-0">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-green-500 hover:bg-green-400 text-white font-sans font-black px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg transition-all duration-300 hover:scale-[1.03] shadow-xl shadow-green-500/20 hover:shadow-green-400/30 inline-flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="h-5 sm:h-6 w-5 sm:w-6 transition-transform duration-200 group-hover:scale-110" /> Falar com a agência agora
              </a>
              <button
                onClick={scrollToForm}
                className="group bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-sans font-black px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg transition-all duration-300 hover:scale-[1.03] shadow-xl shadow-yellow-500/20 hover:shadow-yellow-400/30 inline-flex items-center justify-center gap-2"
              >
                Garantir minha vaga <ArrowRight className="h-5 sm:h-6 w-5 sm:w-6 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </motion.div>
            <motion.div variants={fadeUp} className="flex justify-center">
              <ScarcityBadge />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA MIDDLE ── */}
      <section className="py-16 bg-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="container text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-3 leading-tight">
              Cada dia de espera é um cliente a menos no seu bolso.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-blue-200 font-sans mb-8 max-w-xl mx-auto text-sm sm:text-base">
              Solicite seu orçamento agora e descubra como transformar seu negócio em 30 dias.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group bg-green-500 hover:bg-green-400 text-white font-sans font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/30">
                <FaWhatsapp className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" /> Solicitar Orçamento Grátis
              </a>
              <button onClick={scrollToForm} className="border border-yellow-400/50 hover:border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-sans font-bold px-8 py-4 rounded-full transition-all duration-300 inline-flex items-center justify-center gap-2">
                Agendar Sessão Gratuita <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── GARANTIA ── */}
      <section className="py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <motion.div variants={fadeIn}>
              <SectionLabel>Sem risco</SectionLabel>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-blue-900 mb-4">Risco zero para você</h2>
              <p className="text-slate-500 font-sans leading-relaxed text-base sm:text-lg mb-8 max-w-xl mx-auto">
                Se você não ficar 100% satisfeito nos primeiros 30 dias, devolvemos todo o seu investimento. Sem perguntas, sem burocracia. Resultado ou dinheiro de volta — simples assim.
              </p>
              <button onClick={scrollToForm} className="group bg-blue-700 hover:bg-blue-600 text-white font-sans font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-[1.03] inline-flex items-center gap-2 shadow-lg hover:shadow-blue-600/30">
                Garantir minha vaga agora <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="container max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger}>
            <motion.div variants={fadeIn} className="text-center">
              <SectionLabel>Dúvidas</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-900 mb-2 text-center leading-tight">Perguntas Frequentes</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 font-sans text-center mb-10 text-sm sm:text-base">Tire suas dúvidas agora e dê o primeiro passo.</motion.p>
            <motion.div variants={stagger} className="space-y-3">
              {[
                { question: "Quanto tempo leva para criar meu site?", answer: "Entregamos sites profissionais em 15 a 21 dias úteis após aprovação do briefing. Projetos mais simples podem ser entregues ainda mais rápido." },
                { question: "Meu negócio é pequeno. Vale a pena?", answer: "Exatamente para pequenos negócios o impacto é maior. Um site profissional é o que coloca você no mesmo nível dos grandes — muitas vezes com custo menor do que você imagina." },
                { question: "Qual é o investimento mínimo para tráfego pago?", answer: "Trabalhamos com verbas a partir de R$1.500/mês. Nossa taxa de gestão é cobrada separadamente e o retorno costuma pagar o investimento já no primeiro mês." },
                { question: "Como funciona a análise gratuita?", answer: "É uma reunião de 30 a 45 min onde analisamos sua presença digital atual, identificamos as principais oportunidades de crescimento e apresentamos um plano personalizado. Sem compromisso." },
                { question: "Vocês oferecem suporte após a entrega?", answer: "Sim! Todos os clientes têm suporte técnico e acompanhamento estratégico contínuo. Você nunca fica sozinho depois de fechar." },
                { question: "Posso cancelar quando quiser?", answer: "Nossos contratos são mensais sem fidelidade. Cancele a qualquer momento com aviso prévio de 30 dias." },
              ].map((faq) => (
                <motion.div key={faq.question} variants={fadeUp}><FaqItem {...faq} /></motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FORMULÁRIO ── */}
      <section ref={formRef as React.RefObject<HTMLElement>} className="py-20 lg:py-28 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="container max-w-2xl mx-auto relative">
          <motion.div initial="hidden" whileInView="visible" viewport={vp} variants={stagger} className="text-center mb-10">
            <motion.div variants={fadeIn}>
              <SectionLabelLight>Análise gratuita</SectionLabelLight>
            </motion.div>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-yellow-400/15 border border-yellow-400/25 text-yellow-300 font-sans text-xs sm:text-sm px-4 py-1.5 rounded-full mb-5">
              <Clock className="h-3.5 w-3.5" /> Oferta encerra em {countdown.h}:{countdown.m}:{countdown.s}
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
              Peça sua análise gratuita agora
            </motion.h2>
            <motion.p variants={fadeUp} className="text-blue-200 font-sans text-sm sm:text-base">
              Preencha e entraremos em contato em até 24 horas — ou fale direto no WhatsApp.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-5 flex justify-center">
              <ScarcityBadge />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.7, ease }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl shadow-blue-950/40"
          >
            <AnimatePresence mode="wait">
              {formSuccess ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }} className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-blue-900 mb-2">Recebemos sua solicitação!</h3>
                  <p className="text-slate-500 font-sans mb-7 text-sm sm:text-base">Nossa equipe entrará em contato em até 24 horas. Para resposta imediata, nos chame no WhatsApp.</p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-sans font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/30">
                    <FaWhatsapp className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" /> Falar com a agência agora
                  </a>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit((d) => submitLead.mutate(d))} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-blue-900 mb-1.5 font-sans">Nome completo *</label>
                      <input {...register("nome")} placeholder="João Silva" className="w-full border border-slate-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                      {errors.nome && <p className="text-red-500 text-xs mt-1 font-sans">{errors.nome.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-blue-900 mb-1.5 font-sans">E-mail *</label>
                      <input {...register("email")} type="email" placeholder="joao@empresa.com" className="w-full border border-slate-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-sans">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-blue-900 mb-1.5 font-sans">WhatsApp *</label>
                      <input {...register("telefone")} placeholder="(11) 99999-9999" className="w-full border border-slate-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                      {errors.telefone && <p className="text-red-500 text-xs mt-1 font-sans">{errors.telefone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-blue-900 mb-1.5 font-sans">Empresa</label>
                      <input {...register("empresa")} placeholder="Nome da sua empresa" className="w-full border border-slate-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-blue-900 mb-1.5 font-sans">Cargo / Função</label>
                    <input {...register("cargo")} placeholder="Ex: CEO, Proprietário, Diretor..." className="w-full border border-slate-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                  </div>

                  {submitLead.isError && (
                    <p className="text-red-500 text-sm font-sans bg-red-50 rounded-xl p-3">Ocorreu um erro. Tente novamente ou nos chame no WhatsApp.</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitLead.isPending}
                    className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-60 text-white font-sans font-black py-4 rounded-full text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-600/30"
                  >
                    {submitLead.isPending ? "Enviando..." : "Quero minha análise gratuita"}
                    {!submitLead.isPending && <ArrowRight className="h-5 w-5" />}
                  </button>

                  <div className="relative flex items-center gap-3 py-1">
                    <div className="h-px bg-slate-200 flex-1" />
                    <span className="text-slate-400 font-sans text-xs">ou resposta imediata pelo</span>
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>

                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group w-full bg-green-500 hover:bg-green-400 text-white font-sans font-black py-4 rounded-full text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/30">
                    <FaWhatsapp className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" /> Falar com a agência agora
                  </a>

                  <p className="text-center text-slate-400 font-sans text-xs pt-1">Seus dados estão seguros. Não enviamos spam.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-blue-950 border-t border-blue-900/60 py-14">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
            <div>
              <Logo className="mb-4" />
              <p className="text-blue-400 font-sans text-sm leading-relaxed">
                Transformando negócios brasileiros com presença digital que realmente vende.
              </p>
              <a href="https://www.instagram.com/mestresdosite" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-blue-400 hover:text-white font-sans text-sm transition-colors duration-200">
                <Instagram className="h-4 w-4" /> @mestresdosite
              </a>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 font-sans text-sm uppercase tracking-wider">Contato</h4>
              <div className="space-y-3">
                <a href="tel:+551140000000" className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors duration-200 font-sans text-sm"><Phone className="h-4 w-4" /> (11) 4000-0000</a>
                <a href="mailto:contato@mestresdosite.com.br" className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors duration-200 font-sans text-sm"><Mail className="h-4 w-4" /> contato@mestresdosite.com.br</a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors duration-200 font-sans text-sm"><FaWhatsapp className="h-4 w-4" /> WhatsApp</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 font-sans text-sm uppercase tracking-wider">Redes Sociais</h4>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/mestresdosite" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-800 hover:bg-blue-700 rounded-xl flex items-center justify-center text-blue-400 hover:text-white transition-all duration-200"><Instagram className="h-4 w-4" /></a>
                <a href="#" className="w-9 h-9 bg-blue-800 hover:bg-blue-700 rounded-xl flex items-center justify-center text-blue-400 hover:text-white transition-all duration-200"><Facebook className="h-4 w-4" /></a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-green-600 hover:bg-green-500 rounded-xl flex items-center justify-center text-white transition-all duration-200"><FaWhatsapp className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-900/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-blue-600 font-sans text-xs">&copy; {new Date().getFullYear()} Mestres do Site · Giovanni Ballarin. Todos os direitos reservados.</p>
            <a href="/politica-de-privacidade" className="text-blue-600 hover:text-blue-400 font-sans text-xs transition-colors duration-200">Política de Privacidade</a>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ── */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-400 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 hover:shadow-green-400/50 transition-all duration-300 hover:scale-110"
        title="Falar no WhatsApp"
      >
        <FaWhatsapp className="h-7 w-7" />
      </a>
    </div>
  );
}
