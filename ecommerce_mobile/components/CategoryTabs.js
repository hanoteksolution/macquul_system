import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const CategoryTabs = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.tab,
              selectedCategory === category.name && styles.activeTab,
            ]}
            onPress={() => onCategorySelect(category.name)}
          >
            <View style={styles.tabContent}>
              <Text style={styles.categoryIcon}>
                {getCategoryIcon(category.name)}
              </Text>
              <Text
                style={[
                  styles.tabText,
                  selectedCategory === category.name && styles.activeTabText,
                ]}
              >
                {category.name}
              </Text>
            </View>
            {selectedCategory === category.name && (
              <View style={styles.activeIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const getCategoryIcon = (categoryName) => {
  const icons = {
    'All': '🏪',
    'Mobile': '📱',
    'Chargers': '🔌',
    'Audio': '🎧',
    'Electronics': '💻',
    'Accessories': '🔧',
    'Cables': '🔗',
    'Cases': '📦',
    'Headphones': '🎵',
    'Speakers': '🔊',
    'Tablets': '📱',
    'Laptops': '💻',
    'Gaming': '🎮',
    'Smart Watch': '⌚',
    'Camera': '📷',
    'Storage': '💾',
  };
  
  return icons[categoryName] || '📦';
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingBottom: 16,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  tab: {
    marginRight: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    minWidth: 70,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabContent: {
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  activeTabText: {
    color: 'white',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
});

export default CategoryTabs;
