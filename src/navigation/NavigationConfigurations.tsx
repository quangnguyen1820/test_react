import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationConstants } from "./NavigationConstants";
import LoginScreen from "../screens/login/LoginScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";


const Stack = createNativeStackNavigator();
export const RootStack = () => {
    return (
        <Stack.Navigator
            initialRouteName={NavigationConstants.LoginScreen}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name={NavigationConstants.LoginScreen}
                component={LoginScreen}
            />
            <Stack.Screen
                name={NavigationConstants.ProfileScreen}
                component={ProfileScreen}
            />
        </Stack.Navigator>
    )
}
