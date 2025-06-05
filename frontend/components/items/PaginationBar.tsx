// components/items/PaginationBar.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Layout, Typography, Colors, TextComponents } from "@/styles";
import { TextWithView } from "../common/TextWithView";

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
    <View style={[Layout.row, Layout.screenPadding]}>
      <TouchableOpacity 
        onPress={() => handlePageChange(currentPage - 1)} 
        // disabled={currentPage === 1}
      >
        <Text style={TextComponents.subtitleText}>
          {t('items.pagination.prev')}
        </Text>
      </TouchableOpacity>


      <TextWithView textStyle={TextComponents.boldText} viewStyle={Layout.center}>
        {t('items.pagination.pageInfo', { currentPage, totalPages })}
      </TextWithView>

      <TouchableOpacity 
        onPress={() => handlePageChange(currentPage + 1)} 
        // disabled={currentPage === totalPages}
      >
        <Text style={TextComponents.subtitleText}>
          {t('items.pagination.next')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
