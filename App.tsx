import { StatusBar } from 'expo-status-bar';
import SignUpScreen from './src/screens/Auth/SignUpScreen';

export default function App() {
  return (
    <>
      <SignUpScreen />
      <StatusBar style="auto" />
    </>
  );
}
