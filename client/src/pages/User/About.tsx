import { Navbar } from "../../components/User/Navbar";
import { Footer } from "../../components/User/Footer";
import { Globe, Plane, Leaf } from "lucide-react";
import sourcingImage from "../../assets/about.png";

// Reusing the same data structure for Navbar/Footer consistency
const navData = {
    brand: "LUMIÈRE",
    navigation: [
        { label: "Home", href: "/" },
        { label: "Shop", href: "/Shop" },
        { label: "About", href: "/about" },
        { label: "Contact Us", href: "/contact" }
    ],
    footer: {
        brand_description: "Natural skincare for the modern lifestyle.",
        links: [
            { label: "All Products", href: "#" },
            { label: "Best Sellers", href: "#" },
            { label: "New Arrivals", href: "#" }
        ],
        contact: {
            email: "hello@lumiere.com",
            phone: "+1 (555) 123-4567"
        },
        copyright: "© 2023 Lumière Skincare. All rights reserved."
    }
};

export function About() {
    return (
        <div className="min-h-screen bg-[#fcfaf8] font-sans text-stone-900 selection:bg-stone-200">
            <Navbar brand={navData.brand} links={navData.navigation} />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-[#f5f5f0]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1c1917] mb-6">
                        Beauty Without Borders
                    </h1>
                    <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
                        Born from a desire to uncover the world's best-kept beauty secrets, LUMIÈRE bridges the gap between ancient global rituals and your daily routine.
                    </p>
                </div>
            </section>

            {/* Sourcing Story Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="aspect-square bg-[#f0efe9] flex items-center justify-center rounded-sm overflow-hidden p-8">
                        <img
                            src={sourcingImage}
                            alt="Sourcing from 5+ countries"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-3xl font-serif font-bold text-[#1c1917]">
                            Curated Global Excellence
                        </h2>
                        <div className="space-y-6 text-stone-600 leading-relaxed">
                            <p>
                                We believe that geography shouldn't limit your skincare choices. That's why we've spent years traveling to remote corners of the globe—from the rose valleys of Bulgaria to the tea plantations of Jeju Island—to source the finest authentic ingredients.
                            </p>
                            <p>
                                Our formulations are not just inspired by these places; they are directly sourced from them. We partner with local artisans and sustainable farms to ensure that every drop of essence captures the true spirit and potency of its origin.
                            </p>
                            <p>
                                Authenticity is at the core of everything we do. Whether it's Argan oil from Morocco or Marula oil from South Africa, we bring you the pure, unadulterated power of nature, verified for quality and sustainability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-serif font-bold text-center text-[#1c1917] mb-16">
                        Our Core Values
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#f0efe9] flex items-center justify-center mb-2">
                                <Globe className="w-6 h-6 text-stone-600" strokeWidth={1} />
                            </div>
                            <h3 className="font-bold text-lg text-[#1c1917]">Globally Sourced</h3>
                            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
                                We travel the world to find potent ingredients in their native environments, ensuring maximum efficacy and authenticity.
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#f0efe9] flex items-center justify-center mb-2">
                                <Plane className="w-6 h-6 text-stone-600" strokeWidth={1} />
                            </div>
                            <h3 className="font-bold text-lg text-[#1c1917]">Direct Import</h3>
                            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
                                By cutting out middlemen and working directly with local producers, we ensure fair trade practices and fresher products.
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#f0efe9] flex items-center justify-center mb-2">
                                <Leaf className="w-6 h-6 text-stone-600" strokeWidth={1} />
                            </div>
                            <h3 className="font-bold text-lg text-[#1c1917]">Pure & Authentic</h3>
                            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
                                No fillers, no synthetics. Just the raw, powerful ingredients that have been cherished by cultures for centuries.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer brand={navData.brand} data={navData.footer} />
        </div>
    );
}
