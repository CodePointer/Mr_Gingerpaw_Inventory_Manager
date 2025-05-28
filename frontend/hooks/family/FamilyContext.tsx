import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  getFamilyDetails,
  createFamily,
  updateFamily,
  deleteFamily,
  getFamilyMembers,
  getFamilyLocations
} from "@/services/api/family";
import {
  FamilyOut,
  FamilyCreate,
  FamilyUpdate,
  LocationOut,
  UserOut
} from "@/services/types";


interface FamilyContextType {
  currentFamily: FamilyOut | null;
  members: UserOut[];
  locations: LocationOut[];
  selectFamily: (data: FamilyOut) => Promise<boolean>;
  fetchLocations: () => Promise<boolean>;
  fetchMembers: () => Promise<boolean>;
  createFamily: (data: FamilyCreate) => Promise<void>;
  updateFamily: (data: FamilyUpdate) => Promise<void>;
  deleteFamily: () => Promise<void>;
}


export const FamilyContext = createContext<FamilyContextType | undefined>(undefined);


export const FamilyProvider = ({ children }: { children: ReactNode }) => {
  const [currentFamily, setCurrentFamily] = useState<FamilyOut | null>(null);
  const [members, setMembers] = useState<UserOut[]>([]);
  const [locations, setLocations] = useState<LocationOut[]>([]);

  const selectFamily = async (data: FamilyOut) => {
    setCurrentFamily(data);
    return true;
  };

  useEffect(() => {
    if (!currentFamily) return;
    Promise.all([fetchLocations(), fetchMembers()]);
  }, [currentFamily]);

  const fetchMembers = useCallback(async () => {
    if (!currentFamily) {
      setMembers([]);
      return true;
    }
    try {
      const membersData = await getFamilyMembers(currentFamily.id);
      setMembers(membersData);
      return true;
    } catch (error) {
      console.error('Failed to get family members', error);
      return false;
    }
  }, [currentFamily]);

  const fetchLocations = useCallback(async () => {
    if (!currentFamily) {
      setLocations([]);
      return true;
    }
    try {
      const locationsData = await getFamilyLocations(currentFamily.id);
      setLocations(locationsData);
      // console.log(locationsData);
      return true;
    } catch (error) {
      console.error('Failed to get family locations', error);
      return false;
    }
  }, [currentFamily]);

  const createFamilyHandler = async (data: FamilyCreate) => {
    try {
      const newFamily = await createFamily(data);
      setCurrentFamily(newFamily);
    } catch (error) {
      console.error("❌ 创建家庭失败:", error);
    }
  };

  const updateFamilyHandler = async (data: FamilyUpdate) => {
    if (!currentFamily) return;

    try {
      const updatedFamily = await updateFamily(currentFamily.id, data);
      setCurrentFamily(updatedFamily);
    } catch (error) {
      console.error("❌ 更新家庭失败:", error);
    }
  };

  const deleteFamilyHandler = async () => {
    if (!currentFamily) return;
    try {
      await deleteFamily(currentFamily.id);
      setCurrentFamily(null);
    } catch (error) {
      console.error("❌ 删除家庭失败:", error);
    }
  };


  return (
    <FamilyContext.Provider
      value={{
        currentFamily: currentFamily,
        members: members,
        locations: locations,
        selectFamily: selectFamily,
        fetchMembers: fetchMembers,
        fetchLocations: fetchLocations,
        createFamily: createFamilyHandler,
        updateFamily: updateFamilyHandler,
        deleteFamily: deleteFamilyHandler
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};
