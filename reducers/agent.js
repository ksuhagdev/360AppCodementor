import {
  AGENT_PROFILE,
  AGENT_PROFILE_IS_LOADING,
  AGENT_PROFILE_IS_UPDATING,
  AGENT_DRAFT_PROPERTIES,
  AGENT_LIVE_PROPERTIES,
  CLEAR_AGENT_DRAFT_PROPERTIES,
  CLEAR_AGENT_LIVE_PROPERTIES,
  AGENT_LIVE_PROPERTIES_LOADING,
  AGENT_DRAFT_PROPERTIES_LOADING,
  MUSIC_FILES
} from '../store/types';

const initialState = {
  agentProfile: undefined,
  isProfileLoading: false,
  updatePayload: null,
  isProfileUpdating: false,
  agentLiveProperties: [],
  agentDraftProperties: [],
  musicFiles: [],
  isLoadingLiveProperties: false,
  isLoadingDraftProperties: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case AGENT_PROFILE: {
      return {
        ...state,
        agentProfile: action.payload,
      };
    }

    case AGENT_PROFILE_IS_LOADING:
      return {
        ...state,
        isProfileLoading: action.payload,
      };

    case AGENT_PROFILE_IS_UPDATING:
      return {
        ...state,
        isProfileUpdating: action.payload,
      };

    case AGENT_LIVE_PROPERTIES:
      return {
        ...state,
        agentLiveProperties: action.payload,
      };

    case AGENT_DRAFT_PROPERTIES:
      return {
        ...state,
        agentDraftProperties: action.payload,
      };

    case CLEAR_AGENT_LIVE_PROPERTIES:
      return {
        ...state,
        agentLiveProperties: [],
      };

    case CLEAR_AGENT_DRAFT_PROPERTIES:
      return {
        ...state,
        agentDraftProperties: [],
      };

    case AGENT_LIVE_PROPERTIES_LOADING:
      return {
        ...state,
        isLoadingLiveProperties: action.payload,
      };

    case AGENT_DRAFT_PROPERTIES_LOADING:
      return {
        ...state,
        isLoadingDraftProperties: action.payload,
      };
    case MUSIC_FILES:
      return {
        ...state,
        musicFiles: action.payload
      }

    default:
      return state;
  }
}

export const getMusicFiles = state => state.musicFiles;