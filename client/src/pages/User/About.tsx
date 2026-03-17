import { Navbar } from "../../components/User/Navbar";
import { Footer } from "../../components/User/Footer";
import { Maximize, Box, PenTool } from "lucide-react";

const navData = {
    brand: "SpatialFurbish",
    navigation: [
        { label: "Home", href: "/" },
        { label: "Shop", href: "/Shop" },
        { label: "About", href: "/about" },
        { label: "Contact Us", href: "/contact" }
    ],
    footer: {
        brand_description: "Visualizing Comfort, Precisely Modeled.",
        links: [
            { label: "All Products", href: "#" },
            { label: "Best Sellers", href: "#" },
            { label: "New Arrivals", href: "#" }
        ],
        contact: {
            email: "hello@spatialfurbish.com",
            phone: "+1 (555) 123-4567"
        },
        copyright: "© 2026 SpatialFurbish furnitures. All rights reserved."
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
                        Designing Spaces, Not Just Filling Them
                    </h1>
                    <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
                        At SpatialFurbish, we bridge the gap between imagination and reality with precision-modeled furniture for every home.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="aspect-square bg-[#f0efe9] flex items-center justify-center rounded-sm overflow-hidden p-8">
                        <img
                            src="https://i.pinimg.com/736x/66/93/00/6693007955898bfed8b66b75bd3e6ea1.jpg"
                            alt="Modern Interior"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-3xl font-serif font-bold text-[#1c1917]">
                            The Art of Spatial Intelligence
                        </h2>
                        <div className="space-y-6 text-stone-600 leading-relaxed">
                            <p>
                                Finding the perfect piece of furniture is specific. It's not just about style; it's about fit, flow, and feeling. Traditional shopping leaves too much to chance—guessing if that sofa will block the doorway or if that table is too small for the room.
                            </p>
                            <p>
                                SpatialFurbish was born to solve this. We combine high-fidelity 3D modeling with curated design to give you a true sense of space. Our platform empowers you to visualize every detail before it arrives at your door.
                            </p>
                            <p>
                                We don't just sell furniture; we provide the tools to architect your comfort. From compact city apartments to sprawling family homes, our collection is engineered to look good and fit perfectly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-24 bg-[#fcfaf8]">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-serif font-bold text-center text-[#1c1917] mb-16">
                        Our Core Values
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#e7e5e4] flex items-center justify-center mb-2">
                                <Maximize className="w-6 h-6 text-stone-600" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-bold text-lg text-[#1c1917]">Precision Reality</h3>
                            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
                                Every model is accurate to the millimeter, ensuring that what you see is exactly what fits in your space.
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#e7e5e4] flex items-center justify-center mb-2">
                                <Box className="w-6 h-6 text-stone-600" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-bold text-lg text-[#1c1917]">Immersive Visualization</h3>
                            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
                                Experience your future room with 3D tools that let you rotate, place, and perfect your layout instantly.
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#e7e5e4] flex items-center justify-center mb-2">
                                <PenTool className="w-6 h-6 text-stone-600" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-bold text-lg text-[#1c1917]">Curated Aesthetics</h3>
                            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
                                We hand-pick designs that blend timeless style with modern functionality, elevating any environment.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer brand={navData.brand} data={navData.footer} />
        </div>
    );
}
