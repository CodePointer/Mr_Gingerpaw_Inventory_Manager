// theme.ts
// Consolidated design tokens: Colors, Spacing, Typography, Layout, Components

import { ViewStyle, TextStyle } from 'react-native';


export const Colors = {
  backgroundLight: '#fff3e6',
  backgroundCard: '#fffaf4',
  borderSoft: '#ffcc99',       // 浅橘分割线
  primary: '#ffa94d',          // 明亮橘色
  primaryDeep: '#e67e00',      // 强调橘色
  textDark: '#333333',
  textMuted: '#888888',
  white: '#ffffff',
  success: '#e0f7e9',          // 功能色：成功／增量
  failed: '#fdecea',           // 功能色：失败／减量
  deleted: '#f0f0f0',          // 功能色：删除／禁用
  overlay: 'rgba(0,0,0,0.5)',  // 弹窗遮罩色 fileciteturn3file7
};

export const Spacing = {
  xsmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  cardPadding: 15,
  smallCardPadding: 8,
};

export const Typography: Record<string, TextStyle> = {
  title: { fontSize: 20, fontWeight: '600', color: Colors.textDark },
  subtitle: { fontSize: 18, fontWeight: '500', color: Colors.textDark },
  heading:  { fontSize: 22, fontWeight: '700', color: Colors.textDark },
  body:     { fontSize: 16, color: Colors.textDark },
  bodySmall: { fontSize: 14, color: Colors.textMuted },
  bodyBold: { fontSize: 16, fontWeight: '500', color: Colors.textDark },
  muted:    { fontSize: 14, color: Colors.textMuted },
  button:   { fontSize: 16, fontWeight: '500', color: Colors.white },
  buttonPrimary: {fontSize: 16, fontWeight: '500', color: Colors.primary },
};

export const Layout: Record<string, ViewStyle> = {
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.small,
    backgroundColor: Colors.backgroundLight,
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.medium,
    borderTopWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.backgroundLight,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 8,
    padding: Spacing.cardPadding,
    marginVertical: Spacing.small,
    borderColor: Colors.borderSoft,
    borderWidth: 1,
  },
  itemCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 8,
    padding: Spacing.smallCardPadding,
    marginVertical: Spacing.xsmall,
    borderColor: Colors.borderSoft,
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.medium
  }
};

export const Components: Record<string, ViewStyle | TextStyle> = {
  titleLabel: {
    ...Typography.subtitle,
    marginBottom: Spacing.small,
  } as TextStyle,

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.xsmall,
    paddingHorizontal: Spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // elevation: 3,
  } as ViewStyle,
  buttonText: Typography.button as ViewStyle,

  inputBox: {
    ...Typography.body,
    backgroundColor: Colors.white,
    borderColor: Colors.borderSoft,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  } as TextStyle,
  inputLabel: {
    ...Typography.bodyBold,
    marginRight: Spacing.small,
  } as TextStyle,

  touchableIcon: {
    marginHorizontal: Spacing.xsmall,
  } as ViewStyle,

  itemCard: {
    ...Layout.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,

  tag: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: Spacing.small,
  } as ViewStyle,
  tagText: { color: Colors.white, fontWeight: '500' } as TextStyle,
};
