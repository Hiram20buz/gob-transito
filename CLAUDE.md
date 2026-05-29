# CLAUDE.md — React Native Project Guidelines

> This file defines the architecture, coding standards, security rules, and patterns Claude must follow when working on this React Native codebase.

---

## 1. Project Philosophy

- **Clean Code first**: readable, self-documenting, and maintainable code over clever shortcuts.
- **Performance by default**: avoid unnecessary re-renders, heavy computations on the main thread, and memory leaks.
- **Security always**: never trust user input, always request permissions explicitly, never expose secrets.
- **Component-driven**: everything is a composable, reusable component with a single responsibility.

---

## 2. Design Pattern: Feature-Sliced Architecture

Organize code by **feature**, not by type.

```
src/
├── app/                    # App entry, providers, navigation root
│   ├── App.tsx
│   ├── providers/          # ThemeProvider, AuthProvider, QueryClientProvider
│   └── navigation/         # RootNavigator, stacks, tabs
│
├── features/               # Self-contained feature modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   └── index.ts        # Public API of this feature
│   ├── camera/
│   ├── profile/
│   └── ...
│
├── shared/                 # Reusable across features
│   ├── components/         # UI primitives (Button, Input, Card, Modal…)
│   ├── hooks/              # usePermission, useDebounce, useAsync…
│   ├── services/           # API client, storage, analytics
│   ├── utils/              # Pure helper functions
│   ├── constants/          # Colors, spacing, typography tokens
│   └── types/              # Shared TypeScript types and interfaces
│
└── assets/                 # Images, fonts, icons
```

**Rules:**
- Features import only from `shared/` or their own folder. Never cross-import between features directly — use the feature's `index.ts` public API.
- `shared/` must not import from `features/`.

---

## 3. Component Standards

### 3.1 Anatomy of a Component

Every component file must follow this structure:

```tsx
// 1. React & RN imports
import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

// 2. Third-party imports
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// 3. Internal imports (shared → local)
import { colors, spacing, typography } from '@/shared/constants';
import type { ButtonProps } from './Button.types';

// 4. Component
const Button = memo(({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSpring(0.96, {}, () => { scale.value = withSpring(1); });
    onPress?.();
  }, [onPress, scale]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[styles.base, styles[variant], disabled && styles.disabled]}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
      >
        <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
});

Button.displayName = 'Button';

// 5. Styles (at the bottom, never inline for non-trivial styles)
const styles = StyleSheet.create({
  base: { borderRadius: 12, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  primary: { backgroundColor: colors.brand[500] },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.brand[500] },
  disabled: { opacity: 0.4 },
  label: { ...typography.labelMd, textAlign: 'center' },
  primaryLabel: { color: colors.white },
  secondaryLabel: { color: colors.brand[500] },
});

export default Button;
```

### 3.2 Rules

- **Always use `memo()`** on components that receive props and don't need to re-render with every parent update.
- **Never define components inside other components** — they get recreated on every render.
- **Separate concerns**: logic in hooks, presentation in components, data fetching in services.
- **One component per file.** File name = component name.
- **No anonymous default exports.** Always name your component and set `displayName`.

---

## 4. Performance Standards

### 4.1 Render Optimization

```tsx
// ✅ Stable references with useCallback and useMemo
const handleSubmit = useCallback(() => { /* ... */ }, [dependency]);
const expensiveData = useMemo(() => computeHeavyStuff(input), [input]);

// ❌ Never create objects/arrays/functions inline in JSX
<MyComponent style={{ margin: 10 }} onPress={() => doSomething()} />

// ✅ Extract them
const containerStyle = useMemo(() => ({ margin: 10 }), []);
<MyComponent style={containerStyle} onPress={handlePress} />
```

### 4.2 Lists

- Always use `FlatList` or `FlashList` for lists — never `ScrollView` + `.map()` for large datasets.
- Always provide `keyExtractor`, `getItemLayout` (if items are fixed-height), and `windowSize`.
- Use `removeClippedSubviews={true}` on Android for long lists.

```tsx
<FlashList
  data={items}
  keyExtractor={(item) => item.id}
  estimatedItemSize={72}
  renderItem={renderItem}         // defined outside with useCallback
  removeClippedSubviews
/>
```

### 4.3 Images

- Use `react-native-fast-image` for remote images. Always set explicit `width` and `height`.
- Never use `resizeMode="contain"` without explicit dimensions — causes layout thrashing.

### 4.4 Animations

- All animations must run on the **UI thread** using `react-native-reanimated` or `Animated` with `useNativeDriver: true`.
- Never run animations via JS `setInterval` or `setTimeout`.

### 4.5 Heavy Work

- Offload heavy computation (image processing, encryption, large JSON parsing) to a **background thread** using `react-native-quick-base64`, `expo-task-manager`, or a native module — never block the JS thread.

---

## 5. Permissions — Camera & File Access

> **Security Rule**: Always request permissions at the point of use (not at app launch). If denied, show a clear explanation and guide the user to Settings. Never silently fail.

### 5.1 Centralized Permission Hook

```ts
// src/shared/hooks/usePermission.ts
import { useCallback, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  type Permission,
} from 'react-native-permissions';

type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable' | 'limited';

interface UsePermissionReturn {
  status: PermissionStatus | null;
  requestPermission: () => Promise<boolean>;
}

const PERMISSION_MESSAGES: Record<string, { title: string; message: string }> = {
  camera: {
    title: 'Camera Access Required',
    message: 'This app needs access to your camera to take photos. Please enable it in Settings.',
  },
  photoLibrary: {
    title: 'Photo Library Access Required',
    message: 'This app needs access to your photos to upload files. Please enable it in Settings.',
  },
  microphone: {
    title: 'Microphone Access Required',
    message: 'This app needs microphone access for video recording. Please enable it in Settings.',
  },
};

export const usePermission = (permissionKey: keyof typeof PERMISSION_MESSAGES): UsePermissionReturn => {
  const [status, setStatus] = useState<PermissionStatus | null>(null);

  const getPermissionType = useCallback((): Permission => {
    const isIOS = Platform.OS === 'ios';
    switch (permissionKey) {
      case 'camera':
        return isIOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
      case 'photoLibrary':
        return isIOS ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
      case 'microphone':
        return isIOS ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
      default:
        throw new Error(`Unknown permission: ${permissionKey}`);
    }
  }, [permissionKey]);

  const showSettingsAlert = useCallback(() => {
    const { title, message } = PERMISSION_MESSAGES[permissionKey];
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]);
  }, [permissionKey]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const permission = getPermissionType();
      const currentStatus = await check(permission);

      if (currentStatus === RESULTS.GRANTED || currentStatus === RESULTS.LIMITED) {
        setStatus('granted');
        return true;
      }

      if (currentStatus === RESULTS.BLOCKED) {
        setStatus('blocked');
        showSettingsAlert();
        return false;
      }

      if (currentStatus === RESULTS.UNAVAILABLE) {
        setStatus('unavailable');
        return false;
      }

      // First-time request
      const requestResult = await request(permission);

      if (requestResult === RESULTS.GRANTED || requestResult === RESULTS.LIMITED) {
        setStatus('granted');
        return true;
      }

      if (requestResult === RESULTS.BLOCKED) {
        setStatus('blocked');
        showSettingsAlert();
        return false;
      }

      setStatus('denied');
      return false;
    } catch (error) {
      console.error('[usePermission] Error requesting permission:', error);
      setStatus('denied');
      return false;
    }
  }, [getPermissionType, showSettingsAlert]);

  return { status, requestPermission };
};
```

### 5.2 Camera Usage Pattern

```tsx
// src/features/camera/hooks/useCamera.ts
import { useCallback } from 'react';
import { launchCamera } from 'react-native-image-picker';
import { usePermission } from '@/shared/hooks/usePermission';

export const useCamera = () => {
  const { requestPermission } = usePermission('camera');

  const openCamera = useCallback(async () => {
    const granted = await requestPermission();
    if (!granted) return null;   // Permission denied — already alerted the user

    return launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: false,
    });
  }, [requestPermission]);

  return { openCamera };
};
```

### 5.3 File / Photo Library Upload Pattern

```tsx
// src/features/upload/hooks/useFilePicker.ts
import { useCallback } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { usePermission } from '@/shared/hooks/usePermission';

export const useFilePicker = () => {
  const { requestPermission } = usePermission('photoLibrary');

  const pickImage = useCallback(async () => {
    const granted = await requestPermission();
    if (!granted) return null;

    return launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 });
  }, [requestPermission]);

  const pickDocument = useCallback(async () => {
    // Documents don't need a photo permission, but handle errors gracefully
    try {
      return await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images, DocumentPicker.types.plainText],
        copyTo: 'cachesDirectory',
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) return null;
      throw err;
    }
  }, []);

  return { pickImage, pickDocument };
};
```

### 5.4 Required `Info.plist` / `AndroidManifest.xml` Entries

**iOS — `Info.plist`**
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to let you take photos and videos.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photo library to let you upload images.</string>

<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for video recording.</string>
```

**Android — `AndroidManifest.xml`**
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />       <!-- API 33+ -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
    android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
    android:maxSdkVersion="28" />
```

---

## 6. Security Standards

### 6.1 Secrets Management

- **Never hardcode API keys, tokens, or passwords** in the codebase.
- Store secrets in `.env` (excluded from git via `.gitignore`) and access via `react-native-config` or `expo-constants`.
- For sensitive data (auth tokens, biometric keys): use `react-native-keychain` — never `AsyncStorage`.

```ts
// ✅ Secure token storage
import * as Keychain from 'react-native-keychain';

export const saveAuthToken = (token: string) =>
  Keychain.setGenericPassword('auth_token', token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });

export const getAuthToken = async (): Promise<string | null> => {
  const creds = await Keychain.getGenericPassword();
  return creds ? creds.password : null;
};

// ❌ Never do this
await AsyncStorage.setItem('token', userToken);
```

### 6.2 Network Security

- All API calls must go through HTTPS. Disable cleartext traffic in `AndroidManifest.xml`:
  ```xml
  <application android:usesCleartextTraffic="false" ...>
  ```
- Enable **Certificate Pinning** for production builds using `react-native-ssl-pinning`.
- Never log sensitive data: strip tokens, passwords, and PII from all console/analytics logs.
- Validate and sanitize all user input before sending to the API.

### 6.3 Authentication

- Implement token refresh logic. Access tokens max 15 minutes; refresh tokens stored securely in Keychain.
- Lock the app after a configurable idle timeout using `AppState` listeners.
- Offer biometric authentication (`react-native-biometrics`) as a secondary layer.

### 6.4 Code & Bundle Security

- Enable Hermes engine for smaller, faster, and harder-to-reverse bundles.
- Enable ProGuard / R8 on Android release builds.
- Never expose internal stack traces or error details to the end user — show a generic error message and log details server-side.

### 6.5 Deep Links

- Always validate deep link parameters before navigating or executing any logic.
- Never trust query params from external URLs without sanitization.

---

## 7. TypeScript Standards

- **Strict mode enabled** in `tsconfig.json` (`"strict": true`).
- No `any`. Use `unknown` when the type is truly unknown, then narrow it.
- All props interfaces defined in a co-located `.types.ts` file.
- Prefer `interface` for object shapes, `type` for unions and utility types.

```ts
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ❌ Avoid
const getUser = (id: any): any => { /* ... */ };
```

---

## 8. State Management

| Scope | Tool |
|---|---|
| Server/async state | `@tanstack/react-query` |
| Global UI state (auth, theme) | `Zustand` |
| Local component state | `useState` / `useReducer` |
| Form state | `react-hook-form` |

- Derive state when possible — don't duplicate data in multiple stores.
- Zustand stores must be typed and use the `immer` middleware for complex updates.

---

## 9. Error Handling

- Wrap every API call in try/catch and handle errors at the boundary (service layer), not inside components.
- Use an **Error Boundary** component wrapping each screen.
- Integrate a crash reporting tool (e.g., Sentry) and tag errors with context (user ID, screen name).
- Show user-friendly error messages — never raw error strings from the server.

```tsx
// Global Error Boundary
class AppErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    Sentry.captureException(error, { extra: info });
  }

  render() {
    if (this.state.hasError) return <ErrorScreen onRetry={() => this.setState({ hasError: false })} />;
    return this.props.children;
  }
}
```

---

## 10. Accessibility

- Every interactive element must have `accessibilityRole`, `accessibilityLabel`, and `accessibilityState`.
- Minimum touch target size: **44×44pt** (Apple HIG) / **48×48dp** (Material).
- Support Dynamic Type (iOS) and font scaling (Android) — never use hardcoded font sizes without `allowFontScaling`.
- Test with VoiceOver (iOS) and TalkBack (Android) before each release.

---

## 11. Testing Standards

| Layer | Tool |
|---|---|
| Unit (utils, hooks) | Jest + React Native Testing Library |
| Component | RNTL + snapshot |
| Integration | RNTL + MSW (mock service worker) |
| E2E | Detox |

- **Coverage target**: ≥ 80% for `shared/` and feature services.
- Every `usePermission` flow must have a test covering: granted, denied, and blocked states.

---

## 12. Git Conventions

- **Branches**: `feature/<ticket-id>-short-description`, `fix/<ticket-id>-short-description`
- **Commits**: Conventional Commits format — `feat:`, `fix:`, `chore:`, `refactor:`, `test:`
- **PRs**: Must include a description, screenshots/recordings for UI changes, and a checklist confirming performance, security, and accessibility checks were done.
- **No secrets, no debug logs, no `TODO` comments** in merged code.

---

## 13. Tooling Checklist

| Tool | Purpose |
|---|---|
| `react-native-permissions` | Permission requests (camera, storage, mic) |
| `react-native-image-picker` | Camera & gallery access |
| `react-native-document-picker` | File uploads |
| `react-native-keychain` | Secure credential storage |
| `react-native-reanimated` | UI-thread animations |
| `@shopify/flash-list` | Performant lists |
| `@tanstack/react-query` | Server state management |
| `zustand` | Global UI state |
| `react-hook-form` + `zod` | Forms + validation |
| `sentry-expo` / `@sentry/react-native` | Error monitoring |

---

*Keep this file updated as the project evolves. Every architectural decision that affects the whole codebase belongs here.*