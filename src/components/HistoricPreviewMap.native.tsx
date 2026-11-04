import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, Map, Marker } from '@maplibre/maplibre-react-native';
import type { CameraRef } from '@maplibre/maplibre-react-native';
import type { HistoricPoint } from '../data/historicPoints';

export function HistoricPreviewMap({ points }: { points: HistoricPoint[] }) {
  const camera = useRef<CameraRef>(null);
  useEffect(() => {
    if (!points.length) return;
    const lons=points.map(p=>p.longitude), lats=points.map(p=>p.latitude);
    const timer=setTimeout(()=>camera.current?.fitBounds(
      [Math.min(...lons),Math.min(...lats),Math.max(...lons),Math.max(...lats)],
      { padding:{top:42,right:42,bottom:42,left:42}, duration:350 },
    ),450);
    return ()=>clearTimeout(timer);
  },[points]);
  return <View style={s.frame}>
    <Map style={StyleSheet.absoluteFill} mapStyle={process.env.EXPO_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty'}>
      <Camera ref={camera} initialViewState={{center:[-71.276,42.493],zoom:12}} />
      {points.map((point,index)=><Marker key={point.id} id={'historic-'+point.id} lngLat={[point.longitude,point.latitude]}>
        <View style={s.pin}><Text style={s.text}>{index+1}</Text></View>
      </Marker>)}
    </Map>
  </View>;
}
const s=StyleSheet.create({
  frame:{height:270,borderRadius:10,overflow:'hidden',backgroundColor:'#E7F0EA'},
  pin:{width:30,height:30,borderRadius:15,backgroundColor:'#EE2F31',borderWidth:2,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
  text:{fontWeight:'700',fontSize:12,color:'#fff'},
});
