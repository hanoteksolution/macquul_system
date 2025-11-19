# 🧪 Testing Automatic Logout System

## 🎯 **How to Test the Automatic Logout**

### **Method 1: Wait for Natural Token Expiration**
1. **Login to the app** with valid credentials
2. **Use the app normally** for the token lifetime (usually 15-60 minutes)
3. **Make any API request** (load products, view profile, etc.)
4. **Expected Result**: 
   - App attempts token refresh automatically
   - If refresh token also expired: "Session Expired" alert appears
   - User automatically navigated to login screen

### **Method 2: Simulate Token Expiration (Developer)**
1. **Login to the app**
2. **Open AsyncStorage** in React Native Debugger
3. **Manually modify the access token** to an expired one
4. **Make any API request**
5. **Expected Result**: Automatic logout triggers

### **Method 3: Test Manual Logout**
1. **Navigate to Profile screen**
2. **Click "Logout" button**
3. **Confirm in dialog**
4. **Expected Result**: 
   - All tokens cleared
   - Navigation reset to login screen

### **Method 4: Test Network Scenarios**
1. **Turn off backend server**
2. **Try to make API requests**
3. **Expected Result**: Network error messages (not logout)
4. **Turn server back on**
5. **App should work normally**

---

## 📱 **What You'll See**

### **Successful Token Refresh**
```
Console Logs:
- "Making API request to: http://10.161.1.4:8000/api/products/"
- "API Error: Request failed with status code 401"
- "Attempting to refresh token..."
- "API Response: 200 - /products/"
```

### **Automatic Logout**
```
Console Logs:
- "Making API request to: http://10.161.1.4:8000/api/profile/"
- "API Error: Request failed with status code 401"
- "Attempting to refresh token..."
- "Token refresh failed, logging out..."
- "User logged out automatically due to token expiration"

User Sees:
- Alert: "Session Expired - Your session has expired. Please login again."
- Automatically navigated to Login screen
```

### **Manual Logout**
```
User Sees:
- Confirmation dialog: "Are you sure you want to logout?"
- After confirmation: Navigated to Login screen

Console Logs:
- "Tokens cleared successfully"
```

---

## 🔍 **Debugging Tips**

### **Check Console Logs**
- All API requests and responses are logged
- Token refresh attempts are logged
- Logout events are logged with reasons

### **Check AsyncStorage**
- Access tokens stored under 'access' key
- Refresh tokens stored under 'refresh' key
- User data stored under 'user' key
- All should be cleared after logout

### **Network Tab**
- Monitor API calls in network debugger
- Look for 401 responses followed by refresh attempts
- Check Authorization headers on requests

---

## 🎉 **Expected Behavior Summary**

✅ **Automatic token refresh works silently**
✅ **Expired sessions trigger automatic logout**
✅ **User sees clear "Session Expired" message**
✅ **Navigation properly resets to login screen**
✅ **All tokens and user data cleared on logout**
✅ **Manual logout works with confirmation**
✅ **Network errors don't trigger logout**
✅ **Login/register errors don't trigger logout**

Your authentication system is now **bulletproof** and handles all edge cases gracefully! 🛡️✨
