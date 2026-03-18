import { 
  MD3LightTheme, 
  MD3DarkTheme, 
  type MD3Theme 
} from 'react-native-paper';


export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
  }
}


export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
  }
}


export const selectedTheme = darkTheme;
