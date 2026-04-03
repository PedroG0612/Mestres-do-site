import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-900 py-12">
        <div className="container">
          <a href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-sans text-sm mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </a>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Política de Privacidade</h1>
          <p className="text-slate-400 font-sans mt-2">Última atualização: Abril de 2026</p>
        </div>
      </header>

      {/* Content */}
      <main className="container py-12 lg:py-16">
        <div className="max-w-3xl mx-auto prose prose-slate font-sans">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Informações que Coletamos</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              A Mestres do Site coleta informações pessoais fornecidas voluntariamente por você ao
              preencher nossos formulários de contato, incluindo: nome completo, endereço de e-mail,
              número de telefone, nome da empresa e cargo. Essas informações são essenciais para que
              possamos entrar em contato e oferecer nossos serviços de forma personalizada.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Como Utilizamos suas Informações</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              As informações coletadas são utilizadas exclusivamente para: entrar em contato com você
              sobre nossos serviços; agendar sessões estratégicas; enviar comunicações relevantes sobre
              marketing digital e presença online; e melhorar continuamente a experiência em nosso site.
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para
              fins de marketing.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Proteção de Dados</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Adotamos medidas técnicas e organizacionais adequadas para proteger suas informações
              pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Nosso site
              utiliza certificado SSL para garantir a segurança na transmissão de dados.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Cookies</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Utilizamos cookies para melhorar sua experiência de navegação, analisar o tráfego do
              site e personalizar conteúdo. Você pode configurar seu navegador para recusar cookies,
              embora isso possa afetar algumas funcionalidades do site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Seus Direitos</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de:
              solicitar acesso aos seus dados pessoais; solicitar a correção de dados incompletos ou
              desatualizados; solicitar a exclusão de seus dados; revogar o consentimento para o
              tratamento de dados; e solicitar a portabilidade de seus dados.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Contato</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade,
              entre em contato conosco pelo e-mail contato@mestresdosite.com.br ou pelo telefone
              (11) 4000-0000.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Alterações nesta Política</h2>
            <p className="text-slate-600 leading-relaxed">
              Reservamo-nos o direito de atualizar esta Política de Privacidade a qualquer momento.
              Recomendamos que você revise esta página periodicamente para se manter informado sobre
              como protegemos suas informações.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-8">
        <div className="container text-center">
          <p className="text-xs text-slate-500 font-sans">
            &copy; {new Date().getFullYear()} Mestres do Site. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
