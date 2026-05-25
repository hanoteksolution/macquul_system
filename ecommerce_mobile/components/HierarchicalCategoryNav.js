import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ALL_SELECTION,
  createParentSelection,
  createChildSelection,
} from '../utils/categoryTree';

const getIconName = (name) => {
  const key = (name || '').toLowerCase();
  if (key.includes('electronic') || key.includes('laptop') || key.includes('phone')) return 'hardware-chip-outline';
  if (key.includes('stationery') || key.includes('pen') || key.includes('office')) return 'pencil-outline';
  if (key.includes('charger') || key.includes('cable')) return 'flash-outline';
  if (key.includes('headphone') || key.includes('audio')) return 'headset-outline';
  if (key.includes('book')) return 'book-outline';
  return 'pricetag-outline';
};

export default function HierarchicalCategoryNav({
  roots = [],
  selection = ALL_SELECTION,
  onSelectionChange,
  theme,
}) {
  const activeParent =
    selection.type === 'parent'
      ? selection.parent
      : selection.type === 'child'
        ? selection.parent
        : null;

  const subcategories = activeParent?.children || [];

  const isAllActive = selection.type === 'all';
  const isParentActive = (parent) =>
    selection.type === 'parent' && selection.parent?.id === parent.id;
  const isChildActive = (child) =>
    selection.type === 'child' && selection.category?.id === child.id;
  const isParentAllActive =
    selection.type === 'parent' && activeParent && selection.type === 'parent';

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <View style={styles.sectionHeader}>
        <Ionicons name="layers-outline" size={16} color={theme.primary} />
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Categories</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.parentRow}
      >
        <TouchableOpacity
          style={[
            styles.parentChip,
            { backgroundColor: theme.background, borderColor: theme.border },
            isAllActive && [styles.parentChipActive, { backgroundColor: theme.primary, borderColor: theme.primary }],
          ]}
          onPress={() => onSelectionChange(ALL_SELECTION)}
          activeOpacity={0.85}
        >
          <Ionicons
            name="grid-outline"
            size={16}
            color={isAllActive ? '#fff' : theme.textSecondary}
          />
          <Text style={[styles.parentChipText, { color: isAllActive ? '#fff' : theme.text }]}>All</Text>
        </TouchableOpacity>

        {roots.map((parent) => {
          const active = isParentActive(parent) || (activeParent?.id === parent.id && selection.type === 'child');
          return (
            <TouchableOpacity
              key={parent.id}
              style={[
                styles.parentChip,
                { backgroundColor: theme.background, borderColor: theme.border },
                active && [styles.parentChipActive, { backgroundColor: theme.primary, borderColor: theme.primary }],
              ]}
              onPress={() => onSelectionChange(createParentSelection(parent))}
              activeOpacity={0.85}
            >
              <Ionicons
                name={getIconName(parent.name)}
                size={16}
                color={active ? '#fff' : theme.primary}
              />
              <Text style={[styles.parentChipText, { color: active ? '#fff' : theme.text }]} numberOfLines={1}>
                {parent.name}
              </Text>
              {(parent.children?.length > 0) && (
                <View style={[styles.countBadge, active && styles.countBadgeActive]}>
                  <Text style={[styles.countText, { color: active ? theme.primary : theme.textSecondary }]}>
                    {parent.children.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {activeParent && subcategories.length > 0 && (
        <View style={[styles.subSection, { backgroundColor: theme.background }]}>
          <Text style={[styles.subLabel, { color: theme.textSecondary }]}>
            {activeParent.name}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subRow}
          >
            <TouchableOpacity
              style={[
                styles.subChip,
                { borderColor: theme.border },
                isParentAllActive && [styles.subChipActive, { borderColor: theme.primary, backgroundColor: `${theme.primary}18` }],
              ]}
              onPress={() => onSelectionChange(createParentSelection(activeParent))}
            >
              <Text
                style={[
                  styles.subChipText,
                  { color: isParentAllActive ? theme.primary : theme.textSecondary },
                ]}
              >
                All {activeParent.name}
              </Text>
            </TouchableOpacity>

            {subcategories.map((child) => {
              const active = isChildActive(child);
              return (
                <TouchableOpacity
                  key={child.id}
                  style={[
                    styles.subChip,
                    { borderColor: theme.border },
                    active && [styles.subChipActive, { borderColor: theme.primary, backgroundColor: `${theme.primary}18` }],
                  ]}
                  onPress={() => onSelectionChange(createChildSelection(activeParent, child))}
                >
                  <View style={styles.subChipInner}>
                    <View style={[styles.subDot, { backgroundColor: active ? theme.primary : theme.border }]} />
                    <Text
                      style={[styles.subChipText, { color: active ? theme.primary : theme.text }]}
                      numberOfLines={1}
                    >
                      {child.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  parentRow: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 4,
  },
  parentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    maxWidth: 180,
  },
  parentChipActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  parentChipText: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countBadgeActive: {
    backgroundColor: '#fff',
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
  },
  subSection: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 10,
    paddingLeft: 4,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  subRow: {
    paddingHorizontal: 8,
    gap: 8,
    alignItems: 'center',
  },
  subChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  subChipActive: {},
  subChipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subChipText: {
    fontSize: 13,
    fontWeight: '600',
    maxWidth: 140,
  },
});
