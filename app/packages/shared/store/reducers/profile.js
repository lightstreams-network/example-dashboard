import React from "react";
import { LOAD_PROFILE_ITEMS, LOAD_PROFILE_PICTURE, LOAD_USER_PROFILE } from '../actions/profile'
import { LOGOUT_ACTION } from "../actions/session";

const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
    switch ( action.type ) {
        case LOAD_USER_PROFILE: {
            return { ...state, [action.payload.username]: action.payload.data };
        }
        case LOGOUT_ACTION:
            return INITIAL_STATE;
        default:
            return state
    }
};