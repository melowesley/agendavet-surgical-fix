import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity,
    ActivityIndicator, Alert, TextInput, Linking, KeyboardAvoidingView, Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { logPetAdminHistory } from '@/lib/services/petHistory';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
// import { Video, Audio, ResizeMode } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Cor de destaque padrão será injetada pelo tema

export default function GravacoesScreen() {
    const { petId } = useLocalSearchParams<{ petId: string }>();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const router = useRouter();
    const queryClient = useQueryClient();
    const insets = useSafeAreaInsets();

    const [saving, setSaving] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [tipo, setTipo] = useState('');
    const [link, setLink] = useState('');
    const [descricao, setDescricao] = useState('');
    const [veterinario, setVeterinario] = useState('');
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [uploadMode, setUploadMode] = useState<'record' | 'gallery' | 'link'>('record');
    const [uploading, setUploading] = useState(false);

    const TIPOS = ['Vídeo clínico', 'Ultrassom', 'Ecocardiograma', 'Endoscopia', 'Consulta gravada', 'Procedimento', 'Outro'];

    // ── Gravar vídeo com câmera ──────────────────────────────
    const handleRecord = async () => {
        const { status: camStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: micStatus } = await Audio.requestPermissionsAsync();
        if (camStatus !== 'granted' || micStatus !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos acesso à câmera e ao microfone.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            videoMaxDuration: 300, // 5 minutos
            quality: 0.7,
            allowsEditing: false,
        });
        if (!result.canceled && result.assets[0]) {
            setVideoUri(result.assets[0].uri);
            setUploadMode('record');
        }
    };

    // ── Selecionar da galeria ────────────────────────────────
    const handlePickVideo = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.'); return; }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 0.7,
            allowsEditing: false,
        });
        if (!result.canceled && result.assets[0]) {
            setVideoUri(result.assets[0].uri);
            setUploadMode('gallery');
        }
    };

    // ── Upload para Supabase Storage ─────────────────────────
    const uploadVideoToStorage = async (uri: string): Promise<string> => {
        const ext = uri.split('.').pop() || 'mp4';
        const fileName = `pets/${petId}/videos/${Date.now()}.${ext}`;

        const { data: { session } } = await supabase.auth.getSession();

        const formData = new FormData();
        formData.append('file', {
            uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
            name: `upload.${ext}`,
            type: `video/${ext === 'mov' ? 'quicktime' : ext}`
        } as any);

        const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/pet-media/${fileName}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session?.access_token}`
            },
            body: formData,
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Falha no upload do vídeo. Detalhes: ${errorText}`);
        }

        const { data: { publicUrl } } = supabase.storage.from('pet-media').getPublicUrl(fileName);
        return publicUrl;
    };

    // ── Salvar ───────────────────────────────────────────────
    const handleSave = async () => {
        if (!titulo.trim()) { Alert.alert('Atenção', 'Informe o título da gravação.'); return; }
        if (!videoUri && !link.trim()) { Alert.alert('Atenção', 'Adicione um vídeo gravado, da galeria, ou cole um link.'); return; }

        setSaving(true);
        setUploading(!!videoUri);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            let videoUrl = link.trim();

            // Se tem vídeo local, fazer upload
            if (videoUri) {
                videoUrl = await uploadVideoToStorage(videoUri);
            }
            setUploading(false);

            const details = { titulo, tipo, link: videoUrl, descricao, veterinario, hasVideo: !!videoUri };
            const { data, error } = await supabase.from('pet_admin_history').insert({
                pet_id: petId, user_id: session?.user?.id,
                module: 'video', action: 'procedure',
                title: `Gravação: ${titulo}`,
                details: JSON.stringify(details),
                created_at: new Date().toISOString(),
            }).select().single();
            if (error) throw error;

            await logPetAdminHistory({
                petId, module: 'video', action: 'create',
                title: `Gravação: ${titulo}`,
                details, sourceTable: 'pet_admin_history', sourceId: data.id
            });
            queryClient.invalidateQueries({ queryKey: ['pet-timeline', petId] });
            Alert.alert('✅ Sucesso', 'Gravação salva no prontuário!', [{ text: 'OK', onPress: () => router.back() }]);
        } catch (e: any) {
            setUploading(false);
            Alert.alert('Erro', e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
            <Text style={{ fontSize: 18, color: theme.text }}>Manutenção</Text>
            <Text style={{ fontSize: 14, color: theme.textSecondary, textAlign: 'center', marginTop: 10 }}>
                Esta funcionalidade está temporariamente indisponível.
            </Text>
        </View>
    );
}

const s = StyleSheet.create({
    scroll: { padding: 16, gap: 16, paddingBottom: 40 },
    hero: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 20 },
    heroTitle: { fontSize: 22, fontWeight: '800' }, heroSub: { fontSize: 13 },
    modeRow: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
    modeBtnText: { fontSize: 13, fontWeight: '700' },
    card: { borderRadius: 20, borderWidth: 1, padding: 16, gap: 14, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E7EB' },
    cardTitle: { fontSize: 15, fontWeight: '800' },
    bigActionBtn: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed', borderRadius: 20, paddingVertical: 40, gap: 10 },
    bigActionText: { fontSize: 16, fontWeight: '800' },
    bigActionSub: { fontSize: 12 },
    videoPreviewWrap: { position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: 16 / 9, backgroundColor: '#000' },
    videoPreview: { width: '100%', height: '100%' },
    removeVideoBtn: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    subLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
    chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
    chipText: { fontSize: 12, fontWeight: '600' },
    fieldWrap: { flex: 1 },
    fieldLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 },
    fieldInput: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
    multiline: { paddingTop: 14 },
    tipText: { fontSize: 11, marginTop: 6 },
    footer: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
    saveBtn: { height: 46, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    saveBtnText: { fontSize: 16, fontWeight: '700' },
});
