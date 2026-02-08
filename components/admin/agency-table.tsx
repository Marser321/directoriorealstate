'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface AgencyTableProps {
    agencies: any[]
}

export function AgencyTable({ agencies }: AgencyTableProps) {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Creada</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {agencies.map((agency) => (
                        <TableRow key={agency.id}>
                            <TableCell>
                                {agency.logo_url ? (
                                    <img
                                        src={agency.logo_url}
                                        alt={agency.name}
                                        className="w-10 h-10 object-contain rounded-md bg-slate-50 border"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400">
                                        N/A
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="font-medium">{agency.name}</TableCell>
                            <TableCell className="text-slate-500">{agency.slug}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="capitalize">
                                    {agency.plan || 'Free'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={
                                        agency.status === 'active' ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20' :
                                            'bg-slate-100 text-slate-700'
                                    }
                                >
                                    {agency.status || 'Active'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-slate-500 text-sm">
                                {format(new Date(agency.created_at), 'PPP', { locale: es })}
                            </TableCell>
                        </TableRow>
                    ))}
                    {agencies.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No hay inmobiliarias registradas.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
