import { ViewStyle } from 'react-native';
import { Spacing } from '@/styles/base';


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
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  }
};