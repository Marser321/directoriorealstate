'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    AlertTriangle,
    TrendingUp,
    Search,
    CheckCircle2,
    XCircle,
    RefreshCw,
    MapPin,
    Lightbulb,
    Activity,
    Clock,
    ChevronRight,
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

interface CoverageGap {
    neighborhood: string
    zone: string
    property_category: string
    property_count: number
    priority: 'urgent' | 'high' | 'medium'
}

interface InnovationSuggestion {
    query: string
    search_count: number
    suggested_category: string
}

interface QualityLog {
    id: string
    created_at: string
    entity_type: string
    check_type: string
    is_discrepancy: boolean
    status: string
}

// Mock data for demo when Supabase is not connected
const mockCoverageGaps: CoverageGap[] = [
    { neighborhood: 'Punta Ballena', zone: 'Maldonado', property_category: 'casa_grande', property_count: 0, priority: 'urgent' },
    { neighborhood: 'Manantiales', zone: 'La Barra', property_category: 'apartamento', property_count: 2, priority: 'high' },
    { neighborhood: 'Pinares', zone: 'Punta del Este', property_category: 'casa_media', property_count: 1, priority: 'high' },
]

const mockSuggestions: InnovationSuggestion[] = [
    { query: 'terreno en jose ignacio', search_count: 15, suggested_category: 'terreno' },
    { query: 'local comercial la barra', search_count: 8, suggested_category: 'local_comercial' },
    { query: 'oficina punta del este', search_count: 5, suggested_category: 'oficina' },
]

const mockQualityLogs: QualityLog[] = [
    { id: '1', created_at: new Date().toISOString(), entity_type: 'agency', check_type: 'phone', is_discrepancy: true, status: 'updated' },
    { id: '2', created_at: new Date().toISOString(), entity_type: 'agency', check_type: 'hours', is_discrepancy: false, status: 'detected' },
]

// Stat Card Component
function StatCard({
    icon: Icon,
    label,
    value,
    sublabel,
    color = 'gold'
}: {
    icon: React.ElementType
    label: string
    value: string | number
    sublabel?: string
    color?: 'gold' | 'red' | 'green' | 'blue'
}) {
    const colorClasses = {
        gold: 'from-gold/20 to-gold/5 border-gold/20 text-gold',
        red: 'from-red-500/20 to-red-500/5 border-red-500/20 text-red-500',
        green: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-500',
        blue: 'from-sky-500/20 to-sky-500/5 border-sky-500/20 text-sky-500',
    }

    return (
        <div className={`rounded-xl border bg-gradient-to-br ${colorClasses[color]} p-5`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground mb-1">{label}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    {sublabel && (
                        <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
                    )}
                </div>
                <div className={`p-2 rounded-lg bg-background/50`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    )
}

// Priority Badge Component
function PriorityBadge({ priority }: { priority: string }) {
    const colors = {
        urgent: 'bg-red-500/20 text-red-500 border-red-500/30',
        high: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
        medium: 'bg-sky-500/20 text-sky-500 border-sky-500/30',
    }
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colors[priority as keyof typeof colors] || colors.medium}`}>
            {priority.toUpperCase()}
        </span>
    )
}

export default function ManagerDashboardPage() {
    const [coverageGaps, setCoverageGaps] = useState<CoverageGap[]>(mockCoverageGaps)
    const [suggestions, setSuggestions] = useState<InnovationSuggestion[]>(mockSuggestions)
    const [qualityLogs, setQualityLogs] = useState<QualityLog[]>(mockQualityLogs)
    const [isLoading, setIsLoading] = useState(false)
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

    // Fetch data from Supabase
    const fetchData = async () => {
        if (!supabase) {
            console.warn('[ManagerDashboard] Supabase not configured, using mock data')
            return
        }

        setIsLoading(true)
        try {
            // Fetch coverage gaps
            const { data: gaps } = await supabase.rpc('get_coverage_gaps')
            if (gaps) setCoverageGaps(gaps)

            // Fetch innovation suggestions
            const { data: innovationData } = await supabase.rpc('get_innovation_suggestions', { days_back: 7 })
            if (innovationData) setSuggestions(innovationData)

            // Fetch recent quality logs
            const { data: logs } = await supabase
                .from('data_quality_log')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10)
            if (logs) setQualityLogs(logs)

            setLastRefresh(new Date())
        } catch (error) {
            console.error('[ManagerDashboard] Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const urgentGaps = coverageGaps.filter(g => g.priority === 'urgent').length
    const totalGaps = coverageGaps.length
    const discrepancies = qualityLogs.filter(l => l.is_discrepancy).length

    return (
        <div className="min-h-[calc(100vh-4rem)] p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                            <span className="text-3xl">🧠</span>
                            Manager Agent
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Sistema de Mejora Continua • Health Check Dashboard
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Última actualización: {lastRefresh.toLocaleTimeString()}
                        </span>
                        <button
                            onClick={fetchData}
                            disabled={isLoading}
                            className="btn-luxe py-2 px-4 rounded-xl text-white font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            {isLoading ? 'Actualizando...' : 'Actualizar'}
                        </button>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <StatCard
                        icon={AlertTriangle}
                        label="Gaps Críticos"
                        value={urgentGaps}
                        sublabel={`de ${totalGaps} zonas detectadas`}
                        color={urgentGaps > 0 ? 'red' : 'green'}
                    />
                    <StatCard
                        icon={Search}
                        label="Búsquedas Fallidas"
                        value={suggestions.reduce((acc, s) => acc + s.search_count, 0)}
                        sublabel="últimos 7 días"
                        color="blue"
                    />
                    <StatCard
                        icon={Activity}
                        label="Perfiles Verificados"
                        value={qualityLogs.length}
                        sublabel={`${discrepancies} discrepancias detectadas`}
                        color={discrepancies > 0 ? 'gold' : 'green'}
                    />
                    <StatCard
                        icon={Lightbulb}
                        label="Categorías Sugeridas"
                        value={new Set(suggestions.map(s => s.suggested_category)).size}
                        sublabel="basado en búsquedas"
                        color="gold"
                    />
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Coverage Gaps */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card rounded-xl overflow-hidden"
                    >
                        <div className="p-5 border-b border-border/50 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-red-500" />
                                Gaps de Cobertura
                            </h2>
                            <span className="text-xs text-muted-foreground">Zonas con {'<'}3 propiedades</span>
                        </div>
                        <div className="divide-y divide-border/30">
                            {coverageGaps.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                                    <p>¡Excelente! No hay gaps críticos</p>
                                </div>
                            ) : (
                                coverageGaps.slice(0, 5).map((gap, i) => (
                                    <div key={i} className="p-4 hover:bg-gold/5 transition-colors flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">{gap.neighborhood}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {gap.zone} • {gap.property_category.replace('_', ' ')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                {gap.property_count} props
                                            </span>
                                            <PriorityBadge priority={gap.priority} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {coverageGaps.length > 5 && (
                            <div className="p-3 border-t border-border/50 text-center">
                                <button className="text-sm text-gold hover:underline flex items-center gap-1 mx-auto">
                                    Ver todos ({coverageGaps.length})
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Innovation Suggestions */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card rounded-xl overflow-hidden"
                    >
                        <div className="p-5 border-b border-border/50 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-gold" />
                                Sugerencias de Innovación
                            </h2>
                            <span className="text-xs text-muted-foreground">Búsquedas sin resultados</span>
                        </div>
                        <div className="divide-y divide-border/30">
                            {suggestions.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No hay suficientes búsquedas para sugerir</p>
                                </div>
                            ) : (
                                suggestions.map((suggestion, i) => (
                                    <div key={i} className="p-4 hover:bg-gold/5 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-foreground">"{suggestion.query}"</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {suggestion.search_count} búsquedas • Sugerencia:
                                                    <span className="text-gold ml-1 font-medium">
                                                        {suggestion.suggested_category.replace('_', ' ')}
                                                    </span>
                                                </p>
                                            </div>
                                            <button className="text-xs text-gold hover:underline whitespace-nowrap">
                                                Agregar categoría
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Quality Audit Log */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-xl overflow-hidden"
                >
                    <div className="p-5 border-b border-border/50 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-500" />
                            Historial de Control de Calidad
                        </h2>
                        <span className="text-xs text-muted-foreground">Últimas verificaciones de IA</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/30">
                                <tr className="text-left text-xs text-muted-foreground">
                                    <th className="p-3 font-medium">Fecha</th>
                                    <th className="p-3 font-medium">Entidad</th>
                                    <th className="p-3 font-medium">Tipo de Check</th>
                                    <th className="p-3 font-medium">Discrepancia</th>
                                    <th className="p-3 font-medium">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {qualityLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No hay registros de auditoría
                                        </td>
                                    </tr>
                                ) : (
                                    qualityLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gold/5 transition-colors">
                                            <td className="p-3 text-sm text-muted-foreground">
                                                {new Date(log.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 text-sm font-medium text-foreground capitalize">
                                                {log.entity_type}
                                            </td>
                                            <td className="p-3 text-sm text-muted-foreground capitalize">
                                                {log.check_type}
                                            </td>
                                            <td className="p-3">
                                                {log.is_discrepancy ? (
                                                    <span className="flex items-center gap-1 text-amber-500 text-sm">
                                                        <XCircle className="w-4 h-4" /> Sí
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-emerald-500 text-sm">
                                                        <CheckCircle2 className="w-4 h-4" /> No
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${log.status === 'updated'
                                                        ? 'bg-emerald-500/20 text-emerald-500'
                                                        : 'bg-amber-500/20 text-amber-500'
                                                    }`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
