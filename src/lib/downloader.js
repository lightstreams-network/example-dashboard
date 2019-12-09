import { ext2MIME } from './ext2MIME';

export const downloadFile = (data, filename, fileType = null) => {
    const mime = fileType || ext2MIME(filename.split('.').pop());
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    const blob = new Blob([data], { type: mime || 'application/octet-stream' });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename);
        return;
    }

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(blobURL);
    }, 100);
};