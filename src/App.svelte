<script lang="ts">
    import WebViewer, {WebViewerInstance, WebViewerOptions} from "@pdftron/webviewer";

    interface PdfTronEventDetail {
        message: string;
    }

    interface DocumentItem {
        downloadLink: string;
        fileName: string;
    }

    let webViewerInitialized = false;
    let webViewerInstance: WebViewerInstance;
    let pdfTronVersion: string;
    let webViewerInitializing = false;

    let licenseValue = '';

    const documentItems: DocumentItem[] = [
        {
            downloadLink: 'https://joshtune.github.io/fv-doc-previewer/files/sample-file-0.pdf',
            fileName: 'File 1'
        },
        {
            downloadLink: 'https://joshtune.github.io/fv-doc-previewer/files/sample-file-1.pdf',
            fileName: 'File 2'
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

    const loadDocument = (documentItem: DocumentItem) => {
        console.log(`PDFTron (${pdfTronVersion}) -> loading document ... ${documentItem.downloadLink}`);

        setTimeout(() => {
            webViewerInstance.UI.loadDocument(documentItem.downloadLink, {
                filename: documentItem.fileName,
            });
        }, 1000);
    }

    const loadLicense = (): void => {
        if (licenseValue?.length) {
            webViewerInitializing = true;
            WebViewer({
                path: 'https://joshtune.github.io/fv-doc-previewer/pdf',
                preloadWorker: 'all',
                fullAPI: true,
                ui: 'default',
                useDownloader: false,
                licenseKey: licenseValue,
                disabledElements: elementsToHide
            } as WebViewerOptions, document.getElementById(docElementId) as HTMLElement)
                .then((instance: WebViewerInstance) => {
                    webViewerInstance = instance;

                    pdfTronVersion = webViewerInstance.Core.getVersion();

                    console.log(`PDFTron (${pdfTronVersion}) -> WebViewer Loaded`);

                    webViewerInstance.UI.iframeWindow.addEventListener('loaderror', (error:CustomEvent<PdfTronEventDetail>) => {
                        if (error.detail.message?.indexOf('File is not a valid zip archive') > -1) {
                            webViewerInstance.UI.showErrorMessage('Unable to open this file. Please make sure it is not password protected.');
                        }
                    });

                    webViewerInstance.UI.addEventListener('documentLoaded', () => {
                        console.log(`PDFTron (${pdfTronVersion}) -> document loaded`);
                        webViewerInstance.UI.setFitMode(webViewerInstance.UI.FitMode.FitWidth);
                        webViewerInstance.UI.setPrintQuality(4);
                    });

                    webViewerInitialized = true;
                    webViewerInitializing = false;
                })
                .catch((error: Error) => {
                    console.log(`message: Something went wrong on starting the pdf creator`, error);
                    throw error;
                });
        }
    };

</script>

<h1>App.svelte</h1>

{#if !webViewerInitialized}
    <textarea placeholder="PDFTron License" type="text"
              style="font-size: 20px; width: 100%; border: 1px solid #8fa5c7;"
              bind:value={licenseValue} disabled={webViewerInitialized} />
    <button on:click={loadLicense} disabled={!licenseValue?.length}>
        Initialize WebViewer
    </button>
    {#if webViewerInitializing}Initializing ...{/if}
    <hr />
{:else}
    <h4>App Initialized</h4>
    {#each documentItems as doc}
        <button on:click={() => loadDocument(doc)}>
            {doc.fileName}
        </button>
    {/each}
{/if}

<div id='document-viewer' style="height: 84vh;border: 1px solid #8fa5c7;"></div>
