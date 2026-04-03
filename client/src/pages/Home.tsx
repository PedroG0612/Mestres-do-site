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
  Gift,
  MapPin,
  Quote,
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
            <span>Oferta por tempo limitado — análise gratuita encerra em:</span>
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
          <img src="/logo.png" alt="Mestres do Site" className="h-10 w-auto" />
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/mestresdosite" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 text-blue-200 hover:text-white font-sans text-sm transition-colors">
              <Instagram className="h-4 w-4" /> @mestresdosite
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-sans font-semibold px-4 py-2 rounded-full text-sm transition-colors">
              <FaWhatsapp className="h-4 w-4" /> WhatsApp
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
              <Zap className="h-3.5 w-3.5" /> +3.500 clientes conquistados em 9 anos
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Pare de perder clientes{" "}
              <span className="text-yellow-400">todos os dias</span>{" "}
              por não ter um site que vende.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg lg:text-xl text-blue-200 font-sans leading-relaxed mb-8 max-w-2xl mx-auto">
              Criamos sites profissionais e estratégias digitais que geram clientes reais — não só visitas. Mais contatos, mais vendas, mais crescimento.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-sans font-bold px-8 py-4 rounded-full text-base transition-all shadow-lg hover:shadow-yellow-400/40 hover:scale-105 flex items-center justify-center gap-2">
                <FaWhatsapp className="h-5 w-5" /> Quero mais clientes agora
              </a>
              <button onClick={scrollToForm} className="border-2 border-white/30 hover:border-white/60 text-white font-sans font-semibold px-8 py-4 rounded-full text-base transition-all flex items-center justify-center gap-2 hover:bg-white/10">
                Agendar sessão gratuita <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 mt-10 text-blue-300 font-sans text-sm">
              {["Sem compromisso", "Resultado em 30 dias", "Garantia total"].map((item) => (
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
            <StatCounter value={3500} suffix="+" label="Clientes Conquistados" />
            <StatCounter value={9} suffix=" anos" label="De Experiência" />
            <StatCounter value={98} suffix="%" label="Clientes Satisfeitos" />
            <StatCounter value={150} suffix="+" label="Sites Lançados/Ano" />
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
              Seu negócio está invisível para quem quer comprar de você
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 font-sans text-lg max-w-2xl mx-auto">
              Cada dia sem presença digital profissional é dinheiro que vai direto para o seu concorrente.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              "Site desatualizado que não transmite credibilidade",
              "Clientes pesquisam no Google e encontram seu concorrente",
              "Investe em anúncios mas não converte em vendas",
              "Não sabe quantos clientes está perdendo por dia",
              "Presença nas redes sociais sem estratégia real",
              "Sem tempo para cuidar do marketing do próprio negócio",
            ].map((problem) => (
              <motion.div key={problem} variants={fadeUp} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                <span className="text-red-500 font-bold text-base mt-0.5 flex-shrink-0">✗</span>
                <p className="text-slate-700 font-sans">{problem}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center">
            <p className="text-lg text-blue-900 font-bold mb-5">A solução existe — e você pode ter acesso hoje mesmo.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-sans font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2">
              <FaWhatsapp className="h-5 w-5" /> Falar no WhatsApp agora
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── SERVIÇOS (COMO BENEFÍCIOS) ── */}
      <section className="py-16 lg:py-24 bg-blue-50">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
              O que você ganha trabalhando com a gente
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 font-sans text-lg max-w-2xl mx-auto">
              Não vendemos serviços — entregamos resultados mensuráveis para o seu negócio.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { icon: <Globe className="h-7 w-7" />, title: "Sites que transformam visitantes em clientes", desc: "Um site profissional que vende enquanto você dorme — moderno, rápido e feito para converter.", color: "bg-blue-600" },
              { icon: <TrendingUp className="h-7 w-7" />, title: "Anúncios que trazem clientes prontos para comprar", desc: "Google e Meta Ads com foco em quem já quer o que você vende — sem desperdício de verba.", color: "bg-yellow-500" },
              { icon: <Users className="h-7 w-7" />, title: "Apareça no Google e seja encontrado todo dia", desc: "SEO e conteúdo estratégico para você aparecer quando o cliente precisar exatamente do que você oferece.", color: "bg-green-600" },
              { icon: <Zap className="h-7 w-7" />, title: "Leads qualificados chegando todo mês no automático", desc: "Estratégia completa de inbound marketing para atrair, nutrir e converter sem depender de indicação.", color: "bg-purple-600" },
            ].map((s) => (
              <motion.div key={s.title} variants={fadeUp} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 flex flex-col">
                <div className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 flex-shrink-0`}>{s.icon}</div>
                <h3 className="text-base font-bold text-blue-900 mb-2 leading-snug">{s.title}</h3>
                <p className="text-slate-600 font-sans text-sm leading-relaxed flex-1">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-sans font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2">
              <FaWhatsapp className="h-5 w-5" /> Quero mais clientes
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── OFERTA GRATUITA ── */}
      <section className="py-14 bg-yellow-400">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="flex flex-col lg:flex-row items-center gap-8">
            <motion.div variants={fadeUp} className="text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 bg-blue-900/10 border border-blue-900/20 text-blue-900 font-sans text-sm px-4 py-1.5 rounded-full mb-4 font-semibold">
                <Gift className="h-4 w-4" /> 100% Gratuito — Sem Compromisso
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-3 leading-tight">
                Ganhe uma análise completa do seu site agora
              </h2>
              <p className="text-blue-800 font-sans text-lg mb-2">
                Descubra exatamente por que você está perdendo clientes e o que fazer para mudar isso.
              </p>
              <ul className="space-y-2 mt-4">
                {[
                  "Diagnóstico completo da sua presença digital",
                  "Oportunidades de crescimento identificadas",
                  "Estratégia personalizada para seu negócio",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-blue-900 font-sans text-sm font-medium">
                    <CheckCircle className="h-4 w-4 text-blue-700 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col gap-3 items-center">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-blue-900 hover:bg-blue-800 text-white font-sans font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-xl inline-flex items-center gap-2 whitespace-nowrap">
                <FaWhatsapp className="h-5 w-5" /> Quero minha análise gratuita
              </a>
              <button onClick={scrollToForm} className="text-blue-900 font-sans text-sm underline hover:text-blue-700 transition-colors">
                ou preencher formulário
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── QUEM SOMOS / CEO ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Quem está por trás dos seus resultados</h2>
              <p className="text-slate-600 font-sans text-lg max-w-2xl mx-auto">
                Não somos uma agência qualquer — somos especialistas obsessivos em gerar clientes para negócios brasileiros.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeUp} className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="relative mb-6">
                  <img
                    src="/ceo.jpg"
                    alt="Giovanni Ballarin — CEO da Mestres do Site"
                    className="w-44 h-44 rounded-full object-cover object-top shadow-2xl ring-4 ring-yellow-400/60"
                  />
                  <div className="absolute -bottom-3 -right-3 bg-yellow-400 rounded-full px-3 py-1 text-blue-900 text-xs font-bold font-sans shadow-lg whitespace-nowrap">
                    CEO & Fundador
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-1">Giovanni Ballarin</h3>
                <p className="text-blue-600 font-sans text-sm font-semibold mb-4">CEO da Mestres do Site · Especialista em Marketing Digital</p>
                <p className="text-slate-600 font-sans leading-relaxed mb-4">
                  Há mais de 9 anos, Giovanni lidera a transformação digital de negócios em todo o Brasil. Especialista em crescimento, tráfego pago e conversão, ele construiu a Mestres do Site com uma missão clara: garantir que nenhum empresário perca mais clientes por não ter uma presença digital que vende de verdade.
                </p>
                <p className="text-slate-600 font-sans leading-relaxed mb-5">
                  Mais de 3.500 empresas já transformaram seus resultados com as estratégias que ele desenvolveu.
                </p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-sans font-semibold px-5 py-2.5 rounded-full transition-colors text-sm shadow">
                  <FaWhatsapp className="h-4 w-4" /> Falar com Giovanni
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Award className="h-6 w-6 text-yellow-500" />, title: "9 anos", desc: "de experiência comprovada em marketing digital" },
                  { icon: <Users className="h-6 w-6 text-blue-500" />, title: "+3.500", desc: "clientes com resultados reais em todo o Brasil" },
                  { icon: <Target className="h-6 w-6 text-green-500" />, title: "98%", desc: "de satisfação dos clientes atendidos" },
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
              <Quote className="h-8 w-8 text-yellow-400 mx-auto mb-4 opacity-80" />
              <p className="text-blue-100 font-sans text-lg leading-relaxed max-w-3xl mx-auto mb-6 italic">
                "Todo empresário merece uma presença digital que trabalha por ele 24 horas por dia. Minha missão é garantir que você nunca mais perca um cliente para o concorrente por falta de um site que vende."
              </p>
              <cite className="text-yellow-400 font-sans font-bold text-sm not-italic">— Giovanni Ballarin, CEO da Mestres do Site</cite>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="py-16 lg:py-24 bg-blue-50">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
              Empresários que pararam de perder clientes
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 font-sans text-lg">Resultados reais de quem confiou na Mestres do Site.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "João Silva",
                city: "São Paulo, SP",
                role: "Clínica Odontológica",
                result: "+40 agendamentos/mês",
                text: "Depois que refiz meu site com a Mestres do Site, comecei a receber clientes toda semana pelo Google. Em 2 meses, triplicamos os agendamentos. Não consigo imaginar meu negócio sem eles.",
              },
              {
                name: "Ana Beatriz Lima",
                city: "Belo Horizonte, MG",
                role: "Loja de Moda Feminina",
                result: "+R$18k em vendas/mês",
                text: "Passei de 3 vendas por semana para mais de 15. As campanhas de tráfego pago foram um divisor de águas para minha loja. O ROI é impressionante — para cada R$1 investido, tenho R$8 de retorno.",
              },
              {
                name: "Carlos Mendonça",
                city: "Curitiba, PR",
                role: "Escritório de Contabilidade",
                result: "Primeira página do Google",
                text: "Em 3 meses aparecemos na primeira página do Google para nosso segmento. Hoje recebo em média 12 contatos por semana sem gastar nada em anúncios. O SEO faz o trabalho por mim.",
              },
              {
                name: "Fernanda Costa",
                city: "Rio de Janeiro, RJ",
                role: "Consultora de Imagem",
                result: "+25 novos clientes/mês",
                text: "Nunca pensei que um site pudesse mudar tanto meu negócio. Antes dependia só de indicação. Hoje tenho um fluxo constante de clientes chegando todo mês — e continua crescendo.",
              },
            ].map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold font-sans px-3 py-1 rounded-full">{t.result}</span>
                </div>
                <p className="text-slate-700 font-sans text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
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

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center mt-10">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-sans font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2">
              <FaWhatsapp className="h-5 w-5" /> Quero ser o próximo caso de sucesso
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── CTA MIDDLE ── */}
      <section className="py-14 bg-blue-900">
        <div className="container text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
            Cada dia de espera é um cliente a menos no seu bolso.
          </h2>
          <p className="text-blue-200 font-sans mb-6 max-w-xl mx-auto">
            Solicite seu orçamento agora e descubra como transformar seu negócio em 30 dias.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-sans font-bold px-8 py-4 rounded-full transition-all hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg">
              <FaWhatsapp className="h-5 w-5" /> Solicitar Orçamento Grátis
            </a>
            <button onClick={scrollToForm} className="border-2 border-yellow-400/60 hover:border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-sans font-bold px-8 py-4 rounded-full transition-all inline-flex items-center justify-center gap-2">
              Agendar Sessão Gratuita <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── GARANTIA ── */}
      <section className="py-14 bg-white">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <Shield className="h-14 w-14 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-4">Risco zero para você</h2>
              <p className="text-slate-600 font-sans leading-relaxed text-lg mb-6">
                Se você não ficar 100% satisfeito nos primeiros 30 dias, devolvemos todo o seu investimento. Sem perguntas, sem burocracia. Resultado ou dinheiro de volta — simples assim.
              </p>
              <button onClick={scrollToForm} className="bg-blue-700 hover:bg-blue-800 text-white font-sans font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105 inline-flex items-center gap-2 shadow-lg">
                Garantir minha vaga agora <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 lg:py-24 bg-blue-50">
        <div className="container max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-blue-900 mb-2 text-center">Perguntas Frequentes</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 font-sans text-center mb-10">Tire suas dúvidas agora e dê o primeiro passo.</motion.p>
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
      <section ref={formRef as React.RefObject<HTMLElement>} className="py-16 lg:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="container max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="text-center mb-10">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 font-sans text-sm px-4 py-1.5 rounded-full mb-4">
              <Clock className="h-3.5 w-3.5" /> Oferta encerra em {countdown.h}:{countdown.m}:{countdown.s}
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Peça sua análise gratuita agora
            </motion.h2>
            <motion.p variants={fadeUp} className="text-blue-200 font-sans text-lg">
              Preencha e entraremos em contato em até 24 horas — ou fale direto no WhatsApp.
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              {formSuccess ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">Recebemos sua solicitação!</h3>
                  <p className="text-slate-600 font-sans mb-6">Nossa equipe entrará em contato em até 24 horas. Para resposta imediata, nos chame no WhatsApp.</p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-sans font-semibold px-6 py-3 rounded-full transition-colors shadow">
                    <FaWhatsapp className="h-5 w-5" /> Falar no WhatsApp agora
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
                    {submitLead.isPending ? "Enviando..." : "Quero minha análise gratuita"}
                    {!submitLead.isPending && <ArrowRight className="h-5 w-5" />}
                  </button>

                  <div className="relative flex items-center gap-3">
                    <div className="h-px bg-slate-200 flex-1" />
                    <span className="text-slate-400 font-sans text-xs">ou resposta imediata pelo</span>
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>

                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 hover:bg-green-600 text-white font-sans font-bold py-4 rounded-full text-base transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg">
                    <FaWhatsapp className="h-5 w-5" /> Falar no WhatsApp agora
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
              <img src="/logo.png" alt="Mestres do Site" className="h-10 w-auto mb-3" />
              <p className="text-blue-300 font-sans text-sm leading-relaxed">
                Transformando negócios brasileiros com presença digital que realmente vende.
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
            <p className="text-blue-500 font-sans text-xs">&copy; {new Date().getFullYear()} Mestres do Site · Giovanni Ballarin. Todos os direitos reservados.</p>
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
