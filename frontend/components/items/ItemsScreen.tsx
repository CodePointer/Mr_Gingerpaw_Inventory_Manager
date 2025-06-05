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
import { NoFamilyScreen, LoadingScreen } from "@/components/common/DefaultScreen";
import { ItemCard } from "@/components/items/ItemCard";
import { ItemFilterBar } from "@/components/items/ItemFilterBar";
import { ItemFormModal } from "@/components/items/ItemFormModal";
import { PaginationBar } from "@/components/items/PaginationBar";
import { ViewComponents, Colors, Layout } from "@/styles";
import { useRouter } from "expo-router";
import { ItemOut } from "@/services/types/itemTypes";



export function ItemsScreen() {
  const { t } = useTranslation();
  const { items, fetchItems } = useItems();
  const { tags, fetchTags } = useTags();
  const { currentFamily, locations, fetchLocations } = useFamily();
  const { aggregatedMap } = useDrafts();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set());
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const [filteredItems, setFilteredItems] = useState<typeof items>([]);
  const [pageItems, setPageItems] = useState<typeof items>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

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

  useEffect(() => {
    setFilteredItems(items.filter((it) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = it.name.toLowerCase().includes(query);
        const unitMatch = it.unit.toLowerCase().includes(query);
        const locationMatch = it.location.toLowerCase().includes(query);
        if (!nameMatch && !unitMatch && !locationMatch) {
          return false;
        }
      }
      if (selectedLocation && it.location !== selectedLocation) return false;
      if (selectedTagIds.size > 0) {
        const itemTagIds = new Set(it.tags?.map((t) => t.id));
        for (let t of selectedTagIds) {
          if (!itemTagIds.has(t)) return false;
        }
      }
      return true;
    }));
    setCurrentPage(1);
  }, [items, searchQuery, selectedTagIds, selectedLocation]);

  // Handle pagination
  useEffect(() => {
    setTotalPages(Math.ceil(filteredItems.length / pageSize));
    // console.log(filteredItems.length, currentPage, totalPages);
    const start = (currentPage - 1) * pageSize;
    setPageItems(filteredItems.slice(start, start + pageSize));
  }, [filteredItems, currentPage]);

  // Handle tag toggle
  const toggleTagIds = (tagId: number) => {
    const newTagIds = new Set(selectedTagIds);
    if (newTagIds.has(tagId)) {
      newTagIds.delete(tagId);
    } else {
      newTagIds.add(tagId);
    }
    setSelectedTagIds(newTagIds);
  };

  const toggleLocation = (locationName: string) => {
    setSelectedLocation(locationName === selectedLocation ? null : locationName);
  }

  const openEdit = (item: ItemOut) => {
    setModalMode("edit");
    setEditingItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setModalVisible(false)
  };

  const toggleExpanded = (id: number) => {
    if (expandedId === id) {
      setExpandedIds(null);
    } else {
      setExpandedIds(id);
    }
  }

  if (!currentFamily) return (<NoFamilyScreen />);

  if (loading) return (<LoadingScreen />);

  return (
    <View style={[Layout.column, ViewComponents.screen]}>
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

      {/* 筛选栏 */}
      <ItemFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        locations={locations}
        selectedLocationName={selectedLocation}
        onToggleLocation={toggleLocation}
        tags={tags}
        selectedTagIds={selectedTagIds}
        onToggleTagIds={toggleTagIds}
        style={Layout.screenPadding}
      />

      {/* 列表区域 */}
      <ScrollView style={{ flex: 1 }}>
        {pageItems.map((itm) => (
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

      {/* 分页栏 */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </View>
  );
}
