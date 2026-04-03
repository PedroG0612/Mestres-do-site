import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle,
  Star,
  MessageCircle,
  ArrowRight,
  TrendingUp,
  Globe,
  Users,
  Zap,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Instagram,
  Facebook,
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

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="text-center">
      <span ref={ref} className="text-4xl lg:text-5xl font-bold text-amber-400">
        {count.toLocaleString("pt-BR")}
        {suffix}
      </span>
      <p className="text-slate-300 font-sans mt-1 text-sm">{label}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-slate-900 pr-4">{question}</span>
        {open ? <ChevronUp className="h-5 w-5 text-amber-500 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-5 text-slate-600 font-sans leading-relaxed bg-white">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [formSuccess, setFormSuccess] = useState(false);
  const formRef = useRef<HTMLElement>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
  });

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setFormSuccess(true);
      reset();
      setTimeout(() => setFormSuccess(false), 8000);
    },
  });

  const onSubmit = (data: LeadForm) => {
    submitLead.mutate(data);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <nav className="relative container py-6 flex items-center justify-between">
          <div className="text-white font-bold text-xl tracking-tight">
            <span className="text-amber-400">Mestres</span> do Site
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-sans font-semibold px-4 py-2 rounded-full text-sm transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </nav>

        <div className="relative container py-16 lg:py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 font-sans text-sm px-4 py-1.5 rounded-full mb-6">
              <Zap className="h-3.5 w-3.5" />
              +3.500 clientes transformados em 9 anos
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Seu negócio merece{" "}
              <span className="gradient-text">mais clientes</span>{" "}
              todo mês
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg lg:text-xl text-slate-300 font-sans leading-relaxed mb-8 max-w-2xl mx-auto">
              Criamos sites profissionais e estratégias de marketing digital que geram resultados reais —
              mais visibilidade, mais contatos e mais vendas para o seu negócio.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToForm}
                className="cta-pulse bg-amber-400 hover:bg-amber-500 text-slate-900 font-sans font-bold px-8 py-4 rounded-full text-base transition-colors flex items-center justify-center gap-2"
              >
                Agendar Sessão Estratégica Gratuita
                <ArrowRight className="h-5 w-5" />
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white/30 hover:border-white/60 text-white font-sans font-semibold px-8 py-4 rounded-full text-base transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5 text-green-400" />
                Falar no WhatsApp
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 mt-10 text-slate-400 font-sans text-sm">
              {["Sem compromisso", "Resultado em 30 dias", "Suporte dedicado"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-amber-400" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-slate-800 py-12">
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Você reconhece esses problemas?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 font-sans text-lg max-w-2xl mx-auto">
              Muitos empresários enfrentam os mesmos desafios no digital — e perdem clientes para a concorrência todos os dias.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid sm:grid-cols-2 gap-4"
          >
            {[
              "Site desatualizado que não passa credibilidade",
              "Não aparece no Google quando o cliente pesquisa",
              "Concorrentes roubando seus clientes na internet",
              "Investe em anúncios mas não vê retorno",
              "Sem tempo para cuidar da presença digital",
              "Não sabe por onde começar com marketing online",
            ].map((problem) => (
              <motion.div
                key={problem}
                variants={fadeUp}
                className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4"
              >
                <span className="text-red-500 text-lg mt-0.5">✗</span>
                <p className="text-slate-700 font-sans">{problem}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="mt-10 text-center"
          >
            <p className="text-lg text-slate-800 font-semibold mb-4">
              Esses problemas têm solução — e nós sabemos como resolver.
            </p>
            <button
              onClick={scrollToForm}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-sans font-bold px-8 py-3.5 rounded-full transition-colors inline-flex items-center gap-2"
            >
              Quero Resolver Agora
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Nossas soluções para o seu crescimento
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 font-sans text-lg max-w-2xl mx-auto">
              Combinamos design, tecnologia e estratégia para colocar seu negócio no topo.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: <Globe className="h-7 w-7" />,
                title: "Criação de Sites",
                desc: "Sites profissionais, responsivos e otimizados que convertem visitantes em clientes.",
                color: "bg-blue-500",
              },
              {
                icon: <TrendingUp className="h-7 w-7" />,
                title: "Tráfego Pago",
                desc: "Campanhas no Google e Meta Ads com foco em resultados e ROI positivo.",
                color: "bg-amber-500",
              },
              {
                icon: <Users className="h-7 w-7" />,
                title: "Tráfego Orgânico",
                desc: "SEO e conteúdo estratégico para aparecer no Google de forma natural.",
                color: "bg-green-500",
              },
              {
                icon: <Zap className="h-7 w-7" />,
                title: "Inbound Marketing",
                desc: "Estratégias completas para atrair, nutrir e converter leads qualificados.",
                color: "bg-purple-500",
              },
            ].map((service) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col"
              >
                <div className={`${service.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 font-sans text-sm leading-relaxed flex-1">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA MIDDLE ── */}
      <section className="py-14 bg-amber-400">
        <div className="container text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
            Pronto para ter mais clientes todo mês?
          </h2>
          <p className="text-slate-700 font-sans mb-6 max-w-xl mx-auto">
            Agende sua sessão estratégica gratuita e descubra como podemos transformar sua presença digital.
          </p>
          <button
            onClick={scrollToForm}
            className="bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold px-8 py-4 rounded-full transition-colors inline-flex items-center gap-2"
          >
            Quero Minha Sessão Gratuita
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              O que nossos clientes dizem
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                name: "Carlos Mendonça",
                role: "Clínica Odontológica",
                text: "Em menos de 2 meses com o novo site, triplicamos os agendamentos online. O investimento se pagou rapidamente.",
                stars: 5,
              },
              {
                name: "Ana Beatriz Lima",
                role: "Loja de Roupas",
                text: "As campanhas de tráfego pago foram um divisor de águas. Passei de 3 vendas por semana para mais de 15!",
                stars: 5,
              },
              {
                name: "Roberto Fonseca",
                role: "Escritório de Contabilidade",
                text: "Profissionalismo total. O site ficou incrível e já aparecemos na primeira página do Google para nossa cidade.",
                stars: 5,
              },
              {
                name: "Fernanda Souza",
                role: "Pet Shop",
                text: "Atendimento impecável e resultado acima do esperado. Recomendo para qualquer empresário que quer crescer.",
                stars: 5,
              },
              {
                name: "Marcos Oliveira",
                role: "Construtora",
                text: "Tínhamos dificuldade em gerar leads qualificados. Com o inbound marketing deles, chegamos a 40 contatos por mês.",
                stars: 5,
              },
              {
                name: "Julia Castro",
                role: "Academia de Fitness",
                text: "O ROI das campanhas é impressionante. Para cada R$1 investido, retornamos mais de R$8 em novos alunos.",
                stars: 5,
              },
            ].map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 font-sans text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-500 font-sans text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── GARANTIA ── */}
      <section className="py-14 bg-slate-900">
        <div className="container max-w-3xl mx-auto text-center">
          <Shield className="h-14 w-14 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Garantia de Satisfação Total
          </h2>
          <p className="text-slate-300 font-sans leading-relaxed text-lg">
            Se você não ficar 100% satisfeito com nosso trabalho nos primeiros 30 dias,
            devolvemos todo o seu investimento. Sem perguntas, sem burocracia.
            Trabalhamos para que você tenha resultado — não o contrário.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 text-center">
              Perguntas Frequentes
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 font-sans text-center mb-10">
              Tire suas dúvidas antes de falar com a gente.
            </motion.p>

            <motion.div variants={stagger} className="space-y-3">
              {[
                {
                  question: "Quanto tempo leva para criar meu site?",
                  answer: "Em média, entregamos sites profissionais em 15 a 21 dias úteis após a aprovação do briefing e recebimento dos materiais.",
                },
                {
                  question: "Preciso ter um produto ou serviço digital para contratar?",
                  answer: "Não! Atendemos empresas de todos os segmentos — clínicas, lojas, escritórios, academias, restaurantes, construtoras e muito mais.",
                },
                {
                  question: "Qual é o investimento mínimo para campanhas de tráfego pago?",
                  answer: "Trabalhamos com orçamentos a partir de R$1.500/mês em verba de mídia. Nossa taxa de gestão é cobrada separadamente.",
                },
                {
                  question: "Vocês oferecem suporte após a entrega?",
                  answer: "Sim! Todos os nossos clientes têm acesso a suporte técnico e acompanhamento estratégico contínuo.",
                },
                {
                  question: "Como funciona a sessão estratégica gratuita?",
                  answer: "É uma reunião de 30 a 45 minutos (online ou presencial) onde entendemos seu negócio, seus objetivos e apresentamos as melhores estratégias para alcançá-los. Sem compromisso.",
                },
                {
                  question: "Posso cancelar quando quiser?",
                  answer: "Nossos contratos são mensais. Você pode cancelar a qualquer momento com aviso prévio de 30 dias.",
                },
              ].map((faq) => (
                <motion.div key={faq.question} variants={fadeUp}>
                  <FaqItem {...faq} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FORMULÁRIO ── */}
      <section ref={formRef as React.RefObject<HTMLElement>} className="py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container max-w-2xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="text-center mb-10"
          >
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Agende sua Sessão Estratégica Gratuita
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-300 font-sans text-lg">
              Preencha o formulário e entraremos em contato em até 24 horas.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {formSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Recebemos seu contato!</h3>
                  <p className="text-slate-600 font-sans mb-6">
                    Nossa equipe entrará em contato em até 24 horas. Enquanto isso, você pode nos chamar diretamente no WhatsApp.
                  </p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-sans font-semibold px-6 py-3 rounded-full transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Falar no WhatsApp Agora
                  </a>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-sans">
                        Nome completo *
                      </label>
                      <input
                        {...register("nome")}
                        placeholder="João Silva"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                      />
                      {errors.nome && <p className="text-red-500 text-xs mt-1 font-sans">{errors.nome.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-sans">
                        E-mail *
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="joao@empresa.com"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-sans">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-sans">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        {...register("telefone")}
                        placeholder="(11) 99999-9999"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                      />
                      {errors.telefone && <p className="text-red-500 text-xs mt-1 font-sans">{errors.telefone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-sans">
                        Empresa
                      </label>
                      <input
                        {...register("empresa")}
                        placeholder="Nome da sua empresa"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-sans">
                      Cargo / Função
                    </label>
                    <input
                      {...register("cargo")}
                      placeholder="Ex: CEO, Diretor, Proprietário..."
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    />
                  </div>

                  {submitLead.isError && (
                    <p className="text-red-500 text-sm font-sans bg-red-50 rounded-lg p-3">
                      Ocorreu um erro. Tente novamente ou nos chame no WhatsApp.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitLead.isPending}
                    className="w-full cta-pulse bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-slate-900 font-sans font-bold py-4 rounded-full text-base transition-colors flex items-center justify-center gap-2"
                  >
                    {submitLead.isPending ? "Enviando..." : "Quero minha sessão gratuita"}
                    {!submitLead.isPending && <ArrowRight className="h-5 w-5" />}
                  </button>

                  <p className="text-center text-slate-400 font-sans text-xs">
                    Seus dados estão seguros. Não enviamos spam.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-slate-400 font-sans text-sm mb-4">Prefere falar agora?</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-sans font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Chamar no WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-white font-bold text-xl mb-3">
                <span className="text-amber-400">Mestres</span> do Site
              </div>
              <p className="text-slate-400 font-sans text-sm leading-relaxed">
                Transformando negócios brasileiros com presença digital profissional há 9 anos.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 font-sans">Contato</h4>
              <div className="space-y-2">
                <a href={`tel:+551140000000`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-sans text-sm">
                  <Phone className="h-4 w-4" /> (11) 4000-0000
                </a>
                <a href="mailto:contato@mestresdosite.com.br" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-sans text-sm">
                  <Mail className="h-4 w-4" /> contato@mestresdosite.com.br
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-sans text-sm">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 font-sans">Redes Sociais</h4>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 font-sans text-xs">
              &copy; {new Date().getFullYear()} Mestres do Site. Todos os direitos reservados.
            </p>
            <a href="/politica-de-privacidade" className="text-slate-500 hover:text-slate-300 font-sans text-xs transition-colors">
              Política de Privacidade
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
