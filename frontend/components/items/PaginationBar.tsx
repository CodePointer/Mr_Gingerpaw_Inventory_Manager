// components/items/PaginationBar.tsx
import { View } from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';
import { Layout } from '@/styles';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ currentPage, totalPages, onPageChange }: PaginationBarProps) {
  const pageGapThreshold = 3;
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    } else if (newPage <= 0) {
      onPageChange(totalPages);
    } else {
      onPageChange(1);
    }
  };

  const buttonSize = 40;

  const renderPageButtons = (buttonPage: number) => {
    return (
      <Button
        key={buttonPage}
        mode={"contained"}
        onPress={() => handlePageChange(buttonPage)}
        style={{ 
          width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2,
          minWidth: 0
        }}
        contentStyle={{ 
          width: buttonSize, height: buttonSize, justifyContent: 'center',
        }}
        labelStyle={{
          margin: 0,
          lineHeight: buttonSize, textAlign: 'center',
        }}
        disabled={currentPage === buttonPage}
      >
        {buttonPage}
      </Button>
    );
  };

  const renderJumpEllipsis = () => {
    return (
      <View style={{ width: buttonSize, height: buttonSize, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="titleMedium">...</Text>
      </View>
    );
  };

  const renderAllPageButtons = () => {
    const buttons = [];

    // Always show first page
    buttons.push(renderPageButtons(1));
    
    // Determine range of pages to show around current page
    let startPage = Math.max(2, currentPage - pageGapThreshold);
    if (startPage > 2) {
      buttons.push(renderJumpEllipsis());
    }

    let endPage = Math.min(totalPages - 1, currentPage + pageGapThreshold);
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(renderPageButtons(i));
    }
    if (endPage < totalPages - 1) {
      buttons.push(renderJumpEllipsis());
    }

    // Check if we need to show last page
    if (totalPages > 1 && endPage < totalPages) {
      buttons.push(renderPageButtons(totalPages));
    }
    return buttons;
  };

  return (
    <View style={[Layout.row]}>
      <View style={[Layout.row]}>
        <IconButton 
          icon='chevron-left' 
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        <IconButton 
          icon='chevron-double-left' 
          onPress={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
      </View>
      
      <View style={[Layout.row, { alignItems: 'center', gap: 4 }]}>
        {renderAllPageButtons()}
      </View>
      <View style={[Layout.row]}>
        <IconButton 
          icon='chevron-double-right' 
          onPress={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
        <IconButton 
          icon='chevron-right' 
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </View>
    </View>
  );
}
