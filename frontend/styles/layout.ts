import { ViewStyle } from 'react-native';
import { Colors, Spacing } from '@/styles/base';


export const Layout: Record<string, ViewStyle> = {
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    // paddingHorizontal: Spacing.small,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: Spacing.small,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'flex-start',
    // paddingHorizontal: Spacing.small,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
    paddingHorizontal: Spacing.small,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: Spacing.xsmall,
  },
  contentColumn: {
    flex: 1,
    // padding: Spacing.small,
    paddingVertical: Spacing.small,
    marginVertical: Spacing.xsmall,
  },
  screenPadding: {
    // paddingVertical: Spacing.medium,
    marginVertical: Spacing.medium,
  },
  modalPadding: {
    paddingVertical: Spacing.xsmall,
  }
};