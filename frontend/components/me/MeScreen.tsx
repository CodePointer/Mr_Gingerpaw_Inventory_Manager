// components/me/MeScreen.tsx
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  UserInfoCard, FamilyCard,
  AccountSettings, LogoutButton
} from "./index";
import { MembershipProvider } from "@/hooks";
import { Layout, Colors } from "@/styles";

export default function MeScreen() {
  return (
    <ScrollView style={Layout.container}>
      
      <UserInfoCard />
      
      <FamilyCard />
      
      <AccountSettings />
      
      <LogoutButton />
      
    </ScrollView>
  );
}

