// components/items/ItemsScreen.tsx
import { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { useTags, useItems, useFamily, useDrafts } from "@/hooks";
import { useTranslation } from "react-i18next";
import { ItemCard, ItemFormModal } from "@/components/items";
import { Layout, Colors, Spacing, Typography } from "@/styles";
import Button from "@/components/common/Button";
import { ItemOut } from "@/services/types/itemTypes";


export function HomeScreen() {

  const { t } = useTranslation();
  const { items, fetchItems } = useItems();
  const { tags, fetchTags } = useTags();
  const { currentFamily, locations, fetchLocations } = useFamily();
  const { aggregatedMap } = useDrafts();
  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedIds] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<ItemOut | null>(null);

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
    const eps = 0.00001;
    return items.filter((it) => {
      if (it.restockThreshold === undefined) return false;
      if (it.quantity > it.restockThreshold) return false;
      return true;
    });
  }, [items]);

  const openCreate = () => {
    setModalMode("create");
    setEditingItem(null);
    setModalVisible(true);
  };

  const openEdit = (item: ItemOut) => {
    setModalMode("edit");
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

  if (!currentFamily) {
    return (
      <View style={Layout.container}>
        <Text>{t('home.noFamily')}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={Layout.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={Layout.container}>

      <View style={Layout.center}>
        <Button onPress={openCreate}>{t('home.buttonCreateItem')}</Button>
      </View>

      {modalVisible && (
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
      )}

      <View style={Layout.center}>
        <Text style={[Typography.title]}>
          {t('home.restockTitle')} ({restockNeededItems.length})
        </Text>
      </View>
      <ScrollView style={{ flex: 10 }}>
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

      {/* <View style={styles.card}>
        
      </View> */}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  card: {
    margin: Spacing.medium,
    padding: Spacing.medium,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 8,
    flex: 1,
    height: "100%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  listWrapper: {
    flex: 5,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
