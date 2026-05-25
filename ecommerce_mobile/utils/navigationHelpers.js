/** Tab indices in CustomBottomTabs — must match children order in App.js */
export const TAB_HOME = 0;
export const TAB_SHOP = 1;
export const TAB_ORDERS = 2;
export const TAB_PROFILE = 3;

/** Go to Main and open the Shop / Products tab */
export function goToShop(navigation) {
  if (!navigation?.reset) {
    navigation?.navigate?.('Main', { tab: TAB_SHOP });
    return;
  }
  navigation.reset({
    index: 0,
    routes: [{ name: 'Main', params: { tab: TAB_SHOP } }],
  });
}
