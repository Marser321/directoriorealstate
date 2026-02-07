'use client'

import { motion } from 'framer-motion'
import { Home, UserCheck, Compass, ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'

interface ActionCardProps {
    icon: typeof Home
    title: string
    description: string
    href: string
    color: 'gold' | 'indigo' | 'emerald'
    delay: number
}

function ActionCard({ icon: Icon, title, description, href, color, delay }: ActionCardProps) {
    const colors = {
        gold: 'border-gold/20 hover:border-gold/50 from-gold/10 to-transparent text-gold',
        indigo: 'border-indigo-500/20 hover:border-indigo-500/50 from-indigo-500/10 to-transparent text-indigo-400',
        emerald: 'border-emerald-500/20 hover:border-emerald-500/50 from-emerald-500/10 to-transparent text-emerald-400',
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group"
        >
            <Link href={href} className={`block p-6 rounded-2xl border bg-gradient-to-br ${colors[color]} backdrop-blur-sm transition-all duration-300`}>
                <div className="flex flex-col h-full">
                    <div className="mb-4 p-3 rounded-xl bg-background/50 w-fit group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-current transition-colors">
                        {title}
                    </h3>
                    <p className="text-muted-foreground text-sm flex-grow">
                        {description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                        Empezar ahora <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export function WelcomeOnboarding() {
    return (
        <div className="space-y-8 py-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center max-w-2xl mx-auto space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold tracking-wider uppercase">
                    ✨ ¡Bienvenido a la Élite!
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                    Tu Dashboard está listo, <br />
                    <span className="text-gold">comencemos a crecer</span>
                </h2>
                <p className="text-muted-foreground">
                    Sigue estos pasos para activar tu presencia y empezar a recibir leads cualificados.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard
                    icon={Plus}
                    title="Publicar Propiedad"
                    description="Sube tu primer inmueble y hazlo visible para miles de inversores."
                    href="/partners/dashboard/new"
                    color="gold"
                    delay={0.1}
                />
                <ActionCard
                    icon={UserCheck}
                    title="Perfil Pro"
                    description="Completa los datos de tu agencia para generar máxima confianza."
                    href="/partners/dashboard"
                    color="indigo"
                    delay={0.2}
                />
                <ActionCard
                    icon={Compass}
                    title="Explorar Mercado"
                    description="Analiza la competencia y encuentra oportunidades en tu zona."
                    href="/"
                    color="emerald"
                    delay={0.3}
                />
            </div>
        </div>
    )
}
