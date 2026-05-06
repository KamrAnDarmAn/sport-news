'use client'
import { NAV_LINKS } from '@/constants';
import logo from '@/public/icons/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import searchIcon from '@/public/icons/search.svg';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MenuIcon } from 'lucide-react';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const path = usePathname();

    return (
        <div className='w-full h-16 flex items-center justify-between px-4 font-dm-sans lg:h-20'>
            <Image src={logo} height={34} alt='logo' />

            <nav className='hidden lg:flex space-x-6'>
                {
                    NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}

                            className={`text-sm font-semibold text-[15px] text-dark-500 ${path === link.href && 'font-bold text-dark-900'} transition-colors duration-300`}
                        >
                            {link.name}
                        </Link>
                    ))
                }
            </nav>

            <button
                className='lg:hidden flex items-center justify-center h-8 w-8'
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label='Toggle mobile menu'
            >
                <MenuIcon />
            </button>

            {isMobileMenuOpen && (
                <nav className='absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 lg:hidden'>
                    {
                        NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-semibold text-[15px] text-dark-500 ${path === link.href && 'font-bold text-dark-900'} transition-colors duration-300`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))
                    }
                </nav>
            )}

            <Button className='hidden lg:flex h-8.75 pr-3.75 pl-2.5'>
                <Image src={searchIcon} height={16} width={16} alt='search' /> Search
            </Button>
        </div>
    );
};

export default Navbar;