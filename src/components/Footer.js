'use client';
import { useMemo } from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const socialLinks = useMemo(() => [
    {
      id: 'tiktok',
      href: '#',
      label: 'TikTok',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 11-2.88-2.88c.37 0 .72.07 1.04.21v-3.5a6.13 6.13 0 00-1.04-.09A6.37 6.37 0 003 15.77a6.37 6.37 0 0012.74 0v-6.87a8.2 8.2 0 004.85 1.52v-3.73z"/>
        </svg>
      )
    },
    {
      id: 'instagram',
      href: 'https://www.instagram.com/potter.x09',
      label: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9a4.5 4.5 0 004.5-4.5V7.5A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z"/>
        </svg>
      )
    },
    {
      id: 'twitter',
      href: '#',
      label: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
        </svg>
      )
    }
  ], []);

  const footerNavigation = useMemo(() => [
    {
      title: 'Help & Support',
      links: [
        { href: '#', label: 'Order & Shipping' },
        { href: '#', label: 'Returns & Refunds' },
        { href: '#', label: 'FAQs' },
        { href: '#', label: 'Contact Us' }
      ]
    },
    {
      title: 'Join Up',
      links: [
        { href: '#', label: 'Modimal Club' },
        { href: '#', label: 'Careers' },
        { href: '#', label: 'Visit Us' }
      ]
    }
  ], []);

  const legalLinks = useMemo(() => [
    { href: '#', label: 'Privacy' },
    { href: '#', label: 'Terms' },
    { href: '#', label: 'Cookies' }
  ], []);

  return (
    <footer className="w-full bg-slate-100 pt-12 md:pt-20 pb-8 md:pb-10 mt-16 md:mt-32 relative border-t border-slate-200">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-10 md:mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">
              YDP Shop
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
              Your trusted online marketplace for quality products at great prices. Shop with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-10 md:mb-12 max-w-xl mx-auto">
            {footerNavigation.map((section) => (
              <div key={section.title} className="text-center md:text-left">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                  {section.title}
                </h4>
                <div className="space-y-2">
                  {section.links.map((link) => (
                    <div key={link.label}>
                      <Link 
                        href={link.href} 
                        className="text-slate-600 hover:text-slate-900 text-sm transition-all duration-200 inline-block hover:translate-x-1"
                      >
                        {link.label}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-3 mb-10 md:mb-12">
            {socialLinks.map((social) => (
              <a 
                key={social.id}
                href={social.href} 
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-8">
            
            <div className="text-slate-600 text-sm">
              © {currentYear} YDP Shop. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              {legalLinks.map((link) => (
                <Link 
                  key={link.label}
                  href={link.href} 
                  className="text-slate-600 hover:text-slate-900 transition-all duration-200 hover:translate-x-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;