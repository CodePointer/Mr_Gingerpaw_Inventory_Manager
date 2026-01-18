import { ViewStyle, TextStyle, View } from 'react-native';
import { Spacing, Colors, Typography } from '@/styles/base';
import { Layout } from '@/styles/layout';
import { selectedTheme } from './theme';


export const ViewComponents: Record<string, ViewStyle> = {
  background: {
    flex: 1,
    backgroundColor: selectedTheme.colors.background,
    alignSelf: 'stretch'
  },
  screen: {
    flex: 1,
    ...Layout.column,
    ...Layout.center,
    width: '100%',
    alignSelf: 'center',
    maxWidth: 800,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    gap: Spacing.medium,
    backgroundColor: selectedTheme.colors.background,
  },
  rowTitle: {
    ...Layout.row,
    ...Layout.center,
    justifyContent: 'space-between',
  },
  rowButtons: {
    ...Layout.row,
    gap: Spacing.small,
    justifyContent: 'space-around',
    width: '100%',
  },
  groupContainer: {
    ...Layout.column,
    paddingHorizontal: Spacing.medium,
    gap: Spacing.small,
  },
  sectionInfoCard: {
    padding: Spacing.medium,
    gap: Spacing.medium,
  },
  modalContainer: {
    borderRadius: Spacing.large,
    overflow: 'hidden',
    width: '90%',
    alignSelf: 'center',
    gap: Spacing.large,
    padding: Spacing.large,
    backgroundColor: selectedTheme.colors.surface,
  },

  cardlessContainer: {
    padding: Spacing.medium,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.backgroundLight,
  },
  card: {
    padding: Spacing.medium,
    marginVertical: Spacing.small,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 8,
    borderWidth: 2,
  },
  subCard: {
    padding: Spacing.small,
    marginVertical: Spacing.xsmall,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 8,
    borderWidth: 1,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.xsmall,
    paddingHorizontal: Spacing.medium,
    borderRadius: 8,
  },
  buttonInRow: {
    flex: 1,
    marginHorizontal: Spacing.xsmall,
  },
  tag: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 6,
    margin: Spacing.xsmall,
  },
  location: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    margin: Spacing.xsmall
  },
  touchableIcon: {
    marginHorizontal: Spacing.xsmall,
  },
  modalOverlay: {
    backgroundColor: Colors.overlay,
    padding: Spacing.medium
  },
  scrollContent: {
    padding: Spacing.large,
  },
}


export const TextComponents: Record<string, TextStyle> = {
  titleText: {
    ...Typography.title,
    // flex: 1,
    marginBottom: Spacing.xsmall,
  },
  subtitleText: {
    ...Typography.subtitle,
    // flex: 1,
  },
  plainText: {
    ...Typography.body,
    // flex: 1,
  },
  smallText: {
    ...Typography.bodySmall,
    // flex: 1,
  },
  boldText: {
    ...Typography.bodyBold,
    // flex: 1,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.white,
  },
  tagText: {
    ...Typography.bodySmall,
    color: Colors.white,
  },
  inputBox: {
    ...Typography.body,
    backgroundColor: Colors.white,
    borderColor: Colors.borderSoft,
    paddingVertical: Spacing.xsmall,
    paddingHorizontal: Spacing.small,
    borderWidth: 2,
    // width: '100%'
    flex: 1
  },
  inputLabel: {
    ...Typography.bodyBold,
    marginRight: Spacing.small,
    width: '20%'
  },
  rawInputText: {
    ...Typography.bodySmall,
    fontStyle: 'italic',
  }
}


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