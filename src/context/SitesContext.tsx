import React, { createContext, useContext, useEffect, useState } from 'react';
import { HistoricalSite } from '../data/sites';
import { loadSites } from '../services/sites';
type Context = { sites: HistoricalSite[]; error: string | null; loading: boolean };
const SitesContext = createContext<Context>({ sites: [], error: null, loading: true });
export function SitesProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<HistoricalSite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; loadSites().then((result) => { if (active) setSites(result); }).catch((e) => { if (active) setError(String(e)); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  return <SitesContext.Provider value={{ sites, error, loading }}>{children}</SitesContext.Provider>;
}
export function useSites() { return useContext(SitesContext); }
