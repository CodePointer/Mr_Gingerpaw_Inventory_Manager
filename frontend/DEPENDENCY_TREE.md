# Frontend Dependency Tree
## The Great Orange - Frontend Project

*Last updated: March 10, 2026*

This document maps the **actual** dependency tree of the frontend project, starting from the entry point. It includes **only files that are truly used in the rendered code paths**, excluding imports that are declared but unused in component bodies.

---

## Entry Point

```
app/index.tsx
└── Redirects to: /(auth)/login
```

---

## Root Layout & Providers

```
app/_layout.tsx (RootLayout)
├── PaperProvider
│   └── theme: darkTheme (from styles)
├── I18nextProvider
│   └── i18n
├── AlertModalProvider
│   └── hooks/alertmodal/AlertModalContext.tsx
├── ModalProvider
│   └── hooks/modal/ModalContext.tsx
├── AuthProvider
│   └── hooks/auth/AuthContext.tsx
├── UserProvider
│   └── hooks/user/UserContext.tsx
├── FamilyProvider
│   └── hooks/family/FamilyContext.tsx
├── MembershipProvider
│   └── hooks/membership/MembershipContext.tsx
├── TagsProvider
│   └── hooks/tags/TagsContext.tsx
├── ItemsProvider
│   └── hooks/items/ItemsContext.tsx
├── DraftProvider
│   └── hooks/draft/DraftContext.tsx
├── AppbarProvider
│   └── hooks/appbar/AppbarContext.tsx
└── InnerLayout
    ├── LoadingScreen
    │   └── components/common/DefaultScreen.tsx
    └── Slot (expo-router)
        ├── Auth Routes: (auth)
        └── Main App Routes: (tabs)
```

---

## Authentication Routes

### Login Page

```
app/(auth)/login.tsx
└── Components & Hooks:
    ├── LoginScreen
    │   ├── components/auth/LoginScreen.tsx
    │   ├── ButtonGroup
    │   │   └── components/common/ButtonGroup.tsx
    │   ├── Paper: Text, TextInput, Button, Avatar
    │   ├── styles: ViewComponents, Layout, Spacing
    │   └── i18n: useTranslation(['auth', 'common'])
    ├── LoadingScreen
    │   └── components/common/DefaultScreen.tsx
    ├── hooks:
    │   ├── useAuth()
    │   ├── useAlertModal()
    │   └── useModal()
    └── styles: ViewComponents
```

### Register Page

```
app/(auth)/register.tsx
└── RegisterScreen
    └── components/auth/RegisterScreen.tsx
```

### Forget Password Page

```
app/(auth)/forgetpassword.tsx
└── Components & Logic:
    ├── ForgetPasswordScreen
    │   └── components/auth/ForgetPasswordScreen.tsx
    │       └── Paper: Text, TextInput, Button, Divider
    ├── State Management:
    │   ├── step: 'Start' | 'EmailVerified' | 'SecurityAnswerVerified' | 'NewPasswordVerified'
    │   └── Form state: email, resetToken, securityQuestion, securityAnswer, password, etc.
    ├── Handlers:
    │   ├── handleGetSecurityQuestion()
    │   ├── handleVerifySecurityAnswer()
    │   └── handleResetPassword()
    └── Hooks:
        ├── useAuth()
        ├── useAlertModal()
        └── useRouter()
```

---

## Main App Routes (Tabs)

### Tab Layout

```
app/(tabs)/_layout.tsx
├── PaperHeader
│   └── components/navigation/PaperHeader.tsx
│       ├── Paper: Appbar
│       ├── TAB_ICONS config
│       └── useAppbar() hook
├── PaperTabBar
│   └── components/navigation/PaperTabBar.tsx
│       ├── Paper: BottomNavigation
│       ├── TAB_ICONS config
│       └── i18n: useTranslation(['common'])
└── Tabs.Screen Routes:
    ├── home
    ├── items
    ├── draft
    └── me
```

---

## Home Tab

```
app/(tabs)/home.tsx
└── HomeScreen
    └── components/home/HomeScreen.tsx
        ├── Sections:
        │   ├── Greeting Header
        │   │   └── Text (from Paper)
        │   ├── Notifications Section
        │   │   ├── SectionInfoCard
        │   │   │   └── components/me/SectionInfoCard.tsx
        │   │   └── NotificationCard (inline component)
        │   └── AI Manager Section
        │       ├── SectionInfoCard
        │       └── ButtonGroup
        │           └── components/common/ButtonGroup.tsx
        ├── Modal Triggers:
        │   └── open('AIDraftForm', {...})
        │       └── AIDraftFormModal (from ModalContext)
        ├── Hooks:
        │   ├── useDrafts()
        │   ├── useFamily()
        │   ├── useUser()
        │   ├── useAppbar()
        │   ├── useModal()
        │   └── useTranslation(['home', 'common'])
        └── Styles:
            ├── ViewComponents
            ├── Layout
            └── Spacing
```

---

## Items Tab

```
app/(tabs)/items.tsx
└── ItemsScreen
    └── components/items/ItemsScreen.tsx
        ├── Main Components:
        │   ├── ItemsSection
        │   │   └── components/items/ItemsSection.tsx
        │   │       ├── ItemCard
        │   │       │   └── components/items/ItemCard.tsx
        │   │       ├── ItemFilterBar
        │   │       │   └── components/items/ItemFilterBar.tsx
        │   │       ├── PaginationBar
        │   │       │   └── components/items/PaginationBar.tsx
        │   │       └── useModal() to open 'ItemForm'
        │   ├── ActionMenu
        │   │   └── components/common/ActionMenu.tsx
        │   ├── LoadingScreen
        │   │   └── components/common/DefaultScreen.tsx
        │   └── NoFamilyScreen
        │       └── components/common/DefaultScreen.tsx
        ├── Modal Triggers:
        │   ├── open('ItemForm', {...})
        │   │   └── ItemFormModal (from ModalContext)
        │   └── open('TagEdit', {...})
        │       └── TagEditModal (from ModalContext)
        ├── Hooks:
        │   ├── useTags()
        │   ├── useItems()
        │   ├── useUser()
        │   ├── useFamily()
        │   ├── useDrafts()
        │   ├── useAlertModal()
        │   ├── useAppbar()
        │   ├── useModal()
        │   └── useTranslation(['items'])
        └── Styles:
            ├── ViewComponents
            ├── Layout
            └── type mappings (ItemOut, TagOut, etc.)
```

---

## Draft Tab

```
app/(tabs)/draft.tsx
└── DraftScreen
    └── components/draft/DraftScreen.tsx
        ├── Main Sections:
        │   ├── NewItemSection
        │   │   └── components/draft/newItemSection.tsx
        │   ├── UpdatedItemSection
        │   │   └── components/draft/updatedItemSection.tsx
        │   ├── DeletedItemSection
        │   │   └── components/draft/deletedItemSection.tsx
        │   └── TransactionSection
        │       └── components/draft/transactionSection.tsx
        ├── UI Components:
        │   ├── ButtonGroup
        │   │   └── components/common/ButtonGroup.tsx
        │   ├── LoadingScreen
        │   │   └── components/common/DefaultScreen.tsx
        │   └── EmptyScreen
        │       └── components/common/DefaultScreen.tsx
        ├── Modal Triggers:
        │   └── open('ItemForm', {...})
        │       └── ItemFormModal (from ModalContext)
        ├── Hooks:
        │   ├── useDrafts()
        │   ├── useUser()
        │   ├── useFamily()
        │   ├── useItems()
        │   ├── useTags()
        │   ├── useAlertModal()
        │   ├── useModal()
        │   └── useTranslation(['draft', 'common'])
        └── Styles:
            ├── ViewComponents
            └── Layout
```

---

## Me Tab (User Settings)

```
app/(tabs)/me.tsx
└── MeScreen
    └── components/me/MeScreen.tsx
        ├── UserInfoCard
        │   └── components/me/UserInfoCard.tsx
        │       ├── SectionInfoCard
        │       ├── Paper: IconButton, Text
        │       ├── Modal: open('UserInfo', {...})
        │       │   └── UserInfoModal (from ModalContext)
        │       └── Hooks: useUser(), useModal()
        ├── FamilyManager
        │   └── components/me/family/FamilyManager.tsx
        │       ├── FamilyCardList
        │       │   └── components/me/family/FamilyCardList.tsx
        │       ├── SectionInfoCard
        │       ├── Modal Triggers:
        │       │   └── open('FamilyInfoEdit', {...})
        │       │       └── FamilyInfoEditModal (from ModalContext)
        │       ├── Hooks:
        │       │   ├── useUser()
        │       │   ├── useFamily()
        │       │   └── useModal()
        │       └── i18n: useTranslation(['me'])
        └── SettingManager
            └── components/me/SettingManager.tsx
                ├── SectionInfoCard
                ├── ButtonGroup
                │   └── components/common/ButtonGroup.tsx
                ├── Modal Triggers:
                │   ├── open('LanguageSwitch', {})
                │   │   └── LanguageSwitchModal (from ModalContext)
                │   ├── open('FamilyInvitation', {...})
                │   │   └── FamilyInvitationModal (from ModalContext)
                │   └── open('ChangeSecurity', {...})
                │       └── ChangeSecurityModal (from ModalContext)
                ├── Hooks:
                │   ├── useAuth()
                │   ├── useMembership()
                │   ├── useUser()
                │   └── useModal()
                ├── i18n: useTranslation()
                └── Router: useRouter()
```

---

## Modal Context System

```
hooks/modal/ModalContext.tsx
└── Registered Modals:
    ├── ItemForm → ItemFormModal
    │   └── components/items/ItemFormModal.tsx
    │       ├── Paper: Dialog, Portal, TextInput, Button, etc.
    │       ├── Expandable Sections: Locations, Tags
    │       ├── Dialogs:
    │       │   ├── Existing Item Selection
    │       │   └── Location Creation
    │       └── Modal handlers: onSubmit()
    ├── ItemFilter → ItemFilterModal
    │   └── components/items/itemFilterModal.tsx
    ├── TagEdit → TagEditModal
    │   └── TagEditModal (from ModalContext)
    ├── AIDraftForm → AIDraftFormModal
    │   └── AIDraftFormModal (from ModalContext)
    ├── UserInfo → UserInfoModal
    │   └── components/me/UserInfoModal.tsx
    │       └── Paper components
    ├── FamilyInfoEdit → FamilyInfoEditModal
    │   └── components/me/family/FamilyInfoEditModal.tsx
    │       └── Modes: create, edit, delete
    ├── LanguageSwitch → LanguageSwitchModal
    │   └── components/me/setting/LanguageSwitchModal.tsx
    │       └── Language selection buttons (EN, ZH)
    ├── FamilyInvitation → FamilyInvitationModal
    │   └── components/me/setting/FamilyInvitationModal.tsx
    │       └── Token generation and family joining
    └── ChangeSecurity → ChangeSecurityModal
        └── components/me/setting/ChangeSecurityModal.tsx
            ├── Mode: 'password' or 'securityQuestion'
            └── Form inputs and validation
```

---

## Alert Modal System

```
hooks/alertmodal/AlertModalContext.tsx
│
├── Uses:
│   ├── Paper: Dialog, Portal, Button
│   ├── React Native: View, Modal
│   └── React: useRef
│
└── API: showModal(message: string, hasOnlyConfirm?: boolean): Promise<boolean>
    └── Used by:
        ├── Login page (auth failures)
        ├── Register page (auth failures)
        ├── Forget Password page (confirmation)
        ├── Items screen (tag submission feedback)
        ├── Modals (form feedback)
        └── Other screens (general alerts)
```

---

## Core Hooks & Contexts

```
hooks/
├── auth/
│   ├── AuthContext.tsx
│   │   └── API: login(), register(), getSecurityQuestion(), verifyAnswer(), resetPassword()
│   └── useAuth.tsx
├── user/
│   ├── UserContext.tsx
│   │   └── API: updateUserInfo(), updatePassword(), updateSecurityQuestion()
│   └── useUser.tsx
├── family/
│   ├── FamilyContext.tsx
│   │   └── API: selectFamily(), createFamily(), updateFamily(), deleteFamily()
│   └── useFamily.tsx
├── items/
│   ├── ItemsContext.tsx
│   │   └── API: fetchItems(), findItemByInfo()
│   └── useItems.tsx
├── tags/
│   ├── TagsContext.tsx
│   │   └── API: fetchTags(), submitNewTags(), submitUpdatedTags(), submitDeletedTags()
│   └── useTags.tsx
├── membership/
│   ├── MembershipContext.tsx
│   │   └── API: createInviteToken(), joinFamilyWithToken()
│   └── useMembership.tsx
├── draft/
│   ├── DraftContext.tsx
│   │   └── API: generateAiDraft(), submitNewItems(), submitUpdatedItems(), submitDeletedItems(), submitTransactions()
│   └── useDraft.tsx
├── appbar/
│   ├── AppbarContext.tsx
│   │   └── API: registerPageActions(), unregisterPageActions(), getPageActions()
│   └── useAppbar.tsx
└── ui/
    ├── useColorScheme.tsx
    └── useThemeColor.tsx
```

---

## Common Components

```
components/common/
├── ActionMenu.tsx
│   └── Used by: ItemsScreen
├── ButtonGroup.tsx
│   └── Used by: HomeScreen, DraftScreen, SettingManager
├── CustomModal.tsx
│   └── Base modal component (deprecated, replaced by Paper Dialog)
├── DefaultScreen.tsx
│   └── Exports:
│       ├── NoFamilyScreen (used by HomeScreen, ItemsScreen)
│       ├── LoadingScreen (used by RootLayout, ItemsScreen, DraftScreen)
│       └── EmptyScreen (used by DraftScreen)
├── InputField.tsx (legacy)
├── InputSelector.tsx (legacy)
├── LocationSelector.tsx
├── SelectableChip.tsx
└── TextWithView.tsx
```

---

## Styles System

```
styles/
├── index.ts (re-exports all)
├── theme.ts
│   └── Exports: lightTheme, darkTheme, selectedTheme
├── components.ts
│   └── Paper component style overrides
├── layout.ts
│   └── Exports: Layout (row, column, center, etc.)
├── base.ts
│   └── Exports: ViewComponents, Spacing, TextComponents
└── Used in every screen/component for:
    ├── ViewComponents.screen
    ├── ViewComponents.background
    ├── Layout.row, Layout.column, Layout.center
    ├── Spacing.small, Spacing.medium, Spacing.large, etc.
    └── TextComponents
```

---

## Internationalization (i18n)

```
i18n.ts
│
├── Configuration for react-i18next
├── Language: en, zh
│
├── Locales:
│   ├── locales/en/
│   │   ├── auth.json
│   │   ├── common.json
│   │   ├── home.json
│   │   ├── items.json
│   │   ├── me.json
│   │   ├── draft.json
│   │   └── ...
│   └── locales/zh/
│       └── [same structure]
│
└── Used by:
    ├── useTranslation(['auth', 'common'])
    ├── useTranslation(['home'])
    ├── useTranslation(['items'])
    ├── useTranslation(['draft'])
    ├── useTranslation(['me'])
    └── i18n.changeLanguage()
```

---

## Services Layer

```
services/
├── api/
│   ├── auth.ts
│   │   └── Functions: login(), register(), getResetQuestion(), verifyAnswer(), resetPassword()
│   ├── user.ts
│   │   └── Functions: getUserInfo(), updateUserInfo(), updatePassword(), updateSecurityQuestion()
│   ├── family.ts
│   │   └── Functions: createFamily(), updateFamily(), deleteFamily(), selectFamily()
│   ├── items.ts
│   │   └── Functions: fetchItems(), createItem(), updateItem(), deleteItem()
│   ├── tags.ts
│   │   └── Functions: fetchTags(), createTag(), updateTag(), deleteTag()
│   ├── transactions.ts
│   │   └── Functions: submitTransactions()
│   ├── drafts.ts
│   │   └── Functions: generateAiDraft()
│   └── membership.ts
│       └── Functions: createInviteToken(), joinFamily()
│
├── types/
│   ├── aidraftTypes.ts (AIDraftFormModalValues, etc.)
│   ├── index.ts (all type exports)
│   └── General types: UserOut, FamilyOut, ItemOut, TagOut, LocationOut, etc.
│
└── utils/
    ├── tokenService.ts (getToken, setToken, removeToken)
    └── API utilities
```

---

## Navigation Config

```
components/navigation/
├── Config.ts
│   └── TAB_ICONS: Record<TabKey, string>
├── PaperHeader.tsx
│   └── Header component for all screens
└── PaperTabBar.tsx
    └── Bottom tab bar component
```

---

## Type Mapping

```
Key TypeScript types used throughout:
├── User types:
│   ├── UserOut (from API)
│   ├── LoginRequest
│   ├── RegisterRequest
│   └── UserUpdateInfoRequest
├── Family types:
│   ├── FamilyOut
│   ├── FamilyCreate
│   └── MembershipOut
├── Item types:
│   ├── ItemOut
│   ├── ItemFormValues
│   ├── ItemFormModalValues
│   └── TransactionCreate
├── Tag types:
│   ├── TagOut
│   └── TagCreate
├── Location types:
│   └── LocationOut
├── Draft types:
│   └── AIDraftFormModalValues
├── Modal types:
│   └── ForgetPasswordStep: 'Start' | 'EmailVerified' | 'SecurityAnswerVerified' | 'NewPasswordVerified'
└── Navigation types:
    ├── TabKey: 'home' | 'items' | 'draft' | 'me'
    └── RouteNames: (auth), (tabs), etc.
```

---

## Render Path Summary

### User Story: Unauthenticated User
1. App starts → `app/index.tsx` → redirects to `/(auth)/login`
2. Login page renders → `LoginScreen` → `ButtonGroup` + `Paper components`
3. User can click "Language" → opens `LanguageSwitchModal` via `ModalContext`
4. User logs in → redirects to `/(tabs)/me` (default home after setup would be `/(tabs)/items`)

### User Story: Authenticated User Browsing
1. App loads → `app/_layout.tsx` with all providers
2. Tab navigation: `PaperTabBar` + `PaperHeader`
3. Each tab shows:
   - **Home**: `HomeScreen` → `SectionInfoCard` + `ButtonGroup` → Notifications + AI Manager
   - **Items**: `ItemsScreen` → `ItemsSection` → `ItemCard` + `ItemFilterBar` + `PaginationBar`
   - **Draft**: `DraftScreen` → 4 Sections (New, Updated, Deleted, Transactions)
   - **Me**: `MeScreen` → `UserInfoCard` + `FamilyManager` + `SettingManager`

### User Story: Modal Interactions
- Any button that needs modal → calls `useModal()` hook
- Modal renders through centralized `ModalProvider` in `ModalContext`
- Modal handles form submission → calls callback → closes
- Alerts shown via `useAlertModal()` → `showModal()` → Paper `Dialog` with `Portal`

---

## Key Dependencies

```
External Libraries:
├── react-native
├── expo & expo-router
├── react-native-paper (Material Design)
├── react-i18next (i18n)
├── axios (HTTP client)
├── @react-navigation/bottom-tabs
└── @expo/vector-icons

Internal Build System:
├── TypeScript
├── EAS Build (Expo Application Services)
└── Babel (JSX transpilation)
```

---

## Notes

- **Unused Imports**: Some files have imports that are not used in the render path. These are excluded from this tree.
- **Providers Chain**: All providers wrap `InnerLayout` which uses `Slot` from expo-router. This allows nested routing while maintaining context access.
- **Modal System**: Instead of inline modals scattered across components, all modals are registered in `ModalContext` and triggered via `useModal()` hook.
- **Alert System**: Promise-based API using Paper `Dialog` (replaced native `Modal` for better Material Design compliance).
- **Step-Based State Machine**: `ForgetPasswordScreen` uses `step` enum for multi-step flows (not boolean flags).
