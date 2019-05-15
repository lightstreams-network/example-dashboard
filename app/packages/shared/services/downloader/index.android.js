import RNFetchBlob from 'react-native-fetch-blob';

export default class AndroidDownloader {
    static fetch(url, options) {
        RNFetchBlob
            .config({
                // add this option that makes response data to be stored as a file,
                // this is much more performance.
                fileCache: true,
            })
            .fetch('GET', url, options['headers'] || {})
            .then((res) => {
                // the temp file path
                console.log('The file saved to ', res.path())
            })
    }
}