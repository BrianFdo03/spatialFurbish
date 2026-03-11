import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";

interface FooterProps {
    brand: string;
    data: {
        brand_description: string;
        social_links: { platform: string; url: string }[];
        links: { label: string; href: string }[];
        copyright: string;
    };
}

const socialIconMap: Record<string, React.ElementType> = {
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
};

export function Footer({ brand, data }: FooterProps) {
    return (
        <footer className="bg-[#292524] text-stone-400 py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    {/* Brand Column */}
                    <div className="text-center md:text-left">
                        <h3 className="text-white font-serif font-bold text-xl uppercase tracking-wider mb-2">
                            {brand}
                        </h3>
                        <p className="text-sm text-stone-500">{data.brand_description}</p>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex items-center space-x-4">
                        {data.social_links.map((social) => {
                            const Icon = socialIconMap[social.platform];
                            return Icon ? (
                                <a
                                    key={social.platform}
                                    href={social.url}
                                    className="w-10 h-10 bg-stone-700 hover:bg-stone-600 rounded-full flex items-center justify-center transition-colors"
                                    aria-label={social.platform}
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </a>
                            ) : null;
                        })}
                    </div>

                    {/* Links */}
                    <div className="flex items-center space-x-6">
                        {data.links.map((link) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                className="text-sm text-stone-400 hover:text-white transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-stone-800 mt-8 pt-6 text-xs text-center text-stone-600">
                    <p>{data.copyright}</p>
                </div>
            </div>
        </footer>
    );
}
