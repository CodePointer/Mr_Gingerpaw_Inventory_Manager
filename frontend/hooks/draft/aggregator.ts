import { ItemOut, ItemUpdate } from '@/services/types';
import { diffItemOuts } from '@/services/types';


export function computeAggregates(
  baseItems: ItemOut[],
  newItems: Record<string, ItemOut>,
  updatedItems: Record<string, ItemOut>
) {
  const aggregatedLocationsRecord: Record<string, number> = {};
  const aggregatedUpdatedParts: Record<string, ItemUpdate> = {};

  // Aggregate items
  const updatedIds = new Set(Object.keys(updatedItems))
  const filteredBase = baseItems.filter(item => !updatedIds.has(item.id))
  const aggregatedItems: ItemOut[] = [
    ...filteredBase,
    ...Object.values(newItems),
    ...Object.values(updatedItems)
  ];

  // Aggregate updated items
  for (const itemId of Object.keys(updatedItems)) {
    const updatedParts = diffItemOuts(
      updatedItems[itemId], baseItems.find(item => item.id === itemId) || {} as ItemOut
    );
    aggregatedUpdatedParts[itemId] = updatedParts;
  }

  // Aggregate locations
  for (const item of aggregatedItems) {
    const location = item.location;
    if (location) {
      const prev = aggregatedLocationsRecord[location] ?? 0;
      aggregatedLocationsRecord[location] = prev + 1;
    }
  }

  // To LocationOut
  const aggregatedLocations = Object.keys(aggregatedLocationsRecord)
    .map(locationName => ({
      locationName,
      itemCount: aggregatedLocationsRecord[locationName]
    }));

  // // Aggregate item creates
  // for (const itemId of Object.keys(newItems)) {
  //   const location = newItems[itemId].location ?? null;
  //   if (location) {
  //     const prev = aggregatedLocations[location] || 0;
  //     aggregatedLocations[location] = prev + 1;
  //   }
  // }

  // // Aggregate item updates
  // for (const itemId of Object.keys(updatedItems)) {
  //   const location = updatedItems[itemId].location ?? null;
  //   if (location) {
  //     const prev = aggregatedLocations[location] || 0;
  //     aggregatedLocations[location] = prev + 1;
  //   }
  // }

  return {
    aggregatedItems,
    aggregatedUpdatedParts,
    aggregatedLocations,
  };
}