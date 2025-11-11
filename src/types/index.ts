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

export type {
  AccessRecord,
  AccessFilter,
  AccessStats,
  AccessLogEntry,
  AccessStatus,
  AccessType,
} from './access';

export {
  isAccessRecord,
  isAccessRecordArray,
} from './access';

export type {
  User,
  UserRole,
  UserStatus,
  UserFormData,
  UserFormErrors,
  AuthCredentials,
  AuthResponse,
  AuthState,
  UserFilter,
  Permission,
} from './user';

export {
  isUser,
  isUserArray,
  hasPermission,
  hasRole,
  ROLE_PERMISSIONS,
  ROLE_LABELS,
  STATUS_LABELS,
} from './user';
