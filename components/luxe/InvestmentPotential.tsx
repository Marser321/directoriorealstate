"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { TrendingUp, DollarSign, Percent, BarChart3 } from "lucide-react"

// Mock Data for Historical Value
const data = [
    { year: '2019', value: 2100 },
    { year: '2020', value: 2250 },
    { year: '2021', value: 2400 },
    { year: '2022', value: 2350 },
    { year: '2023', value: 2600 },
    { year: '2024', value: 2900 },
    { year: '2025', value: 3150 },
]

const CountUp = ({ value, duration = 2, suffix = "" }: { value: number, duration?: number, suffix?: string }) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })

    useEffect(() => {
        if (inView) {
            const end = value
            const totalDuration = duration * 1000

            let startTime: number;
            const animate = (time: number) => {
                if (!startTime) startTime = time;
                const progress = time - startTime;
                const percentage = Math.min(progress / totalDuration, 1);

                // Ease out quart
                const ease = 1 - Math.pow(1 - percentage, 4);

                setCount(Math.floor(ease * end));

                if (progress < totalDuration) {
                    requestAnimationFrame(animate);
                } else {
                    setCount(end);
                }
            };
            requestAnimationFrame(animate);
        }
    }, [inView, value, duration])

    return <span ref={ref}>{count}{suffix}</span>
}


export function InvestmentPotential() {
    return (
        <section className="py-12">
            <div className="mb-8">
                <h3 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
                    <TrendingUp className="text-[#D4AF37]" />
                    Potencial de Inversión
                </h3>
                <p className="text-muted-foreground mt-2">
                    Análisis histórico y proyección de rentabilidad para esta zona.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-muted/30 border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-semibold text-lg">Plusvalía Histórica (USD/m²)</h4>
                        <div className="flex items-center gap-2 text-sm text-[#D4AF37] font-medium bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                            <TrendingUp className="w-4 h-4" /> +12.5% Último Año
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                                <XAxis
                                    dataKey="year"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#888', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#888', fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--background)',
                                        borderColor: 'var(--border)',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                    formatter={(value: number | string | undefined) => [`$${value}`, 'Valor m²']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#D4AF37"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Metrics Section */}
                <div className="space-y-4">
                    <MetricCard
                        label="Retorno Anual Estimado (ROI)"
                        value={8}
                        suffix="%"
                        icon={Percent}
                        subtext="Basado en alquiler temporal"
                    />
                    <MetricCard
                        label="Valor Promedio m² Zona"
                        value={3150}
                        prefix="$"
                        icon={DollarSign}
                        subtext="Zona La Barra - Montoya"
                    />
                    <MetricCard
                        label="Ocupación Promedio"
                        value={85}
                        suffix="%"
                        icon={BarChart3}
                        subtext="Temporada Alta (Dic-Feb)"
                    />
                </div>
            </div>
        </section>
    )
}

interface MetricCardProps {
    label: string
    value: number
    suffix?: string
    prefix?: string
    icon: React.ElementType
    subtext?: string
}

function MetricCard({ label, value, suffix = "", prefix = "", icon: Icon, subtext }: MetricCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
        >
            <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
                <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
                {prefix && <span className="text-2xl font-bold">{prefix}</span>}
                <span className="text-3xl font-serif font-bold tracking-tight">
                    <CountUp value={value} suffix={suffix} />
                </span>
            </div>
            {subtext && <p className="text-xs text-muted-foreground mt-2 border-t border-border pt-2">{subtext}</p>}
        </motion.div>
    )
}
