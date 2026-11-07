import React from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { wf } from '../WayfinderUI';

/**
 * Atomic, MUI-inspired IconButton adapter for Expo React Native.
 * Keeps an accessible, touch-friendly API; native does not support browser MUI.
 * A web adapter can mirror these props with MUI IconButton later.
 */
export type WayfinderIconName = 'play' | 'pause' | 'information-circle-outline' | 'close';
export type WayfinderIconButtonProps = {
  icon: WayfinderIconName;
  label: string;
  onPress: () => void;
  variant?: 'outlined' | 'contained' | 'subtle';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function WayfinderIconButton({
  icon, label, onPress, variant = 'outlined', disabled = false, style,
}: WayfinderIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={4}
      style={({ pressed }) => [
        styles.button,
        variant === 'contained' ? styles.contained : variant === 'subtle' ? styles.subtle : styles.outlined,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Ionicons name={icon} size={22} color={variant === 'contained' ? '#FFFFFF' : wf.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  contained: { backgroundColor: wf.blue },
  outlined: { borderWidth: 1, borderColor: wf.border, backgroundColor: wf.surface },
  subtle: { backgroundColor: wf.lightBlue },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.45 },
});
