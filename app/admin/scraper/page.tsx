'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { triggerScraper } from '@/app/actions/scraper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Search, ExternalLink, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'

interface ScrapingLog {
    id: string
    agency_url: string
    properties_count: number
    status: 'pending' | 'processing' | 'completed' | 'failed'
    scraped_at: string
    error_message?: string
}

export default function ScraperPage() {
    const [url, setUrl] = useState('')
    const [isPending, startTransition] = useTransition()
    const [logs, setLogs] = useState<ScrapingLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    // Fetch logs on mount
    useEffect(() => {
        fetchLogs()

        // Real-time subscription
        const channel = supabase
            .channel('scraping_logs_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'scraping_logs' },
                () => {
                    fetchLogs()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    async function fetchLogs() {
        const { data, error } = await supabase
            .from('scraping_logs')
            .select('*')
            .order('scraped_at', { ascending: false })
            .limit(20)

        if (error) {
            toast.error('Error al cargar historial')
        } else {
            setLogs(data as ScrapingLog[])
        }
        setIsLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url) return

        startTransition(async () => {
            const result = await triggerScraper(url)

            if (result.success) {
                toast.success('Escaneo iniciado correctamente')
                setUrl('')
                // Optimistic update or wait for real-time
            } else {
                toast.error('Error al iniciar: ' + result.message)
            }
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
            case 'processing': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
            case 'failed': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
            default: return 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">
                        Recolector Autónomo
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Escanea inmobiliarias externas e importa propiedades automáticamente.
                    </p>
                </div>
            </div>

            {/* Scraper Input */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Iniciar Nuevo Escaneo</CardTitle>
                    <CardDescription>
                        Ingresa la URL de la página de "Propiedades" o "Venta" de la inmobiliaria.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="https://ejemplo-inmobiliaria.com/propiedades"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isPending || !url}
                            className="bg-slate-900 hover:bg-slate-800 text-white min-w-[140px]"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Iniciando...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Escanear
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* History Table */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Historial de Escaneos</CardTitle>
                        <CardDescription>
                            Últimos 20 trabajos realizados.
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => fetchLogs()} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Agencia / URL</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Propiedades</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        Cargando historial...
                                    </TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        No hay escaneos registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium text-slate-600">
                                            {new Date(log.scraped_at).toLocaleDateString()} <br />
                                            <span className="text-xs text-slate-400">
                                                {new Date(log.scraped_at).toLocaleTimeString()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 max-w-[300px] truncate" title={log.agency_url}>
                                                {log.agency_url}
                                            </div>
                                            {log.error_message && (
                                                <div className="text-xs text-red-500 mt-1 truncate max-w-[300px]">
                                                    {log.error_message}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={getStatusColor(log.status)}>
                                                {log.status === 'processing' && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                                                {log.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-slate-700">
                                            {log.properties_count}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" asChild>
                                                <a href={log.agency_url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4 text-slate-400" />
                                                </a>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
