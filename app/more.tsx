import React from 'react';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
export default function More() {
  return <ScrollView contentContainerStyle={s.page}>
    <Text style={s.overline}>BEDFORD / WAYFINDER</Text>
    <Text style={s.title}>More</Text>
    <Text style={s.description}>Explore historical Bedford one story at a time. This student prototype combines routes, landmarks and audio narration.</Text>
    <Link href="/tours" style={s.action}>Build a custom tour →</Link>
    <Link href="/demo-tour" style={s.action}>Try a guided audio tour →</Link>
    <Text style={s.note}>Routes and sample narration are for demonstration. Check surroundings and traffic conditions when traveling.</Text>
  </ScrollView>;
}
const s = StyleSheet.create({
  page:{flexGrow:1,padding:24,gap:16,backgroundColor:'#F8FAF8'},
  overline:{fontSize:12,fontWeight:'700',letterSpacing:1.2,color:'#194A41'},
  title:{fontSize:28,fontWeight:'700',color:'#1E2C2B'},
  description:{fontSize:15,color:'#667973',lineHeight:22},
  action:{fontSize:15,color:'#194A41',paddingVertical:14,fontWeight:'700'},
  note:{fontSize:12,color:'#667973',lineHeight:18,marginTop:16},
});
