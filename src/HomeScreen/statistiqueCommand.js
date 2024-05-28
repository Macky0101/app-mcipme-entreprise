import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

const GraphiqueProduits = () => {
  const [chartData, setChartData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCommandesData = async () => {
      try {
        const token = await AsyncStorage.getItem('@token');
        const pme = await AsyncStorage.getItem('codeMPMEs');

        if (!token || !pme) {
          setErrorMessage('Token ou code PME manquant.');
          return;
        }

        const response = await axios.get('https://bd-mcipme.org/bd-services/public/api/commandes', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            statut: null,
            pme: pme,
          },
        });

        if (response.data && response.data.status === 'success') {
          const commandes = response.data.data;
          const data = prepareChartData(commandes);
          setChartData(data);
        } else {
          setErrorMessage('Erreur dans la réponse de l\'API.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        setErrorMessage('Erreur lors de la récupération des commandes.');
      }
    };

    fetchCommandesData();
  }, []);

  const prepareChartData = (commandes) => {
    let totalImportations = 0;
    let totalDistributions = 0;

    commandes.forEach((commande) => {
      const paysProvenance = commande.PaysDeProvenance;

      if (paysProvenance && paysProvenance.trim() !== '') {
        totalImportations++;
      } else {
        totalDistributions++;
      }
    });

    return {
      labels: ['Commandes Importées', 'Commandes Distribuées'],
      datasets: [
        {
          data: [totalImportations, totalDistributions],
          colors: [(opacity = 1) => `rgba(255, 99, 132, ${opacity})`, (opacity = 1) => `rgba(54, 162, 235, ${opacity})`],
        },
      ],
    };
  };

  const screenWidth = Dimensions.get('window').width;
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Couleur des axes et du texte
    barPercentage: 3,
    fillShadowGradientFrom: '#009900', // Dégradé pour les barres d'importation
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientTo: '#36a2eb', // Dégradé pour les barres de distribution
    fillShadowGradientToOpacity: 1,
    decimalPlaces: 0,
  };
  return (
    <Animatable.View animation="fadeInUpBig" duration={1500}>
      {chartData ? (
        <BarChart
          data={chartData}
          width={screenWidth}
          height={220}
          yAxisLabel="Nbr Cd "
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          fromZero
          showValuesOnTopOfBars
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Chargement des données...</Text>
          {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
        </View>
      )}
    </Animatable.View>
  );
};

export default GraphiqueProduits;








// import React, { useEffect, useState } from 'react';
// import { View, Text } from 'react-native';
// import { BarChart } from 'react-native-chart-kit';
// import axios from 'axios';
// import { Dimensions } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Animatable from 'react-native-animatable';

// const GraphiqueProduits = () => {
//   const [chartData, setChartData] = useState(null);
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     const fetchCommandesData = async () => {
//       try {
//         const token = await AsyncStorage.getItem('@token');
//         const pme = await AsyncStorage.getItem('codeMPMEs');

//         if (!token || !pme) {
//           setErrorMessage('Token ou code PME manquant.');
//           return;
//         }

//         const response = await axios.get('https://bd-mcipme.org/bd-services/public/api/commandes', {
//           headers: { Authorization: `Bearer ${token}` },
//           params: {
//             statut: null,
//             pme: pme,
//           },
//         });

//         if (response.data && response.data.status === 'success') {
//           const commandes = response.data.data;
//           const data = prepareChartData(commandes);
//           setChartData(data);
//         } else {
//           setErrorMessage('Erreur dans la réponse de l\'API.');
//         }
//       } catch (error) {
//         console.error('Erreur lors de la récupération des commandes:', error);
//         setErrorMessage('Erreur lors de la récupération des commandes.');
//       }
//     };

//     fetchCommandesData();
//   }, []);

//   const prepareChartData = (commandes) => {
//     const labels = [];
//     const importations = [];
//     const distributions = [];

//     commandes.forEach((commande) => {
//       const date = new Date(commande.DateCommande);
//       const month = date.toLocaleString('default', { month: 'short' });

//       if (!labels.includes(month)) {
//         labels.push(month);
//       }

//       commande.produits.forEach((produit) => {
//         const importQuantity = parseFloat(produit.QuantiteImporter);
//         const distributionQuantity = parseFloat(produit.QuantiteCommande);

//         if (!isNaN(importQuantity)) {
//           importations.push(importQuantity);
//         }

//         if (!isNaN(distributionQuantity)) {
//           distributions.push(distributionQuantity);
//         }
//       });
//     });

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Importations',
//           data: importations,
//           color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Rouge
//         },
//         {
//           label: 'Distributions',
//           data: distributions,
//           color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // Bleu
//         },
//       ],
//     };
//   };

//   const screenWidth = Dimensions.get('window').width;
//   const chartConfig = {
//     backgroundGradientFrom: '#ffffff',
//     backgroundGradientTo: '#ffffff',
//     color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Couleur des axes et du texte
//     barPercentage: 0.5,
//     fillShadowGradientFrom: '#ff6384', // Dégradé pour les barres d'importation
//     fillShadowGradientFromOpacity: 1,
//     fillShadowGradientTo: '#36a2eb', // Dégradé pour les barres de distribution
//     fillShadowGradientToOpacity: 1,
//     decimalPlaces: 0,
//   };

//   return (
//     <Animatable.View animation="fadeInUpBig" duration={1500}>
//       {chartData ? (
//         <BarChart
//           data={chartData}
//           width={screenWidth}
//           height={220}
//           yAxisLabel="Q."
//           chartConfig={chartConfig}
//           verticalLabelRotation={30}
//         />
//       ) : (
//         <View>
//           <Text>Chargement des données...</Text>
//           {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
//         </View>
//       )}
//     </Animatable.View>
//   );
// };

// export default GraphiqueProduits;
