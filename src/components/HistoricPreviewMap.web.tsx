import React from 'react';
import { BrowserMap } from './BrowserMap';
import type { HistoricPoint } from '../data/historicPoints';

/** Browser uses MapLibre GL JS, never the native React Native map library. */
export function HistoricPreviewMap({ points }: { points: HistoricPoint[] }) {
  return <BrowserMap height={270} markers={points.map((point,index)=>({
    coordinate:[point.longitude,point.latitude] as [number,number],
    title:(index+1)+'. '+point.name, color:'#EE2F31',
  }))} />;
}
