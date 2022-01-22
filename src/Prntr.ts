import { html } from './html';
import { json } from './json';
import { pdf } from './pdf';
import { rawHtml } from './raw-html';
import { Config, Params, PrintTypes } from './types';
import Browser from './utils/browser';

export type PrntrArguments = [config: string | Config, type?: PrintTypes]

class Prntr {
  private printTypes: string[] = ['pdf', 'html', 'image', 'json', 'raw-html'];
  private params: Params = {
    printable: '',
    // printableElement: undefined,
    fallbackPrintable: undefined,
    type: 'pdf',
    documentTitle: 'Document',
    header: undefined,
    headerStyle: 'font-weight: 300;',
    // maxWidth: 800,
    properties: undefined,
    targetStyle: ['clear', 'display', 'width', 'min-width', 'height', 'min-height', 'max-height'],
    targetStyles: ['border', 'box', 'break', 'text-decoration'],
    gridHeaderStyle: 'font-weight: bold; padding: 5px; border: 1px solid #dddddd;',
    gridStyle: 'border: 1px solid lightgray; margin-bottom: -1px;',
    frameId: 'prntr',
    ignoreElements: [],
    repeatTableHeader: true,
    onError: (error: string) => { throw new Error(error); },
    onLoadingStart: undefined,
    onLoadingEnd: undefined,
    onPrintDialogClose: undefined,
    onIncompatibleBrowser: undefined,
    css: undefined,
    style: undefined,
    scanStyles: true,
    base64: false,
  };

  // Deprecated
  // onPdfOpen: undefined
  // font: 'TimesNewRoman'
  // font_size: '12pt'
  // honorMarginPadding: true
  // honorColor: false
  // imageStyle: 'max-width: 100%;'

  constructor(...params: PrntrArguments) {
    // Check if a printable document or object was supplied
    const args = params[0];
    if (!args) {
      throw new Error('prntr expects at least 1 attribute.');
    }

    // Process parameters
    this.processParams(args, params[1]);

    // Start
    this.start();
  }

  private processParams(args: PrntrArguments[0], type?: PrntrArguments[1]) {
    switch (typeof args) {
      case 'string':
        this.params.printable = encodeURI(args);
        this.params.fallbackPrintable = this.params.printable;
        this.params.type = type || this.params.type;
        break;
      case 'object':
        if (args.printable) this.params.printable = args.printable;
        this.params.fallbackPrintable = typeof args.fallbackPrintable !== 'undefined'
          ? args.fallbackPrintable
          : this.params.printable;
        this.params.fallbackPrintable = this.params.base64
          ? `data:application/pdf;base64,${this.params.fallbackPrintable}`
          : this.params.fallbackPrintable;

        Object.keys(this.params).reduce((all, k) => {
          if (k === 'printable' || k === 'fallbackPrintable') return all;
          // @ts-ignore
          if (typeof args[k as keyof Config] !== 'undefined') all[k] = args[k as keyof Config];
          return all;
        }, this.params);

        break;
      default:
        throw new Error('Unexpected argument type! Expected "string" or "object", got ' + typeof args);
    }

    // Validate printable
    if (!this.params.printable) {
      throw new Error('Missing printable information.');
    }

    // Validate type
    if (
      !this.params.type ||
      typeof this.params.type !== 'string' ||
      this.printTypes.indexOf(this.params.type.toLowerCase()) === -1
    ) {
      throw new Error('Invalid print type. Available types are: pdf, html, image and json.');
    }
  }

  private getPrintFrame() {
    const { frameId, type, documentTitle, css } = this.params;

    // Create a new iframe for the print job
    const printFrame = document.createElement('iframe');

    // Set iframe element id
    printFrame.setAttribute('id', frameId);

    // FIXME
    if (Browser.isFirefox()) {
      // Set the iframe to be is visible on the page (guaranteed by fixed position) but hidden using opacity 0, because
      // this works in Firefox. The height needs to be sufficient for some part of the document other than the PDF
      // viewer's toolbar to be visible in the page
      // eslint-disable-next-line max-len
      printFrame.setAttribute('style', 'width: 1px; height: 100px; position: fixed; left: 0; top: 0; opacity: 0; border-width: 0; margin: 0; padding: 0');
    } else {
      // Hide the iframe in other browsers
      printFrame.setAttribute('style', 'visibility: hidden; height: 0; width: 0; position: absolute; border: 0');
    }

    // For non pdf printing, pass an html document string to srcdoc (force onload callback)
    if (type !== 'pdf') {
      printFrame.srcdoc = '<html><head><title>' + documentTitle + '</title>';

      // Attach css files
      if (css) {
        const styles: string[] = !Array.isArray(css) ? [css] : css;

        // Create link tags for each css file
        styles.forEach(file => {
          printFrame.srcdoc += '<link rel="stylesheet" href="' + file + '">';
        });
      }

      printFrame.srcdoc += '</head><body></body></html>';
    }
    return printFrame;
  }

  private start() {
    const {
      frameId,
      type,
      fallbackPrintable,
      onIncompatibleBrowser,
      onError,
      onLoadingStart,
      onLoadingEnd,
    } = this.params;

    // Check for a print start hook function
    onLoadingStart?.();

    // To prevent duplication and issues, remove any used printFrame from the DOM
    const usedFrame = document.getElementById(frameId);

    if (usedFrame) usedFrame?.parentNode?.removeChild(usedFrame);

    // Create a new iframe for the print job
    const printFrame = this.getPrintFrame();

    // Check printable type
    switch (type) {
      case 'pdf':
        // Check browser support for pdf and if not supported we will just open the pdf file instead
        if (Browser.isIE()) {
          try {
            console.info('Prntr doesn\'t support PDF printing in Internet Explorer.');
            if (!fallbackPrintable) throw new Error('Prntr can not print fallbackPrintable');
            const win = window.open(fallbackPrintable, '_blank');
            win?.focus();
            onIncompatibleBrowser?.();
          } catch (error: any) {
            onError?.(error);
          } finally {
            onLoadingEnd?.();
          }
        } else {
          pdf(this.params, printFrame);
        }
        break;
      // case 'image':
      //   Image.print(this.params, printFrame);
      //   break;
      case 'html':
        html(this.params, printFrame);
        break;
      case 'raw-html':
        rawHtml(this.params, printFrame);
        break;
      case 'json':
        json(this.params, printFrame);
        break;
    }
  }
}
export default Prntr;
