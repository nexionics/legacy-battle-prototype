# Google Sign-In Configuration TODO

The Google Sign-In error (`DEVELOPER_ERROR` / Code 10) is happening natively on your Android device because of a signature mismatch between your app and the Google Cloud project.

## How to bridge this gap

### 1. Get your local signature (SHA-1)

Open your terminal and run:

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**Action**: Copy the string after `SHA1:` (should look like `AA:BB:CC:...`).

### 2. Register it in Google Cloud

- Go to [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials).
- Find (or Create) an **Android Client ID**.
- **Package Name**: `com.legacybattle.android`
- **SHA-1 fingerprint**: Paste your fingerprint from Step 1.

### 3. Update your Config File

- Wait a few minutes for Google's servers to sync.
- Download the new `google-services.json` from your Firebase/Google console.
- **Important**: The current file is missing the `oauth_client` section. The new one will include it once the SHA-1 is added.
- Replace `LB_Mobile/google-services.json` and `LB_Mobile/android/app/google-services.json` with the new file.

Once that native handshake works, it will generate an `idToken`, and then it will successfully hit your backend!
