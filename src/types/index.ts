/**
 * Central Type Exports
 * Re-exports all types from a single location for easier imports
 */

export type {
  Visitor,
  SearchResult,
  VisitorFormData,
  VisitorFormErrors,
  VisitorFormState,
  DocumentValidation,
  NameValidation,
} from './visitor';

export {
  isVisitor,
  isSearchResult,
  isVisitorFormData,
  isDocumentValidation,
  isNameValidation,
  isVisitorArray,
} from './visitor';
