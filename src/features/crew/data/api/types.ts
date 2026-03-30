import type {
  ApiResponse,
  CrewRequestResponseStatus,
  CrewRequestItem,
  CrewRequestStatusData,
  CrewUserSummary,
} from '@/shared/types';

export type {
  ApiResponse,
  CrewRequestResponseStatus,
  CrewRequestItem,
  CrewRequestStatusData,
  CrewUserSummary,
};

export interface PaginatedItems<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SendCrewRequestPayload {
  receiverId: string;
}

export interface RespondToCrewRequestPayload {
  status: CrewRequestResponseStatus;
}

export interface CrewActionMessage {
  message: string;
}

export type CrewMembersResponse = ApiResponse<PaginatedItems<CrewUserSummary>>;
export type CrewRequestsResponse = ApiResponse<PaginatedItems<CrewRequestItem>>;
export type CrewSuggestionsResponse = ApiResponse<PaginatedItems<CrewUserSummary>>;
export type CrewSearchResponse = ApiResponse<PaginatedItems<CrewUserSummary>>;
export type CrewRequestStatusResponse = ApiResponse<CrewRequestStatusData>;
export type SendCrewRequestResponse = ApiResponse<CrewRequestItem>;
export type RespondToCrewRequestResponse = ApiResponse<CrewActionMessage>;
