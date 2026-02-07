'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize2, Heart } from 'lucide-react';
import { useState, useRef, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFavorites } from '@/hooks/useFavorites';

interface Property {
    id: number | string;
    title: string;
    slug?: string;
    price: number;
    currency: string | null; // Allow null
    bedrooms: number;
    bathrooms: number;
    built_area: number | null; // Allow null
    main_image: string | null; // Allow null
    images?: string[] | null; // Allow null
    location?: string;
    location_name?: string; // Add support for location_name from search results
    status?: string;
    lifestyle_tags?: string[] | null;
    is_featured?: boolean; // Add support for is_featured
}

interface PropertyCardProps {
    property: Property;
    onHover?: (id: string | number | null) => void;
    index?: number;
    className?: string;
}

// Placeholder blur base64 para blur-up effect (gris suave)
const BLUR_PLACEHOLDER = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDBAMBAAAAAAAAAAAAAQIDBAAFEQYSITEHE0FR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQADAQEBAAAAAAAAAAAAAAAAAQIDESH/2gAMAwAAAhEDEQA/9oAzAeJLAuVwuMm4XJC21LUptDYBSgeAD9q60UjyGPQ14lkqf/Z';

export function PropertyCard({ property, onHover, index = 0, className = '' }: PropertyCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // 3D Tilt & Spotlight effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const xPct = useSpring(0, { stiffness: 300, damping: 20 });
    const yPct = useSpring(0, { stiffness: 300, damping: 20 });

    const rotateX = useTransform(yPct, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(xPct, [-0.5, 0.5], [-5, 5]);

    // Hook de favoritos
    const { isFavorite, toggleFavorite } = useFavorites();
    const isPropertyFavorite = isFavorite(property.id);

    // Handle images safely
    const images = property.images?.length
        ? property.images
        : property.main_image
            ? [property.main_image]
            : [BLUR_PLACEHOLDER];

    // Handle location fallback
    const locationDisplay = property.location || property.location_name || 'Punta del Este';

    const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        mouseX.set(x);
        mouseY.set(y);

        xPct.set((x / width) - 0.5);
        yPct.set((y / height) - 0.5);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        onHover?.(property.id);

        if (images.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 2000);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        onHover?.(null);
        setCurrentImageIndex(0);

        xPct.set(0);
        yPct.set(0);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const formatPrice = (price: number, currency: string | null | undefined) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`h-full ${className}`}
        >
            <Link href={`/property/${property.id}`} className="block h-full group perspective-1000">
                <motion.article
                    className="property-card relative bg-card rounded-2xl overflow-hidden border border-border/50 transition-all duration-500 h-full"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Glowing Border */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-30"
                        style={{
                            background: useMotionTemplate`
                                radial-gradient(
                                    650px circle at ${mouseX}px ${mouseY}px,
                                    rgba(212, 175, 55, 0.4),
                                    transparent 80%
                                )
                            `,
                        }}
                    />

                    {/* Image Container */}
                    <div className="property-card-image relative aspect-[4/3] overflow-hidden bg-muted">
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-xl scale-110 transition-opacity duration-700"
                            style={{
                                backgroundImage: `url(${BLUR_PLACEHOLDER})`,
                                opacity: imageLoaded ? 0 : 1
                            }}
                        />

                        {/* Main Image with Zoom on Hover */}
                        <div className="absolute inset-0 overflow-hidden">
                            {images.map((img, i) => (
                                <motion.div
                                    key={i}
                                    className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${i === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                    animate={{ scale: isHovered ? 1.05 : 1 }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                    {...(i === 0 ? { layoutId: `property-image-${property.id}` } : {})}
                                >
                                    <Image
                                        src={img}
                                        alt={`${property.title} - Image ${i + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className={`object-cover ${imageLoaded ? 'blur-0' : 'blur-sm'}`}
                                        priority={index < 2}
                                        onLoad={() => setImageLoaded(true)}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* View Details Reveal Button (Hidden now as we use Custom Cursor) */}
                        {/* <div className="absolute inset-0 flex items-end justify-center pb-6 z-20 pointer-events-none">
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="px-5 py-2.5 bg-[#D4AF37]/90 backdrop-blur-md text-white font-medium rounded-full shadow-lg flex items-center gap-2"
                                data-magnetic="true"
                            >
                                Ver Detalles
                                <ArrowUpRight className="w-4 h-4" />
                            </motion.button>
                        </div> */}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Status Badge */}
                        <div className="absolute top-4 left-4 z-10 transition-transform duration-300 group-hover:translate-z-12" style={{ transform: 'translateZ(20px)' }}>
                            <span className="px-3 py-1.5 bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-wider text-white rounded-sm shadow-lg">
                                {property.status?.replace('_', ' ') || 'En Venta'}
                            </span>
                        </div>

                        {/* Favorite Button */}
                        <motion.button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavorite(property.id);
                            }}
                            whileTap={{ scale: 0.9 }}
                            className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 ${isPropertyFavorite
                                ? 'bg-[#D4AF37] text-white'
                                : 'bg-white/90 text-foreground hover:bg-[#D4AF37] hover:text-white'
                                }`}
                            style={{ transform: 'translateZ(20px)' }}
                            data-magnetic="true"
                        >
                            <Heart className={`w-4 h-4 transition-transform ${isPropertyFavorite ? 'fill-current' : ''}`} />
                        </motion.button>

                        {/* Image Counter */}
                        {images.length > 1 && isHovered && (
                            <div className="absolute bottom-4 left-4 z-10 flex gap-1.5" style={{ transform: 'translateZ(20px)' }}>
                                {images.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-[#D4AF37] w-4' : 'bg-white/60'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4 bg-card relative z-20">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-serif text-xl font-bold text-foreground line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                                    {property.title}
                                </h3>
                                <div className="flex items-center text-muted-foreground text-sm mt-1">
                                    <MapPin className="w-3.5 h-3.5 mr-1" />
                                    <span>{locationDisplay}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-bold text-[#D4AF37]">
                                    {formatPrice(property.price, property.currency)}
                                </span>
                            </div>
                        </div>

                        <div className="h-px bg-border" />

                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Bed className="w-4 h-4 text-[#D4AF37]/70" />
                                {property.bedrooms} Dorm
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Bath className="w-4 h-4 text-[#D4AF37]/70" />
                                {property.bathrooms} Baños
                            </span>
                            {property.built_area && (
                                <span className="flex items-center gap-1.5">
                                    <Maximize2 className="w-4 h-4 text-[#D4AF37]/70" />
                                    {property.built_area} m²
                                </span>
                            )}
                        </div>
                    </div>
                </motion.article>
            </Link>
        </motion.div>
    );
}
