import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ITEM_IMPORT_TEMPLATE } from './csvImport';

const TEMPLATE_FILE_NAME = 'item-import-template.csv';

export async function downloadItemImportTemplate(): Promise<void> {
  if (Platform.OS === 'web') {
    const blob = new Blob([ITEM_IMPORT_TEMPLATE], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = TEMPLATE_FILE_NAME;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    return;
  }

  if (!FileSystem.cacheDirectory || !(await Sharing.isAvailableAsync())) {
    throw new Error('Template sharing is not available on this device.');
  }

  const uri = `${FileSystem.cacheDirectory}${TEMPLATE_FILE_NAME}`;
  await FileSystem.writeAsStringAsync(uri, ITEM_IMPORT_TEMPLATE, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  await Sharing.shareAsync(uri, {
    mimeType: 'text/csv',
    UTI: 'public.comma-separated-values-text',
    dialogTitle: TEMPLATE_FILE_NAME,
  });
}

export async function pickItemImportCsv(): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['text/csv', 'text/comma-separated-values', 'application/vnd.ms-excel'],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled) return null;
  const asset = result.assets[0];
  if (asset.file) return asset.file.text();
  return FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.UTF8 });
}
