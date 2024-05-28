import React, { useEffect, useState } from 'react';
import { View } from 'react-native'; // Importez d'autres composants si nécessaire
import CustomSplashScreen from './CustomSplashScreen.js'; // Importez votre composant personnalisé
import Routes from './routes/routes.js';

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Charger des polices ou effectuer d'autres préparations
                // await Font.loadAsync({
                //     'Roboto': require('expo-font', 'Roboto'),
                // });

                await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulation d'un temps de chargement
            } catch (e) {
                console.warn(e); // Afficher un avertissement en cas d'erreur
            } finally {
                setAppIsReady(true); // L'application est prête
            }
        }

        prepare(); // Préparer l'application
    }, []);

    if (!appIsReady) {
        return <CustomSplashScreen />; // Affichez l'écran de démarrage personnalisé
    }

    return (
        <View style={{ flex: 1 }}>
            <Routes /> 
        </View>
    );
}
