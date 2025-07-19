// components/home/HomeScreen.tsx
import { useFamily } from '@/hooks';
import { NoFamilyScreen, EmptyScreen } from '@/components/common/DefaultScreen';


export function HomeScreen() {

  const { currentFamily } = useFamily();
  if (!currentFamily) return (<NoFamilyScreen/>);

  return (<EmptyScreen />);

  // return (
  //   <ScrollView style={ViewComponents.screen} contentContainerStyle={[Layout.column, Layout.screenPadding]}>
  //     {/* <ScrollView style={{ flex: 1 }}>
  //       {restockNeededItems.map((itm) => (
  //         <ItemCard
  //           key={itm.id}
  //           item={itm}
  //           expanded={expandedId === itm.id}
  //           draftDelta={transactionsState.transactions[itm.id]?.quantity ?? 0.0}
  //           onToggle={() => toggleExpanded(itm.id)}
  //           onEdit={(itm.id) => ()}
  //         />
  //       ))}
  //     </ScrollView> */}
  //   </ScrollView>
  // );
}
