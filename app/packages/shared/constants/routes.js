import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BadgesScreen from '../screens/BadgesScreen';

const routes = {
    Home: {
        screen: HomeScreen,
        path: "/"
    },
    Login: {
        screen: LoginScreen,
        path: "/login"
    },
    SignUp: {
        screen: SignUpScreen,
        path: "/sign-up"
    },
    Badges: {
        screen: BadgesScreen,
        path: "/badges"
    }
};

export const initialRouteName = {
    initialRouteName: 'Home',
};

export default routes;