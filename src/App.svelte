<script lang="ts">
    import WebViewer, {getInstance, WebViewerInstance} from "@pdftron/webviewer";
    import {afterUpdate, onMount} from "svelte";
    import {LICENSE_KEY} from "../env";

    interface PdfTronEventDetail {
        message: string;
    }

    interface DocumentItem {
        downloadLink: string;
        fileName: string;
    }

    let documentItem: DocumentItem;
    let webViewerInstance: WebViewerInstance;

    const documentItems: DocumentItem[] = [
        {
            downloadLink: '/files/sample-file-0.pdf',
            fileName: 'Sample Local File 0'
        },
        {
            downloadLink: '/files/sample-file-1.pdf',
            fileName: 'Sample Local File 1'
        }
    ]

    const docElementId = 'document-viewer';

    const elementsToHide: string[] = [
        'downloadButton',
        'ribbons',
        'thumbDelete',
        'leftPanelTabs',
        'thumbRotateCounterClockwise',
        'thumbRotateClockwise',
        'documentControl',
        'toggleNotesButton',
        'downloadButton',
        'header',
        'toolsHeader',
        'textPopup'
    ];

    afterUpdate(() => {
        if (documentItem) {
            console.log('... started');
            setTimeout(() => {
                console.log('... loading');
                webViewerInstance?.loadDocument(documentItem.downloadLink, {
                    filename: documentItem.fileName,
                });
            }, 1000);
        }
    });

    onMount(() => {
        WebViewer({
            path: 'pdf',
            preloadWorker: 'all',
            fullAPI: true,
            ui: 'default',
            useDownloader: false,
            licenseKey: LICENSE_KEY,
            disabledElements: elementsToHide
        }, document.getElementById(docElementId) as HTMLElement)
            .then((instance: WebViewerInstance) => {
                webViewerInstance = instance;
                webViewerInstance.iframeWindow.addEventListener('loaderror', (err) => {
                    const error = err as CustomEvent<PdfTronEventDetail>;
                    if (error.detail.message?.indexOf('File is not a valid zip archive') > -1) {
                        webViewerInstance.showErrorMessage('Unable to open this file. Please make sure it is not password protected.');
                    }
                });
                webViewerInstance.setPrintQuality(4);
            })
            .catch((error: Error) => {
                console.log(`message: Something went wrong on starting the pdf creator`, error);
                throw error;
            });
    });
</script>

<h1>App.svelte</h1>

{#each documentItems as doc}
    <button on:click={() => documentItem = doc}>{doc.fileName}</button>
{/each}

<div class="document-info">
    Document: {documentItem ? documentItem.fileName : 'No Document Selected'}<br/>
    Document URL: {documentItem ? documentItem.downloadLink : 'No Document Selected'}<br/>
</div>

<div id={docElementId} style="height: 64vh;"></div>

<style lang="css">
    .document-info {
        padding: 20px 0;
    }
</style>