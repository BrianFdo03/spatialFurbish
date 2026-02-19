import { Link } from "react-router-dom";

interface FooterProps {
    brand: string;
    data: {
        brand_description: string;
        links: { label: string; href: string }[];
        contact: { email: string; phone: string };
        copyright: string;
    };
}

export function Footer({ brand, data }: FooterProps) {
    return (
        <footer className="bg-[#292524] text-stone-400 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="text-white font-serif font-bold text-xl uppercase tracking-wider">
                            {brand}
                        </h3>
                        <p className="text-sm leading-relaxed max-w-xs">{data.brand_description}</p>
                    </div>

                    {/* Links Column */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wide">Shop</h4>
                        <ul className="space-y-2">
                            {data.links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="text-sm hover:text-white transition-colors block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wide">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href={`mailto:${data.contact.email}`} className="hover:text-white transition-colors">
                                    {data.contact.email}
                                </a>
                            </li>
                            <li>
                                <span className="block">{data.contact.phone}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-stone-800 pt-8 text-xs text-center md:text-left text-stone-600">
                    <p>{data.copyright}</p>
                </div>
            </div>
        </footer>
    );
}
