import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { features } = body

        // Simulate AI delay for "Vibe"
        await new Promise(resolve => setTimeout(resolve, 2000))

        // In a real scenario, we would call OpenAI here.
        // For now, we return a "High-End" mock description based on the input.

        const adjectives = ['espectacular', 'exclusiva', 'única', 'sofisticada', 'impresionante']
        const status = adjectives[Math.floor(Math.random() * adjectives.length)]

        const description = `
Descubre esta ${status} propiedad que redefine el concepto de lujo y confort. 

Ubicada en una de las zonas más codiciadas, esta residencia ofrece ${features.bedrooms} amplias habitaciones y ${features.bathrooms} baños diseñados con los más finos acabados. Con una superficie construida de ${features.built_area}m², cada espacio ha sido pensado para maximizar la luz natural y las vistas panorámicas.

${features.amenities && features.amenities.length > 0 ? `Disfruta de amenidades de primer nivel como ${features.amenities.slice(0, 3).join(', ')}, que elevan tu estilo de vida.` : ''}

El diseño arquitectónico fusiona elegancia moderna con funcionalidad, creando el escenario perfecto para momentos inolvidables. No es solo una casa, es el hogar que mereces.

Contáctanos hoy para una visita privada.
        `.trim()

        return NextResponse.json({ description })
    } catch (error) {
        console.error('AI Generation Error:', error)
        return NextResponse.json(
            { error: 'Error generando la descripción' },
            { status: 500 }
        )
    }
}
