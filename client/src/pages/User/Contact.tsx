import { Navbar } from "../../components/User/Navbar";
import { Footer } from "../../components/User/Footer";
import { Phone, Mail, Clock, MessageCircle } from "lucide-react";

const navData = {
    brand: "SpatialFurbish",
    navigation: [
        { label: "Home", href: "/" },
        { label: "Shop", href: "/Shop" },
        { label: "About", href: "/about" },
        { label: "Contact Us", href: "/contact" }
    ],
    footer: {
        brand_description: "Visualizing Comfort, Precisely Modeled",
        social_links: [
            { platform: "facebook", url: "#" },
            { platform: "instagram", url: "#" },
            { platform: "youtube", url: "#" }
        ],
        links: [
            { label: "Privacy", href: "#" },
            { label: "Trends", href: "#" },
            { label: "Contact", href: "#" }
        ],
        copyright: "© 2026 SpatialFurbish furnitures. All rights reserved."
    }
};

export function Contact() {
    return (
        <div className="min-h-screen bg-[#fcfaf8] font-sans text-stone-900 selection:bg-stone-200">
            <Navbar brand={navData.brand} links={navData.navigation} />

            {/* Hero Section */}
            <section className="pt-32 pb-12 bg-[#f5f5f0]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1c1917] mb-6">
                        Let's Design Your Dream Space
                    </h1>
                    <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
                        Have questions about our models or need help with a custom layout? We're here to help you visualize perfection.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">

                        {/* Google Form Embed */}
                        <div className="md:col-span-2">
                            <iframe
                                src="https://docs.google.com/forms/d/e/1FAIpQLSfIwWdroHSI_haGgefAWU05buvXTQ4c4L1rU-wrl71IYqmtFA/viewform?embedded=true"
                                width="100%"
                                height="900"
                                frameBorder="0"
                                marginHeight={0}
                                marginWidth={0}
                                className="rounded-sm border border-stone-200 shadow-sm"
                                title="SpatialFurbish Contact Form"
                            >
                                Loading…
                            </iframe>
                        </div>

                        {/* Contact Info Sidebar */}
                        <div className="md:col-span-1 space-y-8">

                            {/* Customer Service */}
                            <div className="bg-stone-50 p-6 rounded-sm">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-stone-600 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-stone-900 mb-3">
                                            Design Consultation
                                        </h3>
                                        <div className="space-y-2 text-sm text-stone-600">
                                            <p>Monday–Friday: 9am–6pm</p>
                                            <p>Saturday: 10am–4pm</p>
                                            <p>Sunday: Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="bg-stone-50 p-6 rounded-sm">
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-stone-600 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-stone-900 mb-3">Phone</h3>
                                        <a
                                            href="tel:+15551234567"
                                            className="text-sm text-stone-600 hover:text-stone-900 underline"
                                        >
                                            +1 (555) 123-4567
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-stone-50 p-6 rounded-sm">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-stone-600 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-stone-900 mb-3">Email</h3>
                                        <a
                                            href="mailto:hello@spatialfurbish.com"
                                            className="text-sm text-stone-600 hover:text-stone-900 underline"
                                        >
                                            hello@spatialfurbish.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Online Assistance */}
                            <div className="bg-stone-50 p-6 rounded-sm">
                                <div className="flex items-start gap-3">
                                    <MessageCircle className="w-5 h-5 text-stone-600 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-stone-900 mb-3">
                                            Live Design Support
                                        </h3>
                                        <p className="text-sm text-stone-600 mb-4">
                                            Chat with our interior experts for real-time advice.
                                        </p>
                                        <div className="space-y-2">
                                            <a href="#" className="block text-sm text-stone-600 hover:text-stone-900 underline">
                                                WhatsApp Support
                                            </a>
                                            <a href="#" className="block text-sm text-stone-600 hover:text-stone-900 underline">
                                                Messenger
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 bg-[#f5f5f0]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">
                            Visit Our Showroom & Studio
                        </h2>
                        <p className="text-stone-600">Experience our collections in person</p>
                    </div>

                    <div className="w-full h-[500px] rounded-sm overflow-hidden shadow-lg border border-stone-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8217956261387!2d79.84873377401543!3d6.911899593087603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25942865f1bfb%3A0x141db277b60011d8!2sLiberty%20Plaza!5e0!3m2!1sen!2slk!4v1768889645583!5m2!1sen!2slk"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Store Location"
                        />
                    </div>
                </div>
            </section>

            <Footer brand={navData.brand} data={navData.footer} />
        </div>
    );
}
