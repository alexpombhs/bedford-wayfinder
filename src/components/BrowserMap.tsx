import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

export type Position = [number, number];
export type BrowserMarker = { coordinate: Position; title: string; color?: string };

function escapePayload(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}

/**
 * Browser-only interactive MapLibre GL JS map. No native MapLibre imports.
 * Uses the same route coordinates and landmark markers as Android.
 */
export function BrowserMap({ coordinates, markers, height = 310 }: {
  coordinates?: Position[] | null;
  markers?: BrowserMarker[];
  height?: number;
}) {
  const html = useMemo(() => {
    const data = escapePayload({ coordinates: coordinates || [], markers: markers || [] });
    return [
      '<!doctype html><html lang="en"><head><meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width,initial-scale=1">',
      '<link href="https://cdn.jsdelivr.net/npm/maplibre-gl@5.7.1/dist/maplibre-gl.css" rel="stylesheet">',
      '<style>html,body,#map{height:100%;width:100%;margin:0;padding:0}body{background:#e4ece6;font-family:system-ui,sans-serif}.error{padding:12px;color:#194a41}</style>',
      '</head><body><div id="map"></div>',
      '<script src="https://cdn.jsdelivr.net/npm/maplibre-gl@5.7.1/dist/maplibre-gl.js"></script>',
      '<script>(function(){',
      'const data=', data, ';',
      "if(!window.maplibregl){document.getElementById('map').innerHTML='<p class=error>Map library unavailable. Check your connection.</p>';return;}",
      "const map=new maplibregl.Map({container:'map',style:'https://tiles.openfreemap.org/styles/liberty',center:[-71.276,42.4906],zoom:12.5});",
      "map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right');",
      "map.on('load',function(){",
      "if(data.coordinates.length>1){map.addSource('tour',{type:'geojson',data:{type:'Feature',properties:{},geometry:{type:'LineString',coordinates:data.coordinates}}});",
      "map.addLayer({id:'tour-line',type:'line',source:'tour',layout:{'line-join':'round','line-cap':'round'},paint:{'line-color':'#194a41','line-width':5}});}",
      "const bounds=new maplibregl.LngLatBounds();",
      "data.coordinates.forEach(function(p){bounds.extend(p)});",
      "data.markers.forEach(function(item){",
      "const el=document.createElement('div');",
      "el.style.cssText='width:30px;height:30px;border:2px solid #fff;border-radius:50%;background:'+(item.color||'#ee2f31')+';color:white;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 7px #0003';",
      "el.textContent=item.title==='Start'?'S':'●';",
      "new maplibregl.Marker({element:el}).setLngLat(item.coordinate).setPopup(new maplibregl.Popup({offset:18}).setText(item.title)).addTo(map);bounds.extend(item.coordinate);",
      "});if(!bounds.isEmpty())map.fitBounds(bounds,{padding:45,maxZoom:15,duration:0});",
      "});map.on('error',function(e){console.warn('Wayfinder map:',e.error?.message||e)});",
      '})();</script></body></html>',
    ].join('');
  }, [coordinates, markers]);

  return <View style={[styles.frame, { height }]}>
    {React.createElement('iframe', {
      title: 'Interactive Bedford Wayfinder map',
      srcDoc: html,
      sandbox: 'allow-scripts',
      style: { width: '100%', height: '100%', display: 'block', border: 0, borderRadius: 10 },
    } as any)}
  </View>;
}
const styles = StyleSheet.create({ frame: { overflow: 'hidden', borderRadius: 10, backgroundColor: '#e4ece6' } });
