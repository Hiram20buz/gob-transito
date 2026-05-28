import { ReactNode } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { FRTheme, FR_FONTS } from '@/constants/fastroute-theme';
import { Icon, IconName } from '@/components/fr/Icon';

type FieldProps = {
  icon: IconName;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  theme: FRTheme;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences';
  trailing?: ReactNode;
};

export function Field({
  icon,
  placeholder,
  value,
  onChangeText,
  theme,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  trailing,
}: FieldProps) {
  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: theme.dark ? 'rgba(255,255,255,0.06)' : '#fff',
          borderColor: theme.line,
        },
      ]}>
      <Icon name={icon} size={19} color={theme.gold} stroke={2} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.textFaint}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        style={[styles.input, { color: theme.text }]}
      />
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    height: 54,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontFamily: FR_FONTS.body,
    fontSize: 15,
  },
});
