/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DefaultViewer from './viewers/DefaultViewer';
import editors from './editors';

export default ({
    editing,
    editor = 'DraftJSEditor',
    className = '',
    detailsText,
    editorProps = {}
}) => {
    const EditorComponent = editors[editor].editor;

    const detailsViewer = (<DefaultViewer
        detailsText={detailsText}/>);
    const detailsEditor = (<EditorComponent
        detailsText={detailsText}
        {...editorProps}/>);

    return (
        <div className={`ms-details-component${className ? ` ${className}` : ''}`}>
            {editing ? detailsEditor : detailsViewer}
        </div>
    );
};
