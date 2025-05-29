// components/items/PaginationBar.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Layout, Typography, Colors } from "@/styles";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ currentPage, totalPages, onPageChange }: PaginationBarProps) {
  const { t } = useTranslation();
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    } else if (newPage <= 0) {
      onPageChange(totalPages);
    } else {
      onPageChange(1);
    }
  };

  return (
    <View style={Layout.containerRow}>
      <TouchableOpacity 
        onPress={() => handlePageChange(currentPage - 1)} 
        // disabled={currentPage === 1}
      >
        <Text style={[
          Typography.buttonPrimary, 
          // currentPage === 1 && { color: Colors.textMuted }
        ]}>
          {t('items.pagination.prev')}
        </Text>
      </TouchableOpacity>

      <Text style={Typography.bodyBold}>
        {t('items.pagination.pageInfo', { currentPage, totalPages })}
      </Text>

      <TouchableOpacity 
        onPress={() => handlePageChange(currentPage + 1)} 
        // disabled={currentPage === totalPages}
      >
        <Text style={[
          Typography.buttonPrimary,
          // currentPage === totalPages && { color: Colors.textMuted }
        ]}>
          {t('items.pagination.next')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
