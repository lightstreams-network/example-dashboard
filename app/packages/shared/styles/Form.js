import palette from './Palette';

const inputContainer = {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 445,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
};

const inputContainerError = {
    ...inputContainer,
    backgroundColor: '#FFCCCC',
    borderBottomWidth: 0,
};

const styles = {
    inputContainer,
    inputContainerError,
    text: {
        height: 43,
        marginLeft: 16,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        paddingLeft: 10,
        width: 150,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    textIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center'
    },
    buttonItem: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 300,
        borderRadius: 30,
    }
};

export default styles;