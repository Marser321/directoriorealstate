'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import { Upload, X, Star, Image as ImageIcon, Video, Loader2, Check } from 'lucide-react'
import { MediaData } from './schemas'

interface StepMediaProps {
    form: UseFormReturn<MediaData>
}

interface ImagePreview {
    file: File
    preview: string
    uploading: boolean
    progress: number
    uploaded: boolean
    url?: string
}

export function StepMedia({ form }: StepMediaProps) {
    const { formState: { errors }, watch, setValue } = form
    const [images, setImages] = useState<ImagePreview[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const mainImageIndex = watch('main_image_index') || 0

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
        addImages(files)
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        addImages(files)
    }

    const addImages = (files: File[]) => {
        const newImages: ImagePreview[] = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            uploading: false,
            progress: 0,
            uploaded: false,
        }))

        setImages(prev => {
            const updated = [...prev, ...newImages].slice(0, 20) // Max 20 images
            setValue('images', updated.map(i => i.file), { shouldValidate: true })
            return updated
        })
    }

    const removeImage = (index: number) => {
        setImages(prev => {
            const updated = prev.filter((_, i) => i !== index)
            setValue('images', updated.map(i => i.file), { shouldValidate: true })

            // Adjust main image index if needed
            if (mainImageIndex === index) {
                setValue('main_image_index', 0)
            } else if (mainImageIndex > index) {
                setValue('main_image_index', mainImageIndex - 1)
            }

            return updated
        })
    }

    const setMainImage = (index: number) => {
        setValue('main_image_index', index, { shouldValidate: true })
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {/* Drop Zone */}
            <div
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragging ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/50'}
          ${errors.images ? 'border-red-500/50' : ''}
        `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('image-input')?.click()}
            >
                <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">Arrastra tus imágenes aquí</p>
                        <p className="text-sm text-muted-foreground">o haz clic para seleccionar</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Hasta 20 imágenes • JPG, PNG o WebP
                    </p>
                </div>
            </div>

            {errors.images && (
                <span className="text-xs text-red-400 block">{errors.images.message}</span>
            )}

            {/* Image Preview Grid (Reorderable) */}
            {images.length > 0 && (
                <Reorder.Group
                    axis="y"
                    onReorder={(newOrder) => {
                        setImages(newOrder);
                        setValue('images', newOrder.map(i => i.file), { shouldValidate: true });
                        // Update main image index if separate, but with reorder, index 0 is implicitly main
                        setValue('main_image_index', 0, { shouldValidate: true });
                    }}
                    values={images}
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {images.map((image, index) => (
                            <Reorder.Item
                                key={image.preview}
                                value={image}
                                id={image.preview}
                                layoutId={image.preview}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative aspect-square rounded-xl overflow-hidden group cursor-grab active:cursor-grabbing"
                            >
                                <img
                                    src={image.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover pointer-events-none"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {/* Set as Main (Manual override still useful) */}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setMainImage(index) }}
                                        className={`p-2 rounded-lg transition-all ${mainImageIndex === index
                                            ? 'bg-gold text-white'
                                            : 'bg-white/20 text-white hover:bg-gold hover:text-white'
                                            }`}
                                        title="Imagen principal"
                                    >
                                        <Star className={`w-4 h-4 ${mainImageIndex === index ? 'fill-current' : ''}`} />
                                    </button>

                                    {/* Remove */}
                                    <button
                                        type="button"
                                        onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                                        onClick={(e) => { e.stopPropagation(); removeImage(index) }}
                                        className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-all"
                                        title="Eliminar"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Main Image Badge */}
                                {index === 0 && (
                                    <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-gold text-white text-xs font-medium flex items-center gap-1 shadow-lg">
                                        <Star className="w-3 h-3 fill-current" />
                                        Portada
                                    </div>
                                )}
                                {mainImageIndex === index && index !== 0 && (
                                    <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-medium flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        Principal
                                    </div>
                                )}

                                {/* Upload Progress */}
                                {image.uploading && (
                                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-gold animate-spin mb-2" />
                                        <div className="w-3/4 h-1.5 rounded-full bg-white/20 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gold rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${image.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-white mt-1">{Math.round(image.progress)}%</span>
                                    </div>
                                )}

                                {/* Uploaded Checkmark */}
                                {image.uploaded && (
                                    <div className="absolute bottom-2 right-2 p-1 rounded-full bg-emerald-500 text-white">
                                        <Check className="w-3 h-3" />
                                    </div>
                                )}
                            </Reorder.Item>
                        ))}
                    </AnimatePresence>
                </Reorder.Group>
            )}

            {/* Image Count */}
            {images.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="w-4 h-4" />
                    <span>{images.length} imagen{images.length !== 1 ? 'es' : ''} seleccionada{images.length !== 1 ? 's' : ''}</span>
                </div>
            )}

            {/* Video URL (Optional) */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Video className="w-4 h-4 text-muted-foreground" />
                    Video (opcional)
                </label>
                <input
                    {...form.register('video_url')}
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                />
                {errors.video_url && (
                    <span className="text-xs text-red-400 mt-1 block">{errors.video_url.message}</span>
                )}
            </div>
        </motion.div>
    )
}
