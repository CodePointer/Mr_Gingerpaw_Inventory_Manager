import { ViewStyle } from 'react-native';
import { Spacing } from '@/styles/base';
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
    maxWidth: 800,
    alignSelf: 'center',
    gap: Spacing.large,
    padding: Spacing.large,
    backgroundColor: selectedTheme.colors.surface,
  },
  itemCard: {
    padding: Spacing.medium,
    gap: Spacing.small,
    borderRadius: 32,
  },
  itemStatusBadge: {
    ...Layout.row,
    alignItems: 'center',
    gap: Spacing.small,
  },
  paginationButton: {
    width: 20,
    height: 40,
    borderRadius: 32,
  },
  itemFilterBarContainer: {
    ...Layout.column,
    gap: Spacing.small,
  },
  tagsContainer: {
    ...Layout.rowWrap,
    gap: Spacing.xsmall,
  },
  draftCardSet: {
    ...Layout.column,
    padding: Spacing.large,
    borderWidth: 2,
    borderRadius: 8,
    gap: Spacing.medium,
  },
  itemModalSectionContainer: {
    ...Layout.column,
    gap: Spacing.medium,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: selectedTheme.colors.outline,
    padding: Spacing.medium,
  },
  itemModalSectionTitle: {
    ...Layout.rowWrap,
    gap: Spacing.small,
  },
  itemModalSectionContent: {
    ...Layout.column,
    padding: Spacing.small,
  }
}
