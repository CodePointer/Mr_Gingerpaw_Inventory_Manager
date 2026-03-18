import { useContext } from 'react';
import { TagsContext } from './TagsContext';


export const useTags = () => {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error('useTags must be used within a TagsProvider');
  }
  return context;
};