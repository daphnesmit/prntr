export type PrintTypes = 'pdf' | 'html' | 'image' | 'json' | 'raw-html';
export interface Config {
  printable: string | null; // FIXME
  fallbackPrintable?: string | null;
  type?: PrintTypes;
  documentTitle?: string;
  header?: undefined; // FIXME
  headerStyle?: string;
  maxWidth?: number;
  properties?: undefined; // FIXME
  targetStyle?: string | string[];
  targetStyles?: string | string[];
  gridHeaderStyle?: string;
  gridStyle?: string;
  frameId?: string;
  ignoreElements?: string | string[];
  repeatTableHeader?: boolean;
  css?: string | string[];
  style?: string;
  scanStyles?: boolean;
  base64?: boolean;
  onError?: (error: string, xmlHttpRequest?: XMLHttpRequest) => void;
  onLoadingStart?: () => void;
  onLoadingEnd?: () => void;
  onPrintDialogClose?: () => void;
  onIncompatibleBrowser?: () => void;

  // Deprecated
  onPdfOpen?: () => void;
  font?: string;
  font_size?: string;
  honorMarginPadding?: boolean;
  honorColor?: boolean;
  imageStyle?: string;
}
export interface Params extends Config {
  printable: string;
  // printableElement?: null
  type: PrintTypes;
  frameId: string;
}
