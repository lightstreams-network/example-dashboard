import React from "react";
import { PURCHASE_CONTENT, LOAD_ARTIST_PROFILE, LOAD_ARTIST_EXCLUSIVE_CONTENT } from '../actions/artist'

const INITIAL_STATE = {
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOAD_ARTIST_PROFILE: {
            return { ...state, ...action.payload};
        }
        case LOAD_ARTIST_EXCLUSIVE_CONTENT: {
            return { ...state, exclusive_content: action.payload};
        }
        case PURCHASE_CONTENT:
            return state;
        default:
            return state
    }
};