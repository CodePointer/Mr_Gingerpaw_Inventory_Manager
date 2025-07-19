import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { ItemCard } from '@/components/items/ItemCard';
import { ItemFilterBar } from '@/components/items/ItemFilterBar';
import { PaginationBar } from '@/components/items/PaginationBar';
import { Layout } from '@/styles';
import { ItemOut, TransactionCreate, TagOut, LocationOut } from '@/services/types';
import { all } from 'axios';


interface ItemsSectionProps {
  allItems: ItemOut[];
  allTransactions: Record<string, TransactionCreate>;
  allTags: TagOut[];
  allLocations: LocationOut[];
  itemStatus: (itemId: string) => 'normal' | 'new' | 'modified' | 'deleted';
  itemOnCreate: () => void;
  itemOnModify: (itemId: string) => void;
  itemOnRemove: (itemId: string) => void;
  itemOnChangeQuantity: (itemId: string, changeTo: number) => void;
  tagOnEdit: () => void;
}


export function ItemsSection({
  allItems,
  allTransactions,
  allTags,
  allLocations,
  itemStatus,
  itemOnCreate,
  itemOnModify,
  itemOnRemove,
  itemOnChangeQuantity,
  tagOnEdit,
}: ItemsSectionProps) {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const [filteredItems, setFilteredItems] = useState<ItemOut[]>([]);
  const [pageItems, setPageItems] = useState<ItemOut[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  const [expandedId, setExpandedIds] = useState<string | null>(null);

  useEffect(() => {
    setFilteredItems(allItems.filter((it) => {
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
        const itemTagIds = new Set(it.tagIds);
        for (let t of selectedTagIds) {
          if (!itemTagIds.has(t)) return false;
        }
      }
      return true;
    }));
    setCurrentPage(1);
  }, [allItems, searchQuery, selectedTagIds, selectedLocation]);

  // Handle pagination
  useEffect(() => {
    setTotalPages(Math.ceil(filteredItems.length / pageSize));
    // console.log(filteredItems.length, currentPage, totalPages);
    const start = (currentPage - 1) * pageSize;
    setPageItems(filteredItems.slice(start, start + pageSize));
  }, [filteredItems, currentPage]);

  // Handle tag toggle
  const toggleTagIds = (tagId: string) => {
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

  const toggleExpanded = (id: string) => {
    if (expandedId === id) {
      setExpandedIds(null);
    } else {
      setExpandedIds(id);
    }
  }

  const matchTagsWithIds = (item: ItemOut): string[] => {
    if (!item.tagIds) return [];
    const tagNames = item.tagIds.map(tagId => allTags.find(tag => tag.id === tagId)?.name ?? '') || []
    // console.log('item:', item);
    // console.log('item.tagIds:', item.tagIds);
    // console.log('tagNames:', tagNames);
    return tagNames;
  }

  return (
    <>
      {/* 筛选栏 */}
      <ItemFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        itemCreate={itemOnCreate}
        tagEdit={tagOnEdit}
        locations={allLocations}
        selectedLocationName={selectedLocation}
        onToggleLocation={toggleLocation}
        tags={allTags}
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
            tags={matchTagsWithIds(itm)}
            expanded={expandedId === itm.id}
            status={itemStatus(itm.id)}
            draftDelta={allTransactions[itm.id]?.quantity ?? 0.0}
            onToggle={() => toggleExpanded(itm.id)}
            onModify={itemOnModify}
            onRemove={itemOnRemove}
            onChangeQuantity={itemOnChangeQuantity}
          />
        ))}
      </ScrollView>

      {/* 分页栏 */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  )
}