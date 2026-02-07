'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-react'

// Note: Ensure Textarea exists or use native
// Since I didn't see Textarea in the list, I will use a native textarea with compoisable classes for now or just standard Input if short.
// Actually, I'll use a styled textarea.

export function ServiceRequestForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [requestType, setRequestType] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        // Reset or show success (Toast)
        alert('Solicitud enviada (Simulación)')
    }

    return (
        <Card className="glass-card border-gold/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold" />
                    Solicitar Nuevo Pack
                </CardTitle>
                <CardDescription>
                    Utiliza tus créditos mensuales para generar contenido premium.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Tipo de Servicio</Label>
                        <Select onValueChange={setRequestType} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un servicio" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="property_photos">Mejora de Fotos IA (Pack 10)</SelectItem>
                                <SelectItem value="video_tour">Edición de Video Tour</SelectItem>
                                <SelectItem value="copywriting">Copywriting Persuasivo</SelectItem>
                                <SelectItem value="social_media">Pack Redes Sociales (Reel + Story)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="url">URL de la Propiedad (Opcional)</Label>
                        <Input id="url" placeholder="https://luxe-estate.com/propiedad/..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instructions">Instrucciones Especiales</Label>
                        <textarea
                            id="instructions"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Ej: Enfocarse en la vista al mar y la cocina renovada..."
                        />
                    </div>

                    <Button type="submit" className="w-full btn-luxe text-white" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            'Generar Solicitud'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
