// components/items/ItemsScreen.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTags, useItems, useFamily, useDrafts } from '@/hooks';
import { ItemCard, ItemFormModal } from '@/components/items';
import { TagEditModal } from '@/components/tags/TagEditModal';
import { Layout, Colors, Spacing, Typography, ViewComponents, TextComponents } from '@/styles';
import Button from '@/components/common/Button';
import { NoFamilyScreen, LoadingScreen } from '@/components/common/DefaultScreen';
import { ItemOut } from '@/services/types/itemTypes';
import { TextWithView } from '../common/TextWithView';


export function HomeScreen() {

  const { t } = useTranslation();
  const { items, fetchItems } = useItems();
  const { tags, fetchTags } = useTags();
  const { currentFamily, locations, fetchLocations } = useFamily();
  const { aggregatedMap } = useDrafts();
  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedIds] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingItem, setEditingItem] = useState<ItemOut | null>(null);

  const [tagModalVisible, setTagModalVisible] = useState(false);

  // Fetch initial data
  useEffect(() => {
    if (!currentFamily) return;
    setLoading(true);
    Promise.all([
      fetchItems(),
      fetchTags()
    ]);
    setLoading(false);
  }, [currentFamily]);

  const restockNeededItems = useMemo(() => {
    return items.filter((it) => {
      if (it.restockThreshold === undefined) return false;
      if (it.quantity > it.restockThreshold) return false;
      return true;
    });
  }, [items]);

  const openCreate = () => {
    setModalMode('create');
    setEditingItem(null);
    setModalVisible(true);
  };

  const openEdit = (item: ItemOut) => {
    setModalMode('edit');
    setEditingItem(item);
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  const toggleExpanded = (id: number) => {
    if (expandedId === id) {
      setExpandedIds(null);
    } else {
      setExpandedIds(id);
    }
  }

  const openTagModal = () => setTagModalVisible(true);
  const closeTagModal = () => setTagModalVisible(false);

  if (!currentFamily) return (<NoFamilyScreen/>);
  if (loading) return (<LoadingScreen/>);

  return (
    <ScrollView style={ViewComponents.screen} contentContainerStyle={[Layout.column, Layout.screenPadding]}>

      <View style={[Layout.buttonRow]}>
        <Button 
          style={ViewComponents.buttonInRow}
          onPress={openTagModal}
        >
          {t('home.buttonManageTags')}
        </Button>
        <Button 
          style={ViewComponents.buttonInRow}
          onPress={openCreate}
        >
          {t('home.buttonCreateItem')}
        </Button>
      </View>

      <ItemFormModal
        visible={modalVisible}
        mode={modalMode}
        initial={editingItem}
        onClose={closeModal}
        onDone={async () => {
          Promise.all([
            fetchItems(), fetchTags(), fetchLocations()
          ]);
          closeModal();
        }}
      />

      <TagEditModal
        visible={tagModalVisible}
        onClose={closeTagModal}
        onDone={async () => {
          Promise.all([
            fetchItems(), fetchTags(), fetchLocations()
          ]);
          closeTagModal();
        }}
      />

      <TextWithView textStyle={TextComponents.titleText} viewStyle={{...Layout.center, ...Layout.screenPadding}}>
        {t('home.restockTitle')} ({restockNeededItems.length})
      </TextWithView>

      <ScrollView style={{ flex: 1 }}>
        {restockNeededItems.map((itm) => (
          <ItemCard
            key={itm.id}
            item={itm}
            expanded={expandedId === itm.id}
            draftDelta={aggregatedMap.get(itm.id) ?? 0.0}
            onToggle={() => toggleExpanded(itm.id)}
            onEdit={openEdit}
          />
        ))}
      </ScrollView>
    </ScrollView>
  );
}
