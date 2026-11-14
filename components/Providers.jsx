"use client";
import {useEffect, useState, createContext, useContext} from 'react';
import {Toaster} from 'sonner';
import {authClient} from '@/lib/auth';
import {api} from '@/lib/api';
export const AppContext = createContext({theme:'light',toggle:()=>{},authReady:false});
export function useApp(){return useContext(AppContext)}
export default function Providers({children}) {
  const [theme,setTheme]=useState('light');
  const [authReady,setAuthReady]=useState(false);
  const {data:session,isPending}=authClient.useSession();
  useEffect(()=>{const saved=localStorage.getItem('studiospace-theme');setTheme(saved==='dark'?'dark':'light')},[]);
  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('studiospace-theme',theme)},[theme]);
  useEffect(()=>{
    let cancelled=false;
    if(isPending)return;
    if(!session?.user){setAuthReady(true);return;}
    setAuthReady(false);
    api('/security/token',{method:'POST'}).catch(()=>{}).finally(()=>{if(!cancelled)setAuthReady(true)});
    return ()=>{cancelled=true};
  },[isPending,session?.user?.id]);
  return <AppContext.Provider value={{theme,toggle:()=>setTheme(t=>t==='light'?'dark':'light'),authReady:!isPending&&authReady}}>
    {children}<Toaster position="top-right" richColors closeButton />
  </AppContext.Provider>;
}