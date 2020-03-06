/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    TRIGGER_RELOAD
} from '../actions/mapcatalog';

import { set } from '../utils/ImmutableUtils';

export default (state = {}, action) => {
    switch (action.type) {
    case TRIGGER_RELOAD: {
        return set('triggerReloadValue', !(state.triggerReloadValue || false), state);
    }
    default:
        return state;
    }
};
