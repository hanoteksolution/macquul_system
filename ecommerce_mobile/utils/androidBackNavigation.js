import { BackHandler } from 'react-native';
import { createNavigationContainerRef } from '@react-navigation/native';
import { TAB_HOME } from './navigationHelpers';

export const navigationRef = createNavigationContainerRef();

/** Pop stack screens, then return to Home tab — only exit app from Home */
export function handleAndroidBackPress() {
  if (!navigationRef.isReady()) return false;

  if (navigationRef.canGoBack()) {
    navigationRef.goBack();
    return true;
  }

  const route = navigationRef.getCurrentRoute();
  if (route?.name === 'Main') {
    const tab = route.params?.tab;
    if (tab !== undefined && tab !== TAB_HOME) {
      navigationRef.navigate('Main', { tab: TAB_HOME });
      return true;
    }
  }

  return false;
}

export function registerAndroidBackHandler() {
  return BackHandler.addEventListener('hardwareBackPress', handleAndroidBackPress);
}

/** Header / toolbar back — same behavior as hardware back */
export function navigateBackOrHome(navigation) {
  if (navigation?.canGoBack?.()) {
    navigation.goBack();
    return;
  }
  navigation?.navigate?.('Main', { tab: TAB_HOME });
}
