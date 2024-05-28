import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getCategories, getSubCategories, getProducts } from './../../services/stock.Service';

const SelectProduct = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des catégories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = useCallback(async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const response = await getSubCategories(category.id);
      setSelectedCategory({ ...category, children: response.data });
      setSelectedSubCategory(null); // Réinitialise la sous-catégorie sélectionnée
      setProducts([]); // Réinitialise la liste des produits
    } catch (error) {
      setError('Erreur lors de la récupération des sous-catégories');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubCategorySelect = useCallback(async (subCategory) => {
    setSelectedSubCategory(subCategory);
    setLoading(true);
    try {
      const response = await getProducts();
      const filteredProducts = response.data.filter(product => product.CategorieProduit === subCategory.id.toString());
      setProducts(filteredProducts);
    } catch (error) {
      setError('Erreur lors de la récupération des produits');
    } finally {
      setLoading(false);
    }
  }, []);

  const renderCategoryItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory && selectedCategory.id === item.id && styles.activeCategory,
      ]}
      onPress={() => handleCategorySelect(item)}
    >
      <Text style={styles.categoryText}>{item.NomCategorieProduit}</Text>
    </TouchableOpacity>
  ), [handleCategorySelect, selectedCategory]);

  const renderSubCategoryItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleSubCategorySelect(item)} style={styles.subCategoryItem}>
      <Text style={styles.subCategoryText}>{item.NomCategorieProduit}</Text>
    </TouchableOpacity>
  ), [handleSubCategorySelect]);

  const renderProductItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => {}} style={styles.productItem}>
      <View style={styles.productInfo}>
        <Text style={styles.productText}>{item.NomProduit}</Text>
        <Text style={styles.productUnit}>{item.unite.Nom} ({item.unite.Symbol})</Text>
      </View>
      <Image
        source={{ uri: item.ImageProduit }}
        style={styles.productImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  ), []);

  let filteredChildren = [];
  if (selectedCategory && selectedCategory.children) {
    filteredChildren = selectedCategory.children.filter(child => {
      return child.CategorieProduitsId === selectedCategory.id.toString(); // Filtrer selon l'ID de la catégorie principale
    });
  }

  return (
    <FlatList
      style={styles.container}
      data={[{ key: 'categories', data: categories }, { key: 'filteredChildren', data: filteredChildren }, { key: 'products', data: products }]}
      renderItem={({ item }) => (
        <View style={styles.section}>
          {item.key === 'categories' && (
            <>
              <Text style={styles.title}>Sélectionnez une catégorie de produit</Text>
              {loading && <ActivityIndicator size="large" color="#0000ff" />}
              {error && <Text style={styles.error}>{error}</Text>}
              <FlatList
                data={item.data}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.categoryList}
                numColumns={2} // Afficher les catégories sur 2 colonnes
              />
            </>
          )}
          {item.key === 'filteredChildren' && selectedCategory && (
            <>
              <Text style={styles.sectionTitle}>Sous-catégories de {selectedCategory.NomCategorieProduit}</Text>
              <FlatList
                data={item.data}
                renderItem={renderSubCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.subCategoryList}
              />
            </>
          )}
          {item.key === 'products' && selectedSubCategory && (
            <>
              <Text style={styles.sectionTitle}>Produits de {selectedSubCategory.NomCategorieProduit}</Text>
              <FlatList
                data={item.data}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.productList}
              />
            </>
          )}
        </View>
      )}
      keyExtractor={(item) => item.key}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    color: '#333',
  },
  categoryList: {
    marginBottom: 16,
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  activeCategory: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  subCategoryItem: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  subCategoryText: {
    fontSize: 14,
    color: '#555',
  },
  subCategoryList: {
    maxHeight: 200, // Limite de hauteur pour les sous-catégories
  },
  productList: {
    maxHeight: 300, // Limite de hauteur pour les produits
    paddingHorizontal: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  productInfo: {
    flex: 1,
  },
  productText: {
    fontSize: 16,
    color: '#333',
  },
  productUnit: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default SelectProduct;
