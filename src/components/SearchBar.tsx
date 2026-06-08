import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  error?: string | null;
  isLoading?: boolean;
}

/** Rounded search input with icon and optional validation error */
export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search a word...',
  error,
  isLoading = false,
}: SearchBarProps) {
  const { colors } = useThemeColors();

  return (
    <View className="w-full">
      <View
        className="flex-row items-center"
        style={{
          backgroundColor: colors.surface,
          borderRadius: BorderRadius.input,
          borderWidth: error ? 1.5 : 1,
          borderColor: error ? colors.error : colors.border,
          minHeight: 58,
          paddingHorizontal: Spacing.md,
        }}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          className="flex-1 font-body text-base px-3 py-3"
          style={{ color: colors.text, lineHeight: 22 }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Pressable
            onPress={onSubmit}
            disabled={!value.trim()}
            className="px-4 py-2.5 rounded-card active:opacity-80"
            style={{
              backgroundColor: value.trim() ? colors.primary : colors.border,
              borderRadius: BorderRadius.button,
            }}>
            <Text className="font-label text-sm text-white">Search</Text>
          </Pressable>
        )}
      </View>
      {error ? (
        <Text className="font-label text-sm mt-2 ml-1" style={{ color: colors.error }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
