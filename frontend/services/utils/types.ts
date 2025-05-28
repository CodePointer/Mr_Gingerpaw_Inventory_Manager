
export interface Tag{
    id: string;
    name: string;
    familyId: string;
  }
  
  export interface Item {
    id: string;
    name: string;
    unit: string;
    quantity: string;
    location: string;
    familyId: string;
    ownerId: string;
    notes: string;
    rawInput: string;
    tags: Tag[];
  }