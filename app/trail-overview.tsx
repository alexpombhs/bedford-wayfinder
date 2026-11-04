import React from 'react';
import { Link, Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HISTORIC_POINTS } from '../src/data/historicPoints';
import { HistoricPreviewMap } from '../src/components/HistoricPreviewMap';

const theme={background:'#F8FAF8',ink:'#1E2C2B',muted:'#667973',green:'#194A41',red:'#EE2F31',border:'#DAE3DC',pale:'#EEF4F0'};
export default function TrailOverview() {
  return <ScrollView style={s.scroll} contentContainerStyle={s.outer}>
    <Stack.Screen options={{title:'Revolutionary Bedford'}} />
    <View style={s.main}>
      <Link href="/" style={s.back}>‹   All historic trails</Link>
      <Text style={s.title}>Discover Historic Bedford</Text>
      <Text style={s.intro}>Five real landmarks. One town full of stories.</Text>
      <View style={s.mapContainer}>
        <View style={s.mapHeading}>
          <Text style={s.sectionLabel}>EXPLORE THE LANDMARKS</Text>
          <Text style={s.mapCount}>5 places</Text>
        </View>
        <HistoricPreviewMap points={HISTORIC_POINTS} />
        <Text style={s.mapCaption}>Pins show verified historical locations, not a calculated walking route.</Text>
      </View>
      <View style={s.summary}>
        <Text style={s.chip}>5 real sites</Text>
        <Text style={s.chip}>Historical stories</Text>
        <Text style={s.chip}>Plan your own route</Text>
      </View>
      <View style={s.sectionRow}>
        <Text style={s.sectionLabel}>PLACES ON THIS TRAIL</Text>
        <Text style={s.mutedSmall}>Tap to explore the map</Text>
      </View>
      <View style={s.list}>
        {HISTORIC_POINTS.map((point,index)=>
          <View key={point.id} style={s.stopRow}>
            <View style={s.marker}><Text style={s.markerText}>{String(index+1).padStart(2,'0')}</Text></View>
            <View style={s.details}>
              <Text style={s.stopName}>{point.name}</Text>
              <Text style={s.stopSubtitle}>{point.subtitle}</Text>
              <Text style={s.address}>{point.address}</Text>
            </View>
          </View>
        )}
      </View>
      <Link href="/demo-tour" style={s.cta}>Start sample guided tour →</Link>
      <Text style={s.footnote}>The current navigation demo calculates a real route to Old Town Hall, with sample spoken audio. Multi-stop navigation is not enabled yet.</Text>
    </View>
  </ScrollView>;
}
const s=StyleSheet.create({
  scroll:{flex:1,backgroundColor:theme.background},
  outer:{width:'100%',alignItems:'center',paddingHorizontal:16,paddingTop:18,paddingBottom:32},
  main:{width:'100%',maxWidth:580,gap:12},
  back:{color:'#347866',fontSize:13,marginBottom:2},
  title:{fontSize:28,fontWeight:'700',lineHeight:35,color:theme.ink},
  intro:{fontSize:15,lineHeight:22,color:theme.muted,marginBottom:3},
  mapContainer:{backgroundColor:'#fff',borderWidth:1,borderColor:theme.border,borderRadius:14,padding:12,gap:10},
  mapHeading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  mapCount:{color:theme.green,fontSize:12,fontWeight:'700'},
  sectionLabel:{fontSize:12,color:theme.muted,fontWeight:'700',letterSpacing:0.8},
  mapCaption:{fontSize:12,lineHeight:18,color:theme.muted},
  summary:{flexDirection:'row',gap:7,flexWrap:'wrap'},
  chip:{backgroundColor:theme.pale,paddingVertical:8,paddingHorizontal:10,fontSize:12,color:theme.ink,borderRadius:10},
  sectionRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginTop:6},
  mutedSmall:{fontSize:11,color:theme.muted},
  list:{gap:9},
  stopRow:{backgroundColor:'#fff',borderRadius:12,borderWidth:1,borderColor:theme.border,padding:12,flexDirection:'row',gap:12,alignItems:'center'},
  marker:{height:42,width:42,borderRadius:12,backgroundColor:theme.red,justifyContent:'center',alignItems:'center'},
  markerText:{fontWeight:'700',fontSize:15,color:'#fff'},
  details:{flex:1,gap:3},
  stopName:{fontSize:15,fontWeight:'700',color:theme.ink},
  stopSubtitle:{fontSize:12,lineHeight:18,color:theme.muted},
  address:{fontSize:11,color:theme.green},
  cta:{marginTop:4,padding:16,textAlign:'center',backgroundColor:theme.red,borderRadius:12,overflow:'hidden',color:'#fff',fontWeight:'700',fontSize:15},
  footnote:{color:theme.muted,fontSize:12,lineHeight:18},
});
