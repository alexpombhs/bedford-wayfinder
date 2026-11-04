import type { ComponentType } from 'react';
import type { HistoricPoint } from '../data/historicPoints';

/** Type contract shared by the .web.tsx and .native.tsx implementations. */
export declare const HistoricPreviewMap: ComponentType<{ points: HistoricPoint[] }>;
