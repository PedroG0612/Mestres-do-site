import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaWhatsapp } from "react-icons/fa";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle,
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
} from "lucide-react";

const WHATSAPP_NUMBER = "5511940000000";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Vi o site da Mestres do Site e gostaria de saber mais sobre como vocês podem me ajudar a conseguir mais clientes."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const leadSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(8, "Telefone inválido"),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
});
type LeadForm = z.infer<typeof leadSchema>;

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

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="text-center">
      <span ref={ref} className="text-4xl lg:text-5xl font-bold text-yellow-400">
        {count.toLocaleString("pt-BR")}{suffix}
      </span>
      <p className="text-blue-200 font-sans mt-1 text-sm">{label}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-blue-50 transition-colors" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-slate-900 pr-4">{question}</span>
        {open ? <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <p className="px-5 pb-5 text-slate-600 font-sans leading-relaxed bg-white">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

export default function Home() {
  const [formSuccess, setFormSuccess] = useState(false);
  const formRef = useRef<HTMLElement>(null);
  const countdown = useCountdown(24);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadForm>({ resolver: zodResolver(leadSchema) });
  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => { setFormSuccess(true); reset(); setTimeout(() => setFormSuccess(false), 8000); },
  });

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white">

      {/* ── URGENCY BAR ── */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 py-2.5 px-4">
        <div className="container flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-2 text-white font-sans text-sm font-medium">
            <Clock className="h-4 w-4 text-yellow-300 flex-shrink-0" />
            <span>Oferta por tempo limitado – sessão estratégica gratuita encerra em:</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-sm">
            {[countdown.h, countdown.m, countdown.s].map((unit, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="bg-yellow-400 text-blue-900 px-2 py-0.5 rounded font-bold">{unit}</span>
                {i < 2 && <span className="text-yellow-300">:</span>}
              </span>
            ))}
          </div>
          <button onClick={scrollToForm} className="text-yellow-300 underline font-sans text-sm font-semibold hover:text-yellow-200 transition-colors whitespace-nowrap">
            Garantir agora →
          </button>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav className="bg-blue-900 sticky top-0 z-50 shadow-md">
        <div className="container py-4 flex items-center justify-between">
          <div className="text-white font-bold text-xl tracking-tight">
            <span className="text-yellow-400">Mestres</span> do Site
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/mestresdosite" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 text-blue-200 hover:text-white font-sans text-sm transition-colors">
              <Instagram className="h-4 w-4" />
              @mestresdosite
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-sans font-semibold px-4 py-2 rounded-full text-sm transition-colors">
              <FaWhatsapp className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>

        <div className="relative container py-16 lg:py-28">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto text-center">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 font-sans text-sm px-4 py-1.5 rounded-full mb-6">
              <Zap className="h-3.5 w-3.5" />
              +3.500 clientes transformados em 9 anos
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Seu negócio precisa de{" "}
              <span className="text-yellow-400">mais clientes</span>{" "}
              — a gente traz.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg lg:text-xl text-blue-200 font-sans leading-relaxed mb-8 max-w-2xl mx-auto">
              Sites profissionais + Tráfego Pago + SEO + Inbound Marketing.
              Resultado real para quem quer crescer de verdade no digital.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={scrollToForm} className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-sans font-bold px-8 py-4 rounded-full text-base transition-all shadow-lg hover:shadow-yellow-400/40 hover:scale-105 flex items-center justify-center gap-2">
                Agendar Sessão Gratuita
                <ArrowRight className="h-5 w-5" />
              </button>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="border-2 border-green-400/60 hover:border-green-400 bg-green-500/10 hover:bg-green-500/20 text-white font-sans font-semibold px-8 py-4 rounded-full text-base transition-all flex items-center justify-center gap-2">
                <FaWhatsapp className="h-5 w-5 text-green-400" />
                Falar no WhatsApp
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 mt-10 text-blue-300 font-sans text-sm">
              {["Sem compromisso", "Resultado em 30 dias", "Suporte dedicado"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-yellow-400" /> {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-blue-800 py-12">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCounter value={3500} suffix="+" label="Clientes Atendidos" />
            <StatCounter value={9} suffix=" anos" label="De Experiência" />
            <StatCounter value={98} suffix="%" label="Satisfação" />
            <StatCounter value={150} suffix="+" label="Sites Lançados/Ano" />
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
              Você já passou por isso?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 font-sans text-lg max-w-2xl mx-auto">
              Esses são os problemas mais comuns entre empresários que ainda não dominam o digital.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 gap-4">
            {[
              "Site desatualizado que não passa credibilidade",
              "Não aparece no Google quando o cliente pesquisa",
              "Concorrentes tomando seus clientes na internet",
              "Investe em anúncios mas não vê retorno real",
              "Sem tempo para cuidar da presença digital",
              "Não sabe por onde começar com marketing online",
            ].map((problem) => (
              <motion.div key={problem} variants={fadeUp} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                <span className="text-red-500 font-bold text-base mt-0.5">✗</span>
                <p className="text-slate-700 font-sans">{problem}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="mt-10 text-center">
            <p className="text-lg text-blue-900 font-semibold mb-5">Esses problemas têm solução — e nós sabemos como resolver.</p>
            <button onClick={scrollToForm} className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-sans font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow inline-flex items-center gap-2">
              Quero Resolver Agora <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section className="py-16 lg:py-24 bg-blue-50">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
              O que a Mestres do Site entrega
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 font-sans text-lg max-w-2xl mx-auto">
              Soluções completas de presença digital — do site ao cliente na porta.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Globe className="h-7 w-7" />, title: "Sites Profissionais", desc: "Sites modernos, rápidos e otimizados que convertem visitantes em clientes.", color: "bg-blue-600" },
              { icon: <TrendingUp className="h-7 w-7" />, title: "Tráfego Pago", desc: "Campanhas Google e Meta Ads com foco em resultado e ROI positivo.", color: "bg-yellow-500" },
              { icon: <Users className="h-7 w-7" />, title: "Tráfego Orgânico", desc: "SEO e conteúdo estratégico para aparecer no topo do Google.", color: "bg-green-600" },
              { icon: <Zap className="h-7 w-7" />, title: "Inbound Marketing", desc: "Estratégia completa para atrair, nutrir e converter leads qualificados.", color: "bg-purple-600" },
            ].map((s) => (
              <motion.div key={s.title} variants={fadeUp} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 flex flex-col">
                <div className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4`}>{s.icon}</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">{s.title}</h3>
                <p className="text-slate-600 font-sans text-sm leading-relaxed flex-1">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── QUEM SOMOS ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Quem está por trás dos resultados</h2>
              <p className="text-slate-600 font-sans text-lg max-w-2xl mx-auto">
                Somos especialistas em transformar negócios brasileiros com estratégias digitais que realmente funcionam.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeUp} className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="relative mb-6">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-6xl shadow-xl ring-4 ring-yellow-400/40">
                    🧑‍💼
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full px-3 py-1 text-blue-900 text-xs font-bold font-sans shadow">
                    CEO & Fundador
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-1">Ricardo Mestre</h3>
                <p className="text-blue-600 font-sans text-sm font-semibold mb-4">Especialista em Marketing Digital</p>
                <p className="text-slate-600 font-sans leading-relaxed mb-4">
                  Com mais de 9 anos de experiência, Ricardo liderou a transformação digital de mais de 3.500 negócios brasileiros. Especialista em growth, tráfego pago e conversão, ele fundou a Mestres do Site com uma missão clara: colocar pequenas e médias empresas no topo do digital.
                </p>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/mestresdosite" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-sans text-sm font-semibold transition-colors">
                    <Instagram className="h-4 w-4" /> @mestresdosite
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-green-600 hover:text-green-800 font-sans text-sm font-semibold transition-colors">
                    <FaWhatsapp className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Award className="h-6 w-6 text-yellow-500" />, title: "9 anos", desc: "de experiência em marketing digital" },
                  { icon: <Users className="h-6 w-6 text-blue-500" />, title: "+3.500", desc: "clientes atendidos em todo o Brasil" },
                  { icon: <Target className="h-6 w-6 text-green-500" />, title: "98%", desc: "de satisfação dos nossos clientes" },
                  { icon: <Globe className="h-6 w-6 text-purple-500" />, title: "+150", desc: "sites profissionais lançados por ano" },
                ].map((item) => (
                  <div key={item.title} className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col gap-2">
                    {item.icon}
                    <p className="text-2xl font-bold text-blue-900">{item.title}</p>
                    <p className="text-slate-600 font-sans text-xs leading-snug">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="mt-14 bg-blue-900 rounded-2xl p-8 text-center">
              <p className="text-blue-100 font-sans text-lg leading-relaxed max-w-3xl mx-auto mb-6">
                "Nossa missão é simples: colocar o seu negócio na frente de quem já está procurando pelo que você oferece — e garantir que o cliente escolha você."
              </p>
              <cite className="text-yellow-400 font-sans font-semibold text-sm not-italic">— Ricardo Mestre, CEO da Mestres do Site</cite>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA MIDDLE ── */}
      <section className="py-14 bg-yellow-400">
        <div className="container text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-3">
            Pronto para ter mais clientes todo mês?
          </h2>
          <p className="text-blue-800 font-sans mb-6 max-w-xl mx-auto">
            Agende agora sua sessão estratégica gratuita — sem compromisso, com resultado garantido.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={scrollToForm} className="bg-blue-900 hover:bg-blue-800 text-white font-sans font-bold px-8 py-4 rounded-full transition-all hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg">
              Agendar Sessão Gratuita <ArrowRight className="h-5 w-5" />
            </button>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white font-sans font-bold px-8 py-4 rounded-full transition-all hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg">
              <FaWhatsapp className="h-5 w-5" /> Solicitar Orçamento
            </a>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">O que nossos clientes dizem</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 font-sans">Resultados reais de empresários que confiaram na Mestres do Site.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Carlos Mendonça", role: "Clínica Odontológica", text: "Em menos de 2 meses triplicamos os agendamentos online. O investimento se pagou rapidamente." },
              { name: "Ana Beatriz Lima", role: "Loja de Roupas", text: "Passei de 3 vendas por semana para mais de 15! As campanhas foram um divisor de águas." },
              { name: "Roberto Fonseca", role: "Escritório de Contabilidade", text: "O site ficou incrível e já aparecemos na primeira página do Google para nossa cidade." },
              { name: "Fernanda Souza", role: "Pet Shop", text: "Atendimento impecável e resultado acima do esperado. Recomendo para qualquer empresário." },
              { name: "Marcos Oliveira", role: "Construtora", text: "Com o inbound marketing deles chegamos a 40 contatos qualificados por mês." },
              { name: "Julia Castro", role: "Academia de Fitness", text: "Para cada R$1 investido, retornamos mais de R$8 em novos alunos. ROI impressionante." },
            ].map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-700 font-sans text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-blue-900 text-sm">{t.name}</p>
                  <p className="text-slate-500 font-sans text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── GARANTIA ── */}
      <section className="py-14 bg-blue-900">
        <div className="container max-w-3xl mx-auto text-center">
          <Shield className="h-14 w-14 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">Garantia de Satisfação Total</h2>
          <p className="text-blue-200 font-sans leading-relaxed text-lg mb-6">
            Se você não ficar 100% satisfeito nos primeiros 30 dias, devolvemos todo o seu investimento. Sem perguntas, sem burocracia.
          </p>
          <button onClick={scrollToForm} className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-sans font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105 inline-flex items-center gap-2">
            Quero Garantir minha Vaga <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-blue-900 mb-2 text-center">Perguntas Frequentes</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 font-sans text-center mb-10">Tire suas dúvidas antes de falar com a gente.</motion.p>
            <motion.div variants={stagger} className="space-y-3">
              {[
                { question: "Quanto tempo leva para criar meu site?", answer: "Em média, entregamos sites profissionais em 15 a 21 dias úteis após aprovação do briefing e recebimento dos materiais." },
                { question: "Preciso ter um produto digital para contratar?", answer: "Não! Atendemos todos os segmentos — clínicas, lojas, escritórios, academias, restaurantes, construtoras e muito mais." },
                { question: "Qual o investimento mínimo para tráfego pago?", answer: "Trabalhamos com verbas a partir de R$1.500/mês. Nossa taxa de gestão é cobrada separadamente." },
                { question: "Vocês oferecem suporte após a entrega?", answer: "Sim! Todos os clientes têm suporte técnico e acompanhamento estratégico contínuo." },
                { question: "Como funciona a sessão estratégica gratuita?", answer: "É uma reunião de 30 a 45 minutos (online ou presencial) onde entendemos seu negócio e apresentamos as melhores estratégias. Sem compromisso." },
                { question: "Posso cancelar quando quiser?", answer: "Nossos contratos são mensais. Cancele a qualquer momento com aviso prévio de 30 dias." },
              ].map((faq) => (
                <motion.div key={faq.question} variants={fadeUp}><FaqItem {...faq} /></motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FORMULÁRIO ── */}
      <section ref={formRef as React.RefObject<HTMLElement>} className="py-16 lg:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="container max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="text-center mb-10">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 font-sans text-sm px-4 py-1.5 rounded-full mb-4">
              <Clock className="h-3.5 w-3.5" /> Oferta por tempo limitado — {countdown.h}:{countdown.m}:{countdown.s}
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-white mb-4">Agende sua Sessão Estratégica Gratuita</motion.h2>
            <motion.p variants={fadeUp} className="text-blue-200 font-sans text-lg">Preencha e entraremos em contato em até 24 horas.</motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              {formSuccess ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">Recebemos seu contato!</h3>
                  <p className="text-slate-600 font-sans mb-6">Nossa equipe entrará em contato em até 24 horas. Enquanto isso, pode nos chamar diretamente no WhatsApp.</p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-sans font-semibold px-6 py-3 rounded-full transition-colors">
                    <FaWhatsapp className="h-5 w-5" /> Falar no WhatsApp Agora
                  </a>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit((d) => submitLead.mutate(d))} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-1.5 font-sans">Nome completo *</label>
                      <input {...register("nome")} placeholder="João Silva" className="w-full border border-slate-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                      {errors.nome && <p className="text-red-500 text-xs mt-1 font-sans">{errors.nome.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-1.5 font-sans">E-mail *</label>
                      <input {...register("email")} type="email" placeholder="joao@empresa.com" className="w-full border border-slate-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-sans">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-1.5 font-sans">WhatsApp *</label>
                      <input {...register("telefone")} placeholder="(11) 99999-9999" className="w-full border border-slate-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                      {errors.telefone && <p className="text-red-500 text-xs mt-1 font-sans">{errors.telefone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-1.5 font-sans">Empresa</label>
                      <input {...register("empresa")} placeholder="Nome da sua empresa" className="w-full border border-slate-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-1.5 font-sans">Cargo / Função</label>
                    <input {...register("cargo")} placeholder="Ex: CEO, Proprietário, Diretor..." className="w-full border border-slate-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>

                  {submitLead.isError && (
                    <p className="text-red-500 text-sm font-sans bg-red-50 rounded-lg p-3">Ocorreu um erro. Tente novamente ou nos chame no WhatsApp.</p>
                  )}

                  <button type="submit" disabled={submitLead.isPending} className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-sans font-bold py-4 rounded-full text-base transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg">
                    {submitLead.isPending ? "Enviando..." : "Agendar Sessão Gratuita"}
                    {!submitLead.isPending && <ArrowRight className="h-5 w-5" />}
                  </button>

                  <div className="relative flex items-center gap-3">
                    <div className="h-px bg-slate-200 flex-1" />
                    <span className="text-slate-400 font-sans text-xs">ou</span>
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>

                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 hover:bg-green-600 text-white font-sans font-bold py-4 rounded-full text-base transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg">
                    <FaWhatsapp className="h-5 w-5" /> Solicitar Orçamento pelo WhatsApp
                  </a>

                  <p className="text-center text-slate-400 font-sans text-xs">Seus dados estão seguros. Não enviamos spam.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-blue-950 border-t border-blue-900 py-12">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-white font-bold text-xl mb-3"><span className="text-yellow-400">Mestres</span> do Site</div>
              <p className="text-blue-300 font-sans text-sm leading-relaxed">
                Transformando negócios brasileiros com presença digital profissional há 9 anos.
              </p>
              <a href="https://www.instagram.com/mestresdosite" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-blue-400 hover:text-white font-sans text-sm transition-colors">
                <Instagram className="h-4 w-4" /> @mestresdosite
              </a>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 font-sans">Contato</h4>
              <div className="space-y-2">
                <a href="tel:+551140000000" className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors font-sans text-sm"><Phone className="h-4 w-4" /> (11) 4000-0000</a>
                <a href="mailto:contato@mestresdosite.com.br" className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors font-sans text-sm"><Mail className="h-4 w-4" /> contato@mestresdosite.com.br</a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-sans text-sm"><FaWhatsapp className="h-4 w-4" /> WhatsApp</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 font-sans">Redes Sociais</h4>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/mestresdosite" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center text-blue-300 hover:text-white transition-colors"><Instagram className="h-4 w-4" /></a>
                <a href="#" className="w-9 h-9 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center text-blue-300 hover:text-white transition-colors"><Facebook className="h-4 w-4" /></a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center text-white transition-colors"><FaWhatsapp className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-blue-500 font-sans text-xs">&copy; {new Date().getFullYear()} Mestres do Site. Todos os direitos reservados.</p>
            <a href="/politica-de-privacidade" className="text-blue-500 hover:text-blue-300 font-sans text-xs transition-colors">Política de Privacidade</a>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ── */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-green-500/50 transition-all hover:scale-110"
        title="Falar no WhatsApp"
      >
        <FaWhatsapp className="h-7 w-7" />
      </a>
    </div>
  );
}
