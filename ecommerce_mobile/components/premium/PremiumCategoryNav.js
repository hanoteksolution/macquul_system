import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import {
  ALL_SELECTION,
  createParentSelection,
  createChildSelection,
} from '../../utils/categoryTree';
import CategoryCircle from './categories/CategoryCircle';
import usePremiumTheme from '../../hooks/usePremiumTheme';
import useThemedStyles from '../../hooks/useThemedStyles';
import {
  getCategoryIcon,
  getCategoryAccent,
  getCategorySubtitle,
  getCategorySnapInterval,
  getSubCategorySnapInterval,
} from './categories/categoryUtils';

function FloatingSubcategories({ parentName, children, onLayoutComplete, styles }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(16);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 9, tension: 65, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onLayoutComplete?.();
    });
  }, [parentName, opacity, translateY, onLayoutComplete]);

  return (
    <Animated.View
      style={[styles.subZone, { opacity, transform: [{ translateY }] }]}
      onLayout={() => onLayoutComplete?.()}
    >
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderLabel}>{parentName}</Text>
        <View style={styles.subHeaderLine} />
      </View>
      {children}
    </Animated.View>
  );
}

function StaggerItem({ index, children }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 260,
      delay: 35 + index * 45,
      useNativeDriver: true,
    }).start();
  }, [index, anim]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });

  return (
    <Animated.View style={{ opacity: anim, transform: [{ scale }] }}>
      {children}
    </Animated.View>
  );
}

export default function PremiumCategoryNav({
  roots = [],
  selection,
  onSelectionChange,
  onSubcategoriesLayout,
}) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const activeParent =
    selection?.type === 'parent'
      ? selection.parent
      : selection?.type === 'child'
        ? selection.parent
        : null;
  const subcategories = activeParent?.children || [];
  const showSubs = activeParent && subcategories.length > 0;

  const isAll = selection?.type === 'all';
  const parentActive = (p) =>
    (selection?.type === 'parent' && selection.parent?.id === p.id)
    || (selection?.type === 'child' && selection.parent?.id === p.id);
  const childActive = (c) => selection?.type === 'child' && selection.category?.id === c.id;
  const allInParentActive = selection?.type === 'parent' && activeParent;

  const parentSnap = getCategorySnapInterval();
  const subSnap = getSubCategorySnapInterval();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.sectionSub}>Swipe to explore collections</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={parentSnap}
        snapToAlignment="start"
        disableIntervalMomentum
        contentContainerStyle={styles.parentRow}
      >
        <CategoryCircle
          label="All"
          subtitle={getCategorySubtitle('all', true)}
          icon="apps-outline"
          active={isAll}
          accent={getCategoryAccent('all', premium)}
          onPress={() => onSelectionChange(ALL_SELECTION)}
        />
        {roots.map((parent) => (
          <CategoryCircle
            key={parent.id}
            label={parent.name}
            subtitle={getCategorySubtitle(parent.name)}
            icon={getCategoryIcon(parent.name)}
            active={parentActive(parent)}
            accent={getCategoryAccent(parent.name, premium)}
            onPress={() => onSelectionChange(createParentSelection(parent))}
          />
        ))}
        <View style={{ width: 8 }} />
      </ScrollView>

      {showSubs ? (
        <FloatingSubcategories
          parentName={activeParent.name}
          onLayoutComplete={onSubcategoriesLayout}
          styles={styles}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={subSnap}
            snapToAlignment="start"
            contentContainerStyle={styles.subRow}
          >
            <StaggerItem index={0}>
              <CategoryCircle
                label="All"
                icon="grid-outline"
                size="sm"
                active={allInParentActive}
                accent={getCategoryAccent(activeParent.name, premium)}
                onPress={() => onSelectionChange(createParentSelection(activeParent))}
              />
            </StaggerItem>
            {subcategories.map((child, index) => (
              <StaggerItem key={child.id} index={index + 1}>
                <CategoryCircle
                  label={child.name}
                  icon={getCategoryIcon(child.name)}
                  size="sm"
                  active={childActive(child)}
                  accent={getCategoryAccent(child.name, premium)}
                  onPress={() => onSelectionChange(createChildSelection(activeParent, child))}
                />
              </StaggerItem>
            ))}
            <View style={{ width: 12 }} />
          </ScrollView>
        </FloatingSubcategories>
      ) : null}
    </View>
  );
}

const createStyles = (premium) => ({

  section: {
    marginBottom: 22,
    paddingTop: 2,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: premium.navy,
    letterSpacing: -0.4,
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '500',
    color: premium.textMuted,
    marginTop: 3,
  },
  parentRow: {
    paddingLeft: 20,
    paddingRight: 12,
    paddingBottom: 6,
    alignItems: 'flex-start',
  },
  subZone: {
    marginTop: 18,
    paddingBottom: 2,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  subHeaderLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: premium.textMuted,
    letterSpacing: 0.4,
    marginRight: 12,
  },
  subHeaderLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: premium.border,
  },
  subRow: {
    paddingLeft: 20,
    paddingRight: 8,
    alignItems: 'flex-start',
  },
});

