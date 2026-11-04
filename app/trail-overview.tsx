import React from 'react';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DEMO_DESTINATION } from '../src/services/demoTour';

const c={bg:'#F8FAF8',ink:'#1E2C2B',muted:'#667973',green:'#194A41',red:'#EE2F31',border:'#DAE3DC',pale:'#EEF4F0'};
export default function TrailOverview(){
  return <ScrollView contentContainerStyle={s.content}>
    <Link href="/" style={s.back}>‹   All historic trails</Link>
    <Text style={s.title}>Revolutionary Bedford</Text>
    <Text style={s.intro}>Follow Bedford's local stories at your own pace.</Text>
    <View style={s.mapPreview}>
      <Text style={s.label}>ROUTE PREVIEW  ·  ILLUSTRATIVE</Text>
      <View style={s.routeDiagram}>
        <View style={s.line} />
        <View style={[s.dot,{left:'21%',top:'62%'}]}><Text style={s.dotText}>1</Text></View>
        <View style={[s.dot,{left:'68%',top:'23%'}]}><Text style={s.dotText}>2</Text></View>
        <View style={[s.dot,{left:'76%',top:'68%'}]}><Text style={s.dotText}>3</Text></View>
      </View>
      <Text style={s.mutedSmall}>Actual road directions appear when you start the tour.</Text>
    </View>
    <View style={s.summary}>
      <Text style={s.badge}>Historical stops</Text>
      <Text style={s.badge}>Audio stories</Text>
      <Text style={s.badge}>Self-guided</Text>
    </View>
    <Text style={s.label}>ON THIS TRAIL</Text>
    <View style={s.stop}>
      <View style={s.marker}><Text style={s.markerText}>01</Text></View>
      <View style={s.flex}><Text style={s.bold}>Bedford Common</Text><Text style={s.mutedSmall}>Discover Bedford's early history</Text></View>
    </View>
    <View style={s.stop}>
      <View style={s.marker}><Text style={s.markerText}>02</Text></View>
      <View style={s.flex}><Text style={s.bold}>{DEMO_DESTINATION.name}</Text><Text style={s.mutedSmall}>An example stop for the guided audio demo</Text></View>
    </View>
    <Link href="/demo-tour" style={s.cta}>Start guided tour →</Link>
    <Text style={s.mutedSmall}>This prototype currently routes to one sample historical point. The full multi-stop tour is in development.</Text>
  </ScrollView>;
}
const s=StyleSheet.create({
  content:{paddingHorizontal:24,paddingTop:18,paddingBottom:36,gap:10,backgroundColor:c.bg,flexGrow:1},
  back:{color:'#347866',fontSize:12,marginBottom:4},
  title:{fontSize:28,lineHeight:36,color:c.ink,fontWeight:'700'},
  intro:{fontSize:14,lineHeight:20,color:c.muted,marginBottom:6},
  label:{fontSize:12,fontWeight:'700',letterSpacing:0.8,color:c.muted},
  mapPreview:{backgroundColor:c.pale,borderRadius:12,padding:10,gap:7},
  routeDiagram:{height:176,backgroundColor:'#E5EFE9',borderRadius:8,overflow:'hidden',position:'relative'},
  line:{position:'absolute',width:'54%',height:5,backgroundColor:c.green,transform:[{rotate:'-30deg'}],top:'50%',left:'24%',borderRadius:4},
  dot:{position:'absolute',height:29,width:29,borderRadius:15,backgroundColor:'#fff',borderWidth:3,borderColor:c.red,alignItems:'center',justifyContent:'center'},
  dotText:{color:c.red,fontSize:12,fontWeight:'700'},
  mutedSmall:{fontSize:12,lineHeight:18,color:c.muted},
  summary:{flexDirection:'row',gap:8,marginVertical:7,flexWrap:'wrap'},
  badge:{backgroundColor:c.pale,color:c.ink,fontSize:12,paddingHorizontal:9,paddingVertical:9,borderRadius:12},
  stop:{backgroundColor:'#fff',borderColor:c.border,borderWidth:1,borderRadius:12,padding:12,minHeight:82,flexDirection:'row',alignItems:'center',gap:14},
  marker:{height:42,width:42,borderRadius:12,backgroundColor:c.red,justifyContent:'center',alignItems:'center'},
  markerText:{color:'#fff',fontSize:15,fontWeight:'700'},flex:{flex:1},
  bold:{fontSize:15,color:c.ink,fontWeight:'700'},
  cta:{marginTop:8,textAlign:'center',backgroundColor:c.red,padding:15,borderRadius:12,overflow:'hidden',fontWeight:'700',fontSize:14,color:'#fff'},
});
