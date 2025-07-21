import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Dumbbell, 
  Sparkles, 
  Users, 
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  LogIn
} from 'lucide-react';
import { 
  NetflixPrimaryButton, 
  NetflixSecondaryButton, 
  NetflixOutlineButton,
  NetflixButton
} from '@/components/ui/netflix-buttons';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const programs = [
    {
      title: "Programa de Recomeço",
      description: "Um programa para quem já tentou de tudo. Aqui, você encontra acolhimento, estratégia e motivação real.",
      icon: <Sparkles className="w-8 h-8" />,
      features: ["Acolhimento personalizado", "Estratégia comprovada", "Motivação real"]
    },
    {
      title: "Emagreça com Consciência",
      description: "Você não precisa sofrer para emagrecer. Abordagem integrativa com foco em bem-estar físico e emocional.",
      icon: <Brain className="w-8 h-8" />,
      features: ["Hipnose terapêutica", "Coaching emocional", "Práticas saudáveis"]
    },
    {
      title: "Ative Seu Corpo com Suporte Total",
      description: "Acesso completo à academia sem dor - musculação, pilates, fisioterapia e orientação profissional.",
      icon: <Dumbbell className="w-8 h-8" />,
      features: ["Academia completa", "Pilates sem dor", "Orientação profissional"]
    }
  ];

  const services = [
    { name: "Terapia, Hipnose e Coaching", icon: <Brain className="w-6 h-6" /> },
    { name: "Musculação Sem Dor", icon: <Dumbbell className="w-6 h-6" /> },
    { name: "Estética Avançada", icon: <Sparkles className="w-6 h-6" /> },
    { name: "Pilates", icon: <Target className="w-6 h-6" /> },
    { name: "Programas Personalizados", icon: <Award className="w-6 h-6" /> },
    { name: "Nutrição Funcional", icon: <Heart className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      text: "Encontrei no Instituto dos Sonhos o apoio que precisava. A transformação foi completa - corpo e mente.",
      rating: 5
    },
    {
      name: "Ana Costa",
      text: "Finalmente consegui emagrecer sem sofrimento. A abordagem integrativa fez toda diferença.",
      rating: 5
    },
    {
      name: "Carla Santos",
      text: "A academia sem dor e o acompanhamento personalizado mudaram minha vida. Recomendo para todas!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-900 to-background">
      {/* Header com botão de entrar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">
                Instituto dos <span className="text-primary">Sonhos</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <NetflixPrimaryButton 
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </NetflixPrimaryButton>
              ) : (
                <NetflixPrimaryButton 
                  onClick={() => navigate('/auth')}
                >
                  <LogIn className="mr-2 w-4 h-4" />
                  Entrar
                </NetflixPrimaryButton>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary text-white pt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Instituto dos <span className="text-yellow-300">SONHOS</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Transforme seu corpo e sua vida com uma abordagem integrativa que vai além da balança
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NetflixPrimaryButton size="lg">
                Ver nossos programas
                <ArrowRight className="ml-2 w-5 h-5" />
              </NetflixPrimaryButton>
              <NetflixOutlineButton size="lg">
                Falar conosco
              </NetflixOutlineButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tudo Começa com Uma Escolha */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              "Tudo Começa com Uma Escolha"
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Neste exato momento, milhares de mulheres enfrentam dores, inseguranças e o peso de tantas tentativas frustradas. 
              Mas também existem aquelas que decidiram mudar. No Instituto dos Sonhos, elas encontraram apoio, acolhimento e resultados reais. 
              E você pode ser a próxima.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programas de Transformação */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Programas de Transformação
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Programas personalizados que vão além do emagrecimento, focando na transformação completa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center text-primary">
                      {program.icon}
                    </div>
                    <CardTitle className="text-2xl text-foreground">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-muted-foreground mb-6 text-lg">
                      {program.description}
                    </CardDescription>
                    <ul className="space-y-2 mb-6">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center justify-center text-foreground">
                          <CheckCircle className="w-5 h-5 text-success mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <NetflixPrimaryButton className="w-full">
                      Conheça o programa
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </NetflixPrimaryButton>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços Integrados */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Tudo o Que Você Precisa em Um Só Lugar
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Serviços integrados para sua transformação completa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center text-primary">
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filosofia */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-6">
              Quem Entra, Vive a Transformação por Completo
            </h2>
            <p className="text-xl max-w-4xl mx-auto leading-relaxed">
              No Instituto dos Sonhos, entendemos que emagrecer vai além da balança. 
              Vai além do corpo. É sobre libertar sua mente, reencontrar sua autoestima e recuperar a alegria de viver.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-4">Aqui, você será cuidada por uma equipe que te enxerga como única.</h3>
              <p className="text-lg mb-6">
                Que sabe da sua dor, das suas tentativas frustradas e dos seus sonhos mais íntimos.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-success mr-3" />
                  Terapia, hipnose e coaching emocional
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-success mr-3" />
                  Academia com musculação inteligente e pilates sem dor
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-success mr-3" />
                  Protocolos estéticos com resultados visíveis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-success mr-3" />
                  Acompanhamento nutricional com foco em saúde real
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-success mr-3" />
                  Bioimpedância para conhecer seu corpo profundamente
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-8"
            >
              <h3 className="text-2xl font-bold mb-4">Esse é o seu tempo. Esse é o seu lugar.</h3>
              <p className="text-lg mb-6">
                Você merece ser feliz no seu corpo, com leveza e sem culpa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NetflixPrimaryButton size="lg">
                  Começar Minha Transformação
                  <ArrowRight className="ml-2 w-5 h-5" />
                </NetflixPrimaryButton>
                <NetflixOutlineButton size="lg">
                  Quero Saber Mais
                </NetflixOutlineButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Histórias de Transformação
            </h2>
            <p className="text-xl text-muted-foreground">
              Veja o que nossas clientes dizem sobre suas experiências
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Fale com a Gente e Dê o Primeiro Passo na Sua Transformação
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Estamos aqui para te ajudar a começar sua jornada de transformação
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NetflixPrimaryButton size="lg">
                Falar com o Instituto dos Sonhos
                <ArrowRight className="ml-2 w-5 h-5" />
              </NetflixPrimaryButton>
              <NetflixOutlineButton size="lg">
                Agendar consulta
              </NetflixOutlineButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 