"use client";
import Link from 'next/link';import {usePathname,useRouter} from 'next/navigation';
import {Aperture,Menu,X,Sun,Moon,ChevronDown,LogOut,LayoutDashboard,Plus,CalendarDays,Clapperboard} from 'lucide-react';
import {useState} from 'react';import {authClient} from '@/lib/auth';import {useApp} from './Providers';import {toast} from 'sonner';import {api} from '@/lib/api';
export default function Navbar(){
 const path=usePathname(),router=useRouter(),{theme,toggle}=useApp(),{data:session}=authClient.useSession();
 const [menu,setMenu]=useState(false),[account,setAccount]=useState(false);
 const nav=[['/','Home'],['/studios','Explore Studios'],['/how-it-works','How It Works'],['/about','About Us']];
 const signout=async()=>{await api('/security/logout',{method:'POST'}).catch(()=>{});const r=await authClient.signOut();if(r.error)toast.error(r.error.message);else {toast.success('Signed out');setAccount(false);setMenu(false);router.push('/')}};
 return <header className="navbar"><div className="container nav-content">
 <Link href="/" className="brand"><span className="brand-icon"><Aperture size={24}/></span>Studio<span>Space</span><i>.</i></Link>
 <nav className={`nav-links ${menu?'opened':''}`}>{nav.map(([href,label])=><Link key={href} className={path===href?'active':''} onClick={()=>setMenu(false)} href={href}>{label}</Link>)}</nav>
 <div className="nav-actions"><button className="icon-btn" onClick={toggle} aria-label="Toggle theme">{theme==='dark'?<Sun size={19}/>:<Moon size={19}/>}</button>
 {!session?.user?<div className="auth-actions"><Link href="/login" className="btn btn-ghost small">Log in</Link><Link href="/register" className="btn btn-primary small">Get started</Link></div>:<div className="account-wrap">
 <button className="account-btn" onClick={()=>setAccount(!account)} aria-expanded={account}>{session.user.image?<img src={session.user.image} alt=""/>:<span className="avatar-text">{session.user.name?.[0]?.toUpperCase()||'U'}</span>}<ChevronDown size={15}/></button>
 {account&&<div className="account-menu"><p>Signed in as <strong>{session.user.name}</strong><small>{session.user.email}</small></p>
 <Link onClick={()=>setAccount(false)} href="/dashboard"><LayoutDashboard size={16}/> Dashboard</Link><Link onClick={()=>setAccount(false)} href="/add-studio"><Plus size={16}/> Add New Studio</Link><Link onClick={()=>setAccount(false)} href="/my-listings"><Clapperboard size={16}/> My Studio Listings</Link><Link onClick={()=>setAccount(false)} href="/my-bookings"><CalendarDays size={16}/> My Bookings</Link><button onClick={signout}><LogOut size={16}/> Log out</button></div>}
 </div>}
 <button aria-label="Toggle navigation" className="mobile-menu icon-btn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div>
 </div></header>
}