'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isPropertyHover, setIsPropertyHover] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring config for smooth movement
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if the target or its parent is interactive
            const isInteractive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.hasAttribute('data-magnetic');

            // Check if hovering over a property card image
            const isPropertyImage = target.closest('.property-card-image');

            setIsHovering(!!isInteractive);
            setIsPropertyHover(!!isPropertyImage);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
                translateX: "-50%",
                translateY: "-50%",
            }}
        >
            <motion.div
                className="bg-[#D4AF37] rounded-full flex items-center justify-center overflow-hidden"
                animate={{
                    width: isPropertyHover ? 120 : isHovering ? 60 : 12,
                    height: isPropertyHover ? 120 : isHovering ? 60 : 12,
                    opacity: 1,
                }}
                transition={{ duration: 0.3, ease: "backOut" }}
            >
                {isPropertyHover && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-black text-[10px] font-bold uppercase tracking-widest text-center leading-tight px-2"
                    >
                        Ver<br />Propiedad
                    </motion.span>
                )}
            </motion.div>
        </motion.div>
    );
}

