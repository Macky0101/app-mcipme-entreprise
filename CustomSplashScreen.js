import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

const CustomSplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={require('./assets/logo/logopme.png')} style={styles.image} />
           
            <Text style={styles.subtitle}>Bienvenue sur</Text>
             <Text style={styles.title}>MCIPME</Text>
             <ActivityIndicator style={styles.loadingImage} size="large" color="#009900" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginTop: 8,
    },
    loadingImage: {
        width: 100, // Largeur de l'image
        height: 100, // Hauteur de l'image
        alignSelf: 'center', // Alignement au centre horizontal
        marginTop: 20, // Marge supérieure pour séparer de contenu au-dessus
    },
});

export default CustomSplashScreen;
