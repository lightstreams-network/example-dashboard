import React from "react";
import { LOAD_PROFILE_ITEMS, LOAD_PROFILE_PICTURE } from '../actions/profile'
import { LOGOUT_ACTION } from "../actions/session";

const INITIAL_STATE = {
    items: [],
    pendingRequests: [],
    picture: {}
};

export default function(state = INITIAL_STATE, action) {
    switch ( action.type ) {
        case LOAD_PROFILE_ITEMS: {
            return { ...state, items: action.payload };
        }
        case LOAD_PROFILE_PICTURE: {
            return { ...state, picture: action.payload };
        }
        case LOGOUT_ACTION:
            return INITIAL_STATE;
        default:
            return state
    }
};