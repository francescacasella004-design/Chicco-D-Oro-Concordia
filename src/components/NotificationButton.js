'use client';
import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, Share } from 'lucide-react';

export default function NotificationButton() {
    const [status, setStatus] = useState('loading'); // loading, default, granted, denied, error
    const [subscribing, setSubscribing] = useState(false);

    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if it's iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            checkSubscription();
        } else {
            setStatus('unsupported');
        }
    }, []);

    const checkSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                setStatus('granted');
            } else {
                setStatus(Notification.permission === 'granted' ? 'default' : Notification.permission);
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribe = async () => {
        setSubscribing(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            });

            // Send to backend
            const res = await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });

            if (res.ok) {
                setStatus('granted');
            } else {
                throw new Error('Failed to save subscription');
            }
        } catch (e) {
            console.error('Subscription failed', e);
            setStatus('error');
            alert('Impossibile attivare le notifiche. Riprova o controlla le impostazioni del browser.');
        } finally {
            setSubscribing(false);
        }
    };

    if (status === 'loading') return null;

    if (status === 'unsupported') {
        if (isIOS) {
            return (
                <div className="text-sm text-warning" style={{ color: 'var(--text-light)' }}>
                    <p style={{ marginBottom: 5 }}>⚠️ <strong>Su iPhone:</strong></p>
                    Per attivare le notifiche, devi prima <strong>aggiungere questa app alla Home</strong>.
                    <br />
                    1. Premi Condividi <Share size={14} style={{ display: 'inline' }} />
                    <br />
                    2. "Aggiungi alla schermata Home"
                </div>
            );
        }
        return <p className="text-sm text-red-500">Notifiche non supportate su questo dispositivo.</p>;
    }
    if (status === 'denied') return <p className="text-sm text-red-500">Hai bloccato le notifiche. Sbloccole dalle impostazioni del browser.</p>;
    if (status === 'granted') return (
        <div className="btn btn-secondary disabled" style={{ cursor: 'default', opacity: 0.8 }}>
            <Check size={18} style={{ marginRight: 8 }} /> Notifiche Attive
        </div>
    );

    return (
        <button className="btn btn-primary" onClick={subscribe} disabled={subscribing}>
            {subscribing ? 'Attivazione...' : (
                <>
                    <Bell size={18} style={{ marginRight: 8 }} /> Attiva Notifiche
                </>
            )}
        </button>
    );
}
