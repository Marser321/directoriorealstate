import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, ArrowRight } from 'lucide-react';

export default function PartnersLandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-[#D4AF37]" />
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Portal de <span className="text-[#D4AF37]">Inmobiliarias</span>
            </h1>

            <p className="text-muted-foreground max-w-xl text-lg mb-8">
                Gestiona tus propiedades, analiza el rendimiento y conecta con clientes exclusivos de Luxe Estate.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/partners/dashboard">
                    <Button size="lg" className="min-w-[160px] bg-[#D4AF37] hover:bg-[#B8942F] text-white">
                        Ingresar
                    </Button>
                </Link>
                <Link href="/partners/registro">
                    <Button variant="outline" size="lg" className="min-w-[160px] group">
                        Registrarse <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
