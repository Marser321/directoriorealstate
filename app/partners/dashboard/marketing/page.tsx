'use client'

import { motion } from 'framer-motion'
import { ServiceRequestForm } from '@/components/marketing/ServiceRequestForm'
import { RequestStatusList } from '@/components/marketing/RequestStatusList'
import { Check, Zap } from 'lucide-react'

// Mock Subscription Data
const currentPlan = {
    name: 'Pack Pro',
    credits_total: 10,
    credits_used: 4,
    renewal_date: '01/03/2026'
}

export default function MarketingPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] p-6 md:p-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                    Agencia de Marketing <span className="text-gold">AI</span>
                </h1>
                <p className="text-muted-foreground mt-1">
                    Solicita contenido profesional generado por IA para tus propiedades.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Request Form & Plan Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Plan Info Banner */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gold/30 p-6 text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Zap className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-gold/20 text-gold text-xs font-bold px-2 py-1 rounded-full border border-gold/30">
                                        PLAN ACTIVO
                                    </span>
                                    <h3 className="text-xl font-bold">{currentPlan.name}</h3>
                                </div>
                                <div className="text-sm text-gray-400">
                                    Tienes <span className="text-white font-bold">{currentPlan.credits_total - currentPlan.credits_used} créditos</span> disponibles este mes.
                                    Renueva el {currentPlan.renewal_date}.
                                </div>
                            </div>

                            <button className="text-sm border border-white/20 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
                                Gestionar Suscripción
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Uso de Créditos</span>
                                <span>{currentPlan.credits_used} / {currentPlan.credits_total}</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gold transition-all duration-1000"
                                    style={{ width: `${(currentPlan.credits_used / currentPlan.credits_total) * 100}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Request Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <ServiceRequestForm />
                    </motion.div>
                </div>

                {/* Right Column: Status List & Info */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <RequestStatusList />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-xl border border-border/50 bg-background/50 p-5"
                    >
                        <h4 className="font-semibold mb-4">¿Qué incluye tu plan?</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                <span>Mejora de fotos con IA (Iluminación, Cielos)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                <span>Generación de descripciones persuasivas</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                <span>Edición de Video Reels para Instagram</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
