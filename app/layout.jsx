import './globals.css';import Providers from '@/components/Providers';import Navbar from '@/components/Navbar';import Footer from '@/components/Footer';
export const metadata={title:{default:'StudioSpace — Make Space for Great Ideas',template:'%s | StudioSpace'},description:'Discover unique creative studios and production spaces. Find, book, and host inspiring spaces on StudioSpace.'};
export default function RootLayout({children}){return <html lang="en" suppressHydrationWarning><body><Providers><Navbar/><main>{children}</main><Footer/></Providers></body></html>}
