'use client'

import { motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import { Bed, Bath, Car, Ruler, FileText, Check } from 'lucide-react'
import { DetailsData, AMENITIES } from './schemas'

interface StepDetailsProps {
    form: UseFormReturn<DetailsData>
}

export function StepDetails({ form }: StepDetailsProps) {
    const { register, formState: { errors }, watch, setValue } = form
    const selectedAmenities = watch('amenities') || []

    const toggleAmenity = (id: string) => {
        const current = selectedAmenities || []
        const newAmenities = current.includes(id)
            ? current.filter(a => a !== id)
            : [...current, id]
        setValue('amenities', newAmenities, { shouldValidate: true })
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {/* Rooms Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Bedrooms */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Bed className="w-4 h-4 text-gold" />
                        Habitaciones *
                    </label>
                    <input
                        {...register('bedrooms', { valueAsNumber: true })}
                        type="number"
                        min={0}
                        max={50}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-center"
                    />
                    {errors.bedrooms && (
                        <span className="text-xs text-red-400 mt-1 block">{errors.bedrooms.message}</span>
                    )}
                </div>

                {/* Bathrooms */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Bath className="w-4 h-4 text-gold" />
                        Baños *
                    </label>
                    <input
                        {...register('bathrooms', { valueAsNumber: true })}
                        type="number"
                        min={0}
                        max={30}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-center"
                    />
                    {errors.bathrooms && (
                        <span className="text-xs text-red-400 mt-1 block">{errors.bathrooms.message}</span>
                    )}
                </div>

                {/* Garage */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Car className="w-4 h-4 text-gold" />
                        Garage
                    </label>
                    <input
                        {...register('garage_spaces', { valueAsNumber: true })}
                        type="number"
                        min={0}
                        max={20}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-center"
                    />
                </div>

                {/* Built Area */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Ruler className="w-4 h-4 text-gold" />
                        M² Construidos *
                    </label>
                    <input
                        {...register('built_area', { valueAsNumber: true })}
                        type="number"
                        min={0}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-center"
                    />
                    {errors.built_area && (
                        <span className="text-xs text-red-400 mt-1 block">{errors.built_area.message}</span>
                    )}
                </div>
            </div>

            {/* Plot Area (optional) */}
            <div className="max-w-xs">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    M² Terreno
                    <span className="text-xs text-muted-foreground">(opcional)</span>
                </label>
                <input
                    {...register('plot_area', { valueAsNumber: true })}
                    type="number"
                    min={0}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                />
            </div>

            {/* Amenities */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                    Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {AMENITIES.map((amenity) => {
                        const isSelected = selectedAmenities.includes(amenity.id)
                        return (
                            <button
                                key={amenity.id}
                                type="button"
                                onClick={() => toggleAmenity(amenity.id)}
                                className={`
                  relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                                        ? 'border-gold bg-gold/10 text-gold'
                                        : 'border-border hover:border-gold/50 text-muted-foreground hover:text-foreground'
                                    }
                `}
                            >
                                <span className="text-xl">{amenity.icon}</span>
                                <span className="text-sm font-medium flex-1">{amenity.label}</span>
                                {isSelected && (
                                    <Check className="w-4 h-4 text-gold" />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Descripción
                    <span className="text-xs text-muted-foreground">(opcional)</span>
                </label>
                <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Describe las características especiales de la propiedad..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all resize-none"
                />
                {errors.description && (
                    <span className="text-xs text-red-400 mt-1 block">{errors.description.message}</span>
                )}
            </div>
        </motion.div>
    )
}
