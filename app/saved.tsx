import React from 'react';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
export default function Saved() {
  return <ScrollView contentContainerStyle={s.page}>
    <Text style={s.overline}>BEDFORD / WAYFINDER</Text>
    <Text style={s.title}>Saved tours</Text>
    <Text style={s.description}>Saved tours are coming soon. For now, you can explore the guided tour demo.</Text>
    <Link href="/demo-tour" style={s.action}>Explore a guided tour →</Link>
  </ScrollView>;
}
const s = StyleSheet.create({
  page:{flexGrow:1,padding:24,gap:16,backgroundColor:'#F8FAF8'},
  overline:{fontSize:12,fontWeight:'700',letterSpacing:1.2,color:'#194A41'},
  title:{fontSize:28,fontWeight:'700',color:'#1E2C2B'},
  description:{fontSize:15,color:'#667973',lineHeight:22},
  action:{fontSize:15,color:'#194A41',paddingVertical:14,fontWeight:'700'},
});
