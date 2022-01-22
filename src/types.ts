/* eslint-disable max-len */
export type PrintTypes = 'pdf' | 'html' | 'image' | 'json' | 'raw-html';

interface DefaultConfig {
  /** Printable type. Available print options are: pdf, html, image, json and raw-html. */
  type?: PrintTypes;
  /** When printing html, image or json, this will be shown as the document title. */
  documentTitle?: string;
  /**
   * Optional header to be used with HTML, Image or JSON printing.
   * It will be placed on the top of the page. This property will accept text or raw HTML.
   * */
  header?: string;
  /** Optional header style to be applied to the header text. */
  headerStyle?: string;
  /** The id attribute of the frame. */
  frameId?: string;
  /**
   * This allow us to pass one or more css files URLs that should be applied to the html being printed.
   * Value can be a string with a single URL or an array with multiple URLs.
   */
  css?: string | string[];
  /** This allow us to pass a string with custom style that should be applied to the html being printed */
  style?: string;
  /** Fucntion executed when an error occurs during printing */
  onError?: (error: string, xmlHttpRequest?: XMLHttpRequest) => void;
  /** Function executed when PDF is being loaded */
  onLoadingStart?: () => void;
  /** Function executed when PDF is finished loading */
  onLoadingEnd?: () => void;
  /** Function executed once the browser print dialog is closed. */
  onPrintDialogClose?: () => void;
  /**
   * When printing pdf, if the browser is not compatible (check browser compatibility table),
   * the library will open the pdf in a new tab.
   * This allow you to pass a different pdf document to be opened instead of the original passed in `printable`.
   * This may be useful if you inject javascript in your alternate pdf file.
  */
  onIncompatibleBrowser?: () => void;
}

export interface PdfConfig extends DefaultConfig {
  type: 'pdf';
  /** Document source: pdf */
  printable: string;
  /**
   * When printing pdf, if the browser is not compatible (check browser compatibility table),
   * the library will open the pdf in a new tab.
   * This allow you to pass a different pdf document to be opened instead of the original passed in `printable`.
   * This may be useful if you inject javascript in your alternate pdf file.
   */
  fallbackPrintable?: string;
  /** If the PDF document is passed as base64 data */
  base64?: boolean;
}
export interface ImageConfig extends DefaultConfig {
  type: 'image';
  /** Document source: image(s) */
  printable: string | string[];
}

export interface HtmlConfig extends DefaultConfig {
  type: 'html';
  /** Document source: html */
  printable: string;
  /**
   * By default, the library process some styles only, when printing HTML elements.
   * This option allows you to pass an array of styles that you want to be processed.
   * Ex.: ['padding-top', 'border-bottom']
   */
  targetStyle?: string | string[];
  /**
   * Same as `targetStyle`, however, this will process any a range of styles.
   * Ex.: ['border', 'padding'], will include 'border-bottom', 'border-top', 'border-left', 'border-right', 'padding-top', etc.
   * You can also pass ['*'] to process all styles. */
  targetStyles?: string | string[];
  /** Accepts an array of html ids that should be ignored when printing a parent html element. */
  ignoreElements?: string | string[];
  /**
   * When set to false, the library will not process styles applied to the html being printed.
   * Useful when using the css parameter.
   */
  scanStyles?: boolean;
}
export interface RawHtmlConfig extends DefaultConfig {
  type: 'raw-html';
  /** Document source: raw-html */
  printable: string;
}

type Property = { field: string; displayName: string; columnSize?: string }
export interface JsonConfig extends DefaultConfig {
  type: 'json';
  /** Json object can be anything */
  printable: any[];
  /** These are the object property names. */
  properties?: string[] | Property[];
  /** When set to false, the data table header will show in first page only. */
  repeatTableHeader?: boolean;
  /** Optional style for the grid header when printing JSON data. */
  gridHeaderStyle?: string;
  /** Optional style for the grid rows when printing JSON data. */
  gridStyle?: string;
}

export type Config = PdfConfig | HtmlConfig | RawHtmlConfig | ImageConfig | JsonConfig
export interface BaseConfig extends DefaultConfig {
  /** The id attribute of the frame. default: prntr */
  frameId: string;
}

export type ExtendedConfig = Config & BaseConfig
