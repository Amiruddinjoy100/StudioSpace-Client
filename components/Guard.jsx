"use client";
import {useEffect} from 'react';import {useRouter,usePathname} from 'next/navigation';import {authClient} from '@/lib/auth';
export default function Guard({children}){const {data,isPending}=authClient.useSession(),router=useRouter(),path=usePathname();
 useEffect(()=>{if(!isPending&&!data?.user)router.replace(`/login?next=${encodeURIComponent(path)}`)},[isPending,data?.user,path,router]);
 if(isPending||!data?.user)return <div className="container page-pad"><div className="spinner"/><p className="muted center">Checking your session…</p></div>;
 return children;
}