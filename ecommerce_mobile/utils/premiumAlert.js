/** Global bridge so api.js and non-hook code can show premium alerts */
let alertFn = null;

export function registerPremiumAlert(fn) {
  alertFn = fn;
  global.__premiumAlertFn = fn;
}

export function premiumAlert(title, message, buttons, options) {
  if (alertFn) {
    alertFn(title, message, buttons, options);
    return;
  }
  const { Alert } = require('react-native');
  Alert.alert(title, message, buttons);
}

export default premiumAlert;
