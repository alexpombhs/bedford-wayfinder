import React from 'react';
import { Link } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BrowserMap } from '../src/components/BrowserMap';
import { useSites } from '../src/context/SitesContext';

export default function ExploreMapWeb() {
  const { sites, error, loading } = useSites();
  return <ScrollView contentContainerStyle={styles.page}>
    <Text style={styles.overline}>BEDFORD / WAYFINDER</Text>
    <Text style={styles.title}>Explore the map</Text>
    <Text style={styles.description}>Historic places around Bedford. Choose a landmark to read more or start an audio tour.</Text>
    <BrowserMap height={430} markers={sites.map(site => ({
      coordinate: [site.longitude, site.latitude],
      title: site.name,
      color: '#EE2F31',
    }))} />
    {loading ? <ActivityIndicator /> : null}
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <Text style={styles.label}>HISTORICAL PLACES</Text>
    {sites.map(site =>
      <Link key={site.id} href={{pathname: '/site/[id]', params: {id: site.id}}} style={styles.card}>{site.name} →</Link>
    )}
    <Link href="/demo-tour" style={styles.action}>Start the guided audio tour →</Link>
    <Text style={styles.note}>Some historical-site records are illustrative and need verification before publication.</Text>
  </ScrollView>;
}
const styles=StyleSheet.create({
  page:{padding:20,gap:15,backgroundColor:'#F8FAF8',flexGrow:1},
  overline:{fontSize:12,fontWeight:'700',letterSpacing:1.2,color:'#194A41'},
  title:{fontSize:28,fontWeight:'700',color:'#1E2C2B'},
  description:{fontSize:14,color:'#667973',lineHeight:20},
  label:{fontSize:12,fontWeight:'700',color:'#667973',letterSpacing:1},
  card:{padding:16,backgroundColor:'#fff',borderRadius:12,borderWidth:1,borderColor:'#DAE3DC',color:'#1E2C2B',fontSize:15},
  action:{padding:16,backgroundColor:'#EE2F31',borderRadius:12,textAlign:'center',fontWeight:'700',color:'#fff'},
  error:{fontSize:14,color:'#a92024'},
  note:{fontSize:12,color:'#667973',lineHeight:18}
});
