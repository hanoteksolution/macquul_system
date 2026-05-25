import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getScrollBottomPadding } from '../constants/tabBarLayout';
import usePremiumTheme from '../hooks/usePremiumTheme';
import useThemedStyles from '../hooks/useThemedStyles';
import PremiumBottomDock from './premium/PremiumBottomDock';

export default function CustomBottomTabs({ children, initialTab = 0, navigation, route }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const tabFromRoute = route?.params?.tab;
  const [activeTab, setActiveTab] = useState(
    tabFromRoute !== undefined && tabFromRoute !== null ? tabFromRoute : initialTab
  );
  const insets = useSafeAreaInsets();
  const bottomInset = getScrollBottomPadding(insets);

  useEffect(() => {
    if (tabFromRoute !== undefined && tabFromRoute !== null) {
      setActiveTab(tabFromRoute);
    }
  }, [tabFromRoute]);

  const childProps = { navigation, route, setActiveTab, bottomInset };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {React.Children.map(children, (child, index) =>
          index === activeTab ? React.cloneElement(child, childProps) : null
        )}
      </View>

      <PremiumBottomDock navigation={navigation} activeTab={activeTab} />
    </SafeAreaView>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  content: { flex: 1 },
});

