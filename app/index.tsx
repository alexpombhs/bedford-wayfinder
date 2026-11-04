import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSites } from '../src/context/SitesContext';
import { DEMO_DESTINATION } from '../src/services/demoTour';

const color = { bg:'#F8FAF8', ink:'#1E2C2B', muted:'#667973', green:'#194A41', red:'#EE2F31', surface:'#FFFFFF', border:'#DAE3DC', pale:'#EEF4F0' };
const modes=['Walk','Bike','Drive'] as const;

export default function Home() {
  const { sites } = useSites();
  const [mode,setMode]=useState<(typeof modes)[number]>('Walk');
  const [search,setSearch]=useState('');
  const shown=sites.filter(site => site.name.toLowerCase().includes(search.toLowerCase())).slice(0,5);
  return <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>BEDFORD  /  WAYFINDER</Text>
    <Text style={styles.title}>Historic Trails</Text>
    <Text style={styles.intro}>Explore Bedford one story at a time.</Text>
    <View style={styles.modes}>{modes.map(m=>
      <Pressable key={m} accessibilityRole="button" accessibilityState={{selected:mode===m}}
        onPress={()=>setMode(m)} style={[styles.chip,mode===m&&styles.chipActive]}>
        <Text style={[styles.chipText,mode===m&&styles.chipTextActive]}>{m}</Text>
      </Pressable>)}</View>
    <TextInput value={search} onChangeText={setSearch} style={styles.search}
      placeholder="Search trails or landmarks" placeholderTextColor={color.muted} accessibilityLabel="Search trails or landmarks"/>
    <Text style={styles.label}>FEATURED TOUR</Text>
    <Pressable accessibilityRole="button" style={styles.feature} onPress={()=>router.push('/trail-overview')}>
      <View style={styles.imageSlot}><Text style={styles.imageLabel}>HISTORICAL PHOTO</Text></View>
      <Text style={styles.featureTitle}>Revolutionary Bedford</Text>
      <Text style={styles.description}>Discover Bedford's Revolutionary heritage</Text>
      <View style={styles.metas}>
        <Text style={styles.meta}>Historical audio</Text>
        <Text style={styles.meta}>Guided route</Text>
      </View>
      <Text style={styles.featureLink}>Explore this tour →</Text>
    </Pressable>
    <Text style={styles.label}>{search ? 'MATCHING PLACES' : 'OTHER TRAILS & LANDMARKS'}</Text>
    {search ? shown.map(site=><Link key={site.id} href={{pathname:'/site/[id]',params:{id:site.id}}} style={styles.link}>{site.name} →</Link>) : <>
      <Link href="/trail-overview" style={styles.link}>Historic Bedford Tour  →</Link>
      <Link href="/demo-tour" style={styles.link}>Create a route to {DEMO_DESTINATION.name}  →</Link>
    </>}
    <Text style={styles.disclaimer}>Historic trail data and tour durations are being verified for the prototype.</Text>
  </ScrollView>;
}
const styles=StyleSheet.create({
  scroll:{flex:1,backgroundColor:color.bg},content:{paddingHorizontal:24,paddingTop:18,paddingBottom:40,gap:10},
  eyebrow:{fontSize:12,color:'#347866',letterSpacing:1.8,fontWeight:'700'},
  title:{fontSize:28,fontWeight:'700',color:color.ink,lineHeight:36},
  intro:{fontSize:14,color:color.muted,lineHeight:20,marginBottom:5},
  modes:{flexDirection:'row',gap:9},
  chip:{height:40,flex:1,backgroundColor:color.surface,borderColor:color.border,borderWidth:1,borderRadius:12,alignItems:'center',justifyContent:'center'},
  chipActive:{backgroundColor:color.green,borderColor:color.green},
  chipText:{fontSize:14,fontWeight:'700',color:color.ink},chipTextActive:{color:'#fff'},
  search:{height:48,backgroundColor:'#fff',borderWidth:1,borderColor:color.border,borderRadius:12,paddingHorizontal:14,color:color.ink,fontSize:14,marginBottom:4},
  label:{fontSize:12,color:color.muted,letterSpacing:0.8,fontWeight:'700',marginTop:2},
  feature:{backgroundColor:'#fff',borderRadius:12,borderColor:color.border,borderWidth:1,padding:12,gap:10},
  imageSlot:{height:122,backgroundColor:'#F4FAFD',borderRadius:10,alignItems:'center',justifyContent:'center'},
  imageLabel:{fontSize:12,color:color.muted},
  featureTitle:{fontSize:20,color:color.ink,fontWeight:'700'},
  description:{fontSize:12,color:color.muted},
  metas:{flexDirection:'row',gap:8},meta:{paddingVertical:7,paddingHorizontal:10,backgroundColor:'#F4FAFD',borderRadius:12,color:color.ink,fontSize:12},
  featureLink:{color:color.red,fontWeight:'700',fontSize:13},
  link:{backgroundColor:color.pale,borderRadius:12,padding:16,color:color.ink,fontSize:15,fontWeight:'700',overflow:'hidden'},
  disclaimer:{fontSize:11,color:color.muted,lineHeight:17},
});
