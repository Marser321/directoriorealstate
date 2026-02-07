'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'

interface ProfileProgressProps {
    agency: {
        logo_url?: string | null
        name?: string
        slug?: string
        [key: string]: any
    }
}

export function ProfileProgress({ agency }: ProfileProgressProps) {
    // Simple scoring logic for the demo
    const steps = [
        { label: 'Registro de Agencia', completed: true },
        { label: 'Logo / Identidad', completed: !!agency.logo_url },
        { label: 'Descripción / Bio', completed: !!agency.description },
        { label: 'Contacto Verificado', completed: !!agency.phone },
        { label: 'Primera Propiedad', completed: false }, // This comes from property fetch
    ]

    const completedCount = steps.filter(s => s.completed).length
    const percentage = Math.round((completedCount / steps.length) * 100)

    return (
        <div className="glass-card p-6 rounded-2xl border border-border/50 bg-gradient-to-br from-gold/5 to-transparent">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                        Estado del Perfil
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Completa tu perfil para mejorar el posicionamiento.
                    </p>
                </div>
                <div className="text-2xl font-serif font-bold text-gold">
                    {percentage}%
                </div>
            </div>

            <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden mb-6">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                />
            </div>

            <div className="space-y-3">
                {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                        {step.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                            <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className={step.completed ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
