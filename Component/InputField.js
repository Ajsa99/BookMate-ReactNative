import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';

export default function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
  value,
  onChangeText,
  errorMessage,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
      }}>
      {icon}
      {inputType == 'password' ? (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
          style={{ flex: 1, paddingVertical: 0 }}
          secureTextEntry={true}
          inputType="password"
          value={value}
          onChangeText={onChangeText}
        />
      ) : (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
          style={{ flex: 1, paddingVertical: 0 }}
          value={value}
          onChangeText={onChangeText}
        />
      )}
      {errorMessage && (
        <Text style={{ color: 'red' }}>{errorMessage}</Text>
      )}
      <Pressable onPress={fieldButtonFunction}>
        <Text style={{ color: '#EEBE68', fontWeight: '700' }}>{fieldButtonLabel}</Text>
      </Pressable>
    </View>
  );
}
