import React, { useEffect, useState } from 'react';
import useFcmToken from './utils/hooks/useFcmToken';
import { getMessaging, MessagePayload, onMessage } from 'firebase/messaging';
import firebaseApp from './utils/firebase';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/stores/store";
import Router from "./router";
import "./assets/css/app.css";
import ScrollToTop from './base-components/ScrollToTop/index';
import { SocketProvider } from './socketContext';

interface PayloadNotification {
    title: string;
    body: string;
}

interface Payload {
    notification?: PayloadNotification;
}

export default function App() {
    const [payload, setPayload] = useState<Payload | null>(null);
    const { fcmToken, notificationPermissionStatus } = useFcmToken();
    console.log({fcmToken, notificationPermissionStatus})
    useEffect(() => {
        if (fcmToken) {
            console.log('FCM token:', fcmToken);
        }
    }, [fcmToken]);

    useEffect(() => {
        const messaging = getMessaging(firebaseApp);

        const unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
            setPayload(payload as Payload);
            setTimeout(() => {
                setPayload(null);
            }, 5000);

            const notificationTitle = payload.notification?.title || 'Notification';
            const notificationOptions = {
                body: payload.notification?.body,
                icon: '/logo.png', // Ensure this path is correct
            };

            if (notificationPermissionStatus === 'granted') {
                new Notification(notificationTitle, notificationOptions);
            }
        });

        return () => unsubscribe();
    }, [notificationPermissionStatus]);

    return (
        <SocketProvider>
            <BrowserRouter>
                <Provider store={store}>
                    <Router />
                    {payload && (
                        <div className="fixed bg-white shadow-lg top-2 right-2 w-96 text-black p-4 z-50 rounded-lg">
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <h4 className='font-extrabold'>{payload.notification?.title}</h4>
                                    <div onClick={() => setPayload(null)} className="text-red w-5 h-5 flex items-center justify-center rounded-full cursor-pointer">
                                        {/* <FontAwesomeIcon className="text-base text-gray-600 w-3" icon={faTimes} /> */}
                                    </div>
                                </div>
                                <p className='text-slate-500'>{payload.notification?.body}</p>
                            </div>
                        </div>
                    )}
                    <ScrollToTop />
                </Provider>
            </BrowserRouter>
        </SocketProvider>
    );
}
