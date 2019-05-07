import Palette from "./Palette";

export default {
    rootContainer: {
        alignContent: 'center',
        backgroundColor: Palette.BrokenWhite,
        alignItems: 'center',
        position: 'relative',
        minHeight: '100%'
    },
    mainContainer: {
        alignContent: 'center',
        position: 'relative',
        width: '100%',
        marginBottom: 50,
        maxWidth: 980,
    },
    topBar: {
        backgroundColor: Palette.DarkBlue,
        height: 35,
        width: '100%',
    },
    bottomBar: {
        backgroundColor: Palette.DarkGray,
        width: '100%',
        paddingTop: 2,
        paddingBottom: 2,
        position: 'absolute',
        left: 0,
        right: 0,
        height: 30,
        bottom: 0,
    },
    barRightBadge: {
        marginRight: 10,
        order: 1
    },
    barLeftBadge: {
        marginRight: 10,
        order: 3
    },
    headerText: {
        color: Palette.BrokenWhite,
        fontWeight: '500',
    },
    footerText: {
        color: Palette.BrokenWhite,
        fontWeight: '500'
    },
    overlay: {
        zIndex: 10,
        position: 'absolute',
        top: 0,
        left: 0,
    }
}