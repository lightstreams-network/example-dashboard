import Palette from "./Palette";

export default {
    wrapperArtistProfile: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20
    },
    avatar: {
        width: 150,
        height: 150,
    },
    usernameLabel: {
        fontSize: 18,
        textAlign: 'center',
        color: Palette.DarkGray,
        fontWeight: '800',
    },
    walletBox: {
        width: 150,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 12,
        elevation: 4,
    },
    walletIcon: {
        width: 60,
        height: 60,
    },
    walletText: {
        fontSize: 22,
        color: "#696969",
    },
    primaryButton: {
        backgroundColor: Palette.DarkBlue,
        padding: 5,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 25
    }
}