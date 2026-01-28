// components/common/ActionMenu.tsx
import { Menu } from 'react-native-paper';
import { View } from 'react-native';

export interface ActionMenuItem {
  title: string;
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
}

interface ActionMenuProps {
  visible: boolean;
  onDismiss: () => void;
  items: ActionMenuItem[];
}

export function ActionMenu({ visible, onDismiss, items }: ActionMenuProps) {
  const handleItemPress = (onPress: () => void) => {
    onDismiss();
    onPress();
  };

  return (
    <Menu
      visible={visible}
      onDismiss={onDismiss}
      anchor={{ x: 1000, y: 0 }}
    >
      {items.map((item, index) => (
        <Menu.Item
          key={index}
          onPress={() => handleItemPress(item.onPress)}
          title={item.title}
          leadingIcon={item.icon || undefined}
          disabled={item.disabled}
        />
      ))}
    </Menu>
  );
}
