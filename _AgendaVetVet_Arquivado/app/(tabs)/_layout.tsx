import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AICopilot } from '@/components/ui/AICopilot';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = Colors[isDark ? 'dark' : 'light'];

    return (
        <View style={[s.container, { backgroundColor: theme.background }]}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: theme.primary,
                    tabBarInactiveTintColor: theme.textMuted,
                    tabBarStyle: {
                        backgroundColor: theme.surface,
                        borderTopColor: theme.border,
                        height: 65,
                        paddingBottom: 8,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        elevation: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                    },
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                    },
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Início',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="grid-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="prontuario"
                    options={{
                        title: 'Prontuário',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="medical-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="agenda"
                    options={{
                        title: 'Agenda',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="calendar-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="internacao"
                    options={{
                        title: 'Internação',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="bed-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="perfil"
                    options={{
                        title: 'Perfil',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person-outline" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
            
            {/* Global AI Copilot Floating UI */}
            <AICopilot />
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
    },
});
