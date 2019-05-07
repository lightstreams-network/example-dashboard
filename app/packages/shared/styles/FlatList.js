import palette from './Palette';

const cardCommonStyle = {
    shadowColor: '#00000021',
    shadowOffset: {
        width: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginVertical: 8,
    marginHorizontal: 4,
    backgroundColor: "white",
    width: 150,
};


export default {
    container: {
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    separator: {
        marginTop: 10,
    },
    /******** card **************/
    card: {
        ...cardCommonStyle,
        shadowColor: "#9a9a9a",
        shadowOffset: { wigdth: 0, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 2
    },
    cardAndroid: {
        ...cardCommonStyle,
        elevation: 2
    },
    cardHeader: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    cardContent: {
        paddingVertical: 12.5,
        paddingHorizontal: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12.5,
        paddingBottom: 25,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,
    },
    cardImage: {
        flex: 1,
        height: 80,
        width: null,
    },
    /******** card components **************/
    title: {
        fontSize: 14,
        flex: 1,
        fontWeight: '400',
        color: palette.DarkGray,
    },
    price: {
        fontSize: 14,
        color: palette.GoldenYellow,
        fontWeight: '600',
    },
    buyNow: {
        color: palette.DarkGray,
        fontWeight: '300'
    },
    downloadNow: {
        color: palette.DarkGray,
        fontWeight: '300'
    },
    cardIcon: {
        width: 30,
        height: 30,
    },
    /******** social bar ******************/
    cardBottomContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        flex: 2
    },
    cardBottomSection: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexBasis: '50%'
    },
    cardSectionLabel: {
        marginRight: 8,
        alignSelf: 'flex-end',
        justifyContent: 'center',
    },
    socialBarButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
};