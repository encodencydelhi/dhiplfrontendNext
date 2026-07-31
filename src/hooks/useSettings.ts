"use client";

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface SettingsData {
    logo: string;
    emails: { email: string; forTopbar: boolean; forContact: boolean }[];
    phones: { phone: string; forTopbar: boolean; forContact: boolean }[];
    addresses: {
        title: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }[];
    quickLinks: { label: string; href: string }[];
    mapIframe: string;
}

export const useSettings = () => {
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/api/settings');
                if (response.data.success) {
                    setSettings(response.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch settings:', err);
                setError('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, loading, error };
};