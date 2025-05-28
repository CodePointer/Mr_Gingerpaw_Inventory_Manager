import { Redirect } from 'expo-router';
import { useEffect } from "react";


export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
