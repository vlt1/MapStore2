/**
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {get} from 'lodash';
import url from 'url';
const urlQuery = url.parse(window.location.href, true).query;

import {setCreationStep, clearContextCreator, loadContext} from '../../actions/contextcreator';
import Page from '../../containers/Page';
import BorderLayout from '../../components/layout/BorderLayout';

class ContextCreator extends React.Component {
    static propTypes = {
        mode: PropTypes.string,
        match: PropTypes.object,
        loadContext: PropTypes.func,
        setCreationStep: PropTypes.func,
        setSource: PropTypes.func,
        reset: PropTypes.func,
        plugins: PropTypes.object
    };

    static defaultProps = {
        name: "context-creator",
        mode: 'desktop',
        loadContext: () => {},
        editResource: () => {},
        setCreationStep: () => {},
        setSource: () => {},
        reset: () => {}
    };

    UNSAFE_componentWillMount() {
        const stepId = get(this.props, "match.params.stepId");
        const contextId = get(this.props, "match.params.contextId");
        this.props.reset();
        this.props.loadContext(contextId);
        this.props.setCreationStep(stepId);
    }
    componentDidUpdate(oldProps) {
        const stepId = get(this.props, "match.params.stepId");
        const contextId = get(this.props, "match.params.contextId");
        const oldStepId = get(oldProps, "match.params.stepId");
        const oldContextId = get(oldProps, "match.params.contextId");
        if (contextId !== oldContextId) {
            this.props.reset();
            this.props.loadContext(contextId);
            this.props.setCreationStep(stepId);
        }
        if (oldStepId !== stepId) {
            this.props.setCreationStep(stepId);
        }
    }
    componentWillUnmount() {
        this.props.reset();
    }
    render() {
        return (<Page
            id="context-creator"
            component={BorderLayout}
            includeCommon={false}
            plugins={this.props.plugins}
            params={this.props.match.params}
        />);
    }
}

export default connect((state) => ({
    mode: urlQuery.mobile || state.browser && state.browser.mobile ? 'mobile' : 'desktop'
}),
{
    setCreationStep,
    loadContext,
    reset: clearContextCreator
})(ContextCreator);
