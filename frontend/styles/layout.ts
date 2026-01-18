import { ViewStyle } from 'react-native';
import { Colors, Spacing } from '@/styles/base';


export const Layout: Record<string, ViewStyle> = {
  column: {
    flexDirection: 'column',
    alignItems: 'stretch',
    // justifyContent: 'space-between',
    // paddingHorizontal: Spacing.small,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    // paddingHorizontal: Spacing.small,
  },
  normalGap: {
    gap: Spacing.medium,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'flex-start',
    // paddingHorizontal: Spacing.small,
  },
  center: {
    // alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  screen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    gap: Spacing.medium,
    maxWidth: 1000,
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
    marginVertical: Spacing.small,
    marginHorizontal: Spacing.medium,
    // paddingVertical: Spacing.xsmall,
  }
};