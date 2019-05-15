import React from "react";
import { LOAD_PROFILE_ITEMS, LOAD_PROFILE_PICTURE } from '../actions/profile'

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
        default:
            return state
    }
};