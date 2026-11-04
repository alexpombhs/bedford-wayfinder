import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { DEMO_DESTINATION, SAMPLE_NARRATION } from '../src/services/demoTour';

const c={bg:'#F8FAF8',ink:'#1E2C2B',muted:'#667973',green:'#194A41',red:'#EE2F31',border:'#DAE3DC',pale:'#EEF4F0'};
export default function HistoricalStory(){
  const [playing,setPlaying]=useState(false);
  useEffect(()=>()=>{void Speech.stop();},[]);
  async function play(){
    await Speech.stop();
    setPlaying(true);
    Speech.speak(SAMPLE_NARRATION,{language:'en-US',rate:0.9,onDone:()=>setPlaying(false),onStopped:()=>setPlaying(false),onError:()=>setPlaying(false)});
  }
  async function stop(){await Speech.stop();setPlaying(false);}
  return <ScrollView contentContainerStyle={s.content}>
    <Link href="/demo-tour" style={s.back}>‹   Back to navigation</Link>
    <Text style={s.title}>{DEMO_DESTINATION.name}</Text>
    <Text style={s.label}>STOP 1 OF 1  •  HISTORICAL AUDIO</Text>
    <View style={s.image}><Text style={s.label}>HISTORICAL IMAGE</Text></View>
    <Text style={s.subtitle}>Stories of Historical Bedford</Text>
    <Text style={s.description}>Explore one of Bedford's historic places. This first tour contains sample narration for testing.</Text>
    <View style={s.player}>
      <View style={s.row}>
        <Pressable style={s.play} accessibilityRole="button" onPress={()=>void (playing?stop():play())}>
          <Text style={s.playIcon}>{playing?'■':'▶'}</Text>
        </Pressable>
        <View style={{flex:1}}><Text style={s.bold}>{DEMO_DESTINATION.name}</Text><Text style={s.mutedSmall}>Sample audio story</Text></View>
      </View>
      <Text style={s.description}>“{SAMPLE_NARRATION}”</Text>
      <View style={s.track}><View style={[s.filled,{width:playing?'45%':'0%'}]} /></View>
      <View style={s.actions}>
        <Pressable onPress={()=>void play()}><Text style={s.actionText}>Replay</Text></Pressable>
        <Pressable onPress={()=>void stop()}><Text style={s.actionText}>Pause</Text></Pressable>
        <Text style={s.mutedSmall}>Captions shown above</Text>
      </View>
    </View>
    <View style={s.more}><Text style={s.description}>Photos, timeline & more information →</Text></View>
    <Link href="/demo-tour" style={s.cta}>Continue to navigation →</Link>
  </ScrollView>;
}
const s=StyleSheet.create({
  content:{flexGrow:1,paddingHorizontal:24,paddingTop:18,paddingBottom:36,gap:10,backgroundColor:c.bg},
  back:{color:'#347866',fontSize:12,marginBottom:4},
  title:{fontSize:28,lineHeight:36,color:c.ink,fontWeight:'700'},
  label:{fontSize:12,color:c.muted,letterSpacing:0.8,fontWeight:'700'},
  image:{height:190,backgroundColor:c.pale,borderRadius:12,justifyContent:'center',paddingHorizontal:18},
  subtitle:{fontSize:20,fontWeight:'700',lineHeight:26,color:c.ink},
  description:{fontSize:14,lineHeight:20,color:c.muted},
  player:{padding:15,borderWidth:1,borderColor:c.border,borderRadius:12,backgroundColor:'#fff',gap:11},
  row:{flexDirection:'row',alignItems:'center',gap:10},
  play:{width:48,height:48,borderRadius:12,borderWidth:1,borderColor:c.border,justifyContent:'center',alignItems:'center'},
  playIcon:{fontSize:20,color:c.green},bold:{fontSize:15,fontWeight:'700',color:c.ink},
  mutedSmall:{fontSize:12,color:c.muted},
  track:{height:5,borderRadius:3,backgroundColor:c.pale,overflow:'hidden'},
  filled:{height:5,backgroundColor:c.green},
  actions:{flexDirection:'row',alignItems:'center',gap:22},
  actionText:{fontSize:12,fontWeight:'700',color:c.green},
  more:{height:48,backgroundColor:c.pale,borderRadius:12,padding:13,justifyContent:'center'},
  cta:{backgroundColor:c.red,borderRadius:12,overflow:'hidden',textAlign:'center',padding:15,color:'#fff',fontSize:14,fontWeight:'700'},
});
