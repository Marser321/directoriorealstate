import { z } from 'zod'

// ============================================
// STEP 1: Basic Information
// ============================================
export const basicInfoSchema = z.object({
    title: z
        .string()
        .min(10, 'El título debe tener al menos 10 caracteres')
        .max(100, 'El título no puede exceder 100 caracteres'),
    price: z
        .number({ message: 'Ingresa un precio válido' })
        .positive('El precio debe ser mayor a 0')
        .max(100000000, 'Precio demasiado alto'),
    currency: z.enum(['USD', 'UYU']),
    status: z.enum(['for_sale', 'for_rent']),
    property_type: z.enum(['house', 'apartment', 'land', 'commercial']),
})

export type BasicInfoData = z.infer<typeof basicInfoSchema>

// ============================================
// STEP 2: Location
// ============================================
export const locationSchema = z.object({
    address: z
        .string()
        .min(5, 'Ingresa una dirección válida')
        .max(200, 'Dirección demasiado larga'),
    location_id: z
        .number({ message: 'Selecciona una ubicación' })
        .positive('Selecciona una ubicación'),
    latitude: z
        .number()
        .min(-90)
        .max(90)
        .optional(),
    longitude: z
        .number()
        .min(-180)
        .max(180)
        .optional(),
})

export type LocationData = z.infer<typeof locationSchema>

// ============================================
// STEP 3: Details
// ============================================
export const detailsSchema = z.object({
    bedrooms: z
        .number({ message: 'Ingresa un número' })
        .int('Debe ser un número entero')
        .min(0, 'No puede ser negativo')
        .max(50, 'Máximo 50 habitaciones'),
    bathrooms: z
        .number({ message: 'Ingresa un número' })
        .int('Debe ser un número entero')
        .min(0, 'No puede ser negativo')
        .max(30, 'Máximo 30 baños'),
    garage_spaces: z
        .number({ message: 'Ingresa un número' })
        .int('Debe ser un número entero')
        .min(0, 'No puede ser negativo')
        .max(20, 'Máximo 20 espacios'),
    built_area: z
        .number({ message: 'Ingresa un número' })
        .positive('Debe ser mayor a 0')
        .max(100000, 'Área demasiado grande'),
    plot_area: z
        .number({ message: 'Ingresa un número' })
        .min(0, 'No puede ser negativo')
        .max(1000000, 'Área demasiado grande')
        .optional(),
    description: z
        .string()
        .max(5000, 'Descripción demasiado larga')
        .optional(),
    amenities: z.array(z.string()),
})

export type DetailsData = z.infer<typeof detailsSchema>

// ============================================
// STEP 4: Media
// ============================================
export const mediaSchema = z.object({
    images: z
        .array(z.instanceof(File))
        .min(1, 'Sube al menos una imagen')
        .max(20, 'Máximo 20 imágenes'),
    main_image_index: z.number().min(0),
    video_url: z.string().url('URL inválida').optional().or(z.literal('')),
})

export type MediaData = z.infer<typeof mediaSchema>

// ============================================
// Complete Property Schema
// ============================================
export const propertySchema = basicInfoSchema
    .merge(locationSchema)
    .merge(detailsSchema)
    .merge(mediaSchema.omit({ images: true })) // Images handled separately
    .extend({
        image_urls: z.array(z.string()).min(1, 'Se requiere al menos una imagen'),
        main_image: z.string(),
    })

export type PropertyFormData = z.infer<typeof propertySchema>

// ============================================
// Amenities List
// ============================================
export const AMENITIES = [
    { id: 'pool', label: 'Piscina', icon: '🏊' },
    { id: 'ocean_view', label: 'Vista al Mar', icon: '🌊' },
    { id: 'garden', label: 'Jardín', icon: '🌳' },
    { id: 'garage', label: 'Garage', icon: '🚗' },
    { id: 'bbq', label: 'Parrillero', icon: '🔥' },
    { id: 'security', label: 'Seguridad 24h', icon: '🔒' },
    { id: 'gym', label: 'Gimnasio', icon: '💪' },
    { id: 'elevator', label: 'Ascensor', icon: '🛗' },
    { id: 'terrace', label: 'Terraza', icon: '🏠' },
    { id: 'air_conditioning', label: 'Aire Acondicionado', icon: '❄️' },
    { id: 'heating', label: 'Calefacción', icon: '🔥' },
    { id: 'pet_friendly', label: 'Pet Friendly', icon: '🐕' },
] as const

// ============================================
// Property Types
// ============================================
export const PROPERTY_TYPES = [
    { value: 'house', label: 'Casa', icon: '🏠' },
    { value: 'apartment', label: 'Apartamento', icon: '🏢' },
    { value: 'land', label: 'Terreno', icon: '🌍' },
    { value: 'commercial', label: 'Comercial', icon: '🏪' },
] as const
