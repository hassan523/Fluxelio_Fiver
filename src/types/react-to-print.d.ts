declare module 'react-to-print' {
  import { RefObject } from 'react';

  export interface PrintOptions {
    /** Print the component in landscape or portrait orientation */
    pageStyle?: string;
    /** Override the automatic calculation of the element to be printed */
    bodyClass?: string;
    /** Remove the empty space from the top and bottom of the page */
    copyStyles?: boolean;
    /** Callback function executed when the printing window is closed */
    onAfterPrint?: () => void;
    /** Callback function executed before opening the printing window */
    onBeforeGetContent?: () => Promise<void> | void;
    /** Callback function executed before printing starts */
    onBeforePrint?: () => void;
    /** Callback function executed if printing is failed */
    onPrintError?: (errorLocation: string, error: Error) => void;
    /** Set the name of the document when printing */
    documentTitle?: string;
    /** Callback function to render a footer for each printed page */
    footer?: () => React.ReactNode;
    /** Callback function to render a header for each printed page */
    header?: () => React.ReactNode;
    /** Print only the specified content in the component */
    content?: () => React.ReactNode;
    /** Suppress the default print dialog on the page */
    suppressErrors?: boolean;
    /** Remove IFrames in the component when printing */
    removeAfterPrint?: boolean;
    /** Print using a new tab instead of an iframe */
    print?: boolean;
  }

  /**
   * A custom hook to trigger the print function of a class component that you want to print
   */
  export function useReactToPrint(options: {
    content?: () => React.ReactInstance | null;
    documentTitle?: string;
    onAfterPrint?: () => void;
    onBeforeGetContent?: () => Promise<void> | void;
    onBeforePrint?: () => void;
    onPrintError?: (errorLocation: string, error: Error) => void;
    pageStyle?: string;
    removeAfterPrint?: boolean;
    suppressErrors?: boolean;
    trigger?: () => void;
    print?: boolean;
    bodyClass?: string;
    copyStyles?: boolean;
    footer?: () => React.ReactNode;
    header?: () => React.ReactNode;
  }): () => void;

  export default useReactToPrint;
} 