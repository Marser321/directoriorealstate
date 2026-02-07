'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, CheckCircle2, Film, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react'

// Mock Data
const mockRequests = [
    {
        id: '1',
        type: 'property_photos',
        status: 'completed',
        date: '2024-02-04',
        details: { property_url: '...' }
    },
    {
        id: '2',
        type: 'video_tour',
        status: 'in_progress',
        date: '2024-02-05',
        details: { property_url: '...' }
    },
    {
        id: '3',
        type: 'copywriting',
        status: 'pending',
        date: '2024-02-05',
        details: { property_url: '...' }
    }
]

const statusConfig = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Clock },
    in_progress: { label: 'En Proceso', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: LoaderIcon },
    completed: { label: 'Entregado', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle2 },
    rejected: { label: 'Rechazado', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: AlertCircle },
}

const typeConfig = {
    property_photos: { label: 'Fotos IA', icon: ImageIcon },
    video_tour: { label: 'Video Tour', icon: Film },
    copywriting: { label: 'Copywriting', icon: FileText },
    social_media: { label: 'Social Media', icon: Film },
}

function LoaderIcon(props: any) {
    return <Clock className="animate-pulse" {...props} />
}

export function RequestStatusList() {
    return (
        <Card className="glass-card border-border/50">
            <CardHeader>
                <CardTitle>Estado de Pedidos</CardTitle>
                <CardDescription>Sigue el progreso de tus packs de contenido.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {mockRequests.map((req) => {
                        const StatusIcon = statusConfig[req.status as keyof typeof statusConfig]?.icon || Clock
                        const TypeIcon = typeConfig[req.type as keyof typeof typeConfig]?.icon || FileText

                        return (
                            <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-md bg-muted">
                                        <TypeIcon className="w-4 h-4 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-foreground">
                                            {typeConfig[req.type as keyof typeof typeConfig]?.label || req.type}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {req.date}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className={statusConfig[req.status as keyof typeof statusConfig]?.color}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusConfig[req.status as keyof typeof statusConfig]?.label}
                                </Badge>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
