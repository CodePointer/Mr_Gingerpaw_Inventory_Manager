import { TextStyle } from "react-native";


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

  new: '#00943eff',            // 成功色
  modified: '#004672ff',           // 警告色
  removed: '#535353ff',              // 错误色

  newLight: '#D4EDDA',
  modifiedLight: '#CCE5FF',
  removedLight: '#F8D7DA',
  changedLight: '#FFF3CD',
  newDark: '#198754',
  modifiedDark: '#0D6EFD',
  removedDark: '#DC3545',
  changedDark: '#FD7E14',
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
  heading:  { fontSize: 22, fontWeight: '700', color: Colors.textDark },
  title: { fontSize: 20, fontWeight: '600', color: Colors.textDark },
  subtitle: { fontSize: 18, fontWeight: '500', color: Colors.textDark },
  bodyBold: { fontSize: 16, fontWeight: '500', color: Colors.textDark },
  body:     { fontSize: 16, color: Colors.textDark },
  bodySmall: { fontSize: 14, color: Colors.textMuted },
  muted:    { fontSize: 14, color: Colors.textMuted },
  button:   { fontSize: 16, fontWeight: '500', color: Colors.white },
};
