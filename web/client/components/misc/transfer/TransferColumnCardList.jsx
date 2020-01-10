/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import React from 'react';

import SideCard from '../cardgrids/SideCard';
import Toolbar from '../toolbar/Toolbar';
import emptyState from '../enhancers/emptyState';

const TransferColumnCardList = ({
    items = [],
    side,
    selectedItems = [],
    selectedSide,
    allowCtrlMultiSelect = false,
    onSelect = () => {},
    isRoot = true
}) => (
    <div className="ms2-transfer-sidegrid">
        {items.map((item, idx) => {
            const isSelected = item.id && selectedItems.reduce((result, selectedItem) => result || selectedItem.id === item.id, false);
            return (<SideCard
                {...item}
                key={item.id || idx}
                size="sm"
                className={(item.className ? `${item.className} ` : ' ') + (idx === items.length - 1 ? 'ms2-transfer-lastcard' : '')}
                selected={isSelected}
                onClick={(_, event) => isRoot ? onSelect(isSelected ?
                    selectedItems.filter(selectedItem => selectedItem.id !== item.id) :
                    allowCtrlMultiSelect && event.ctrlKey && side === selectedSide ?
                        [...selectedItems, item] :
                        [item], side) : {}}
                tools={item.tools && <Toolbar
                    buttons={item.tools.map(tool => ({
                        ...tool,
                        className: 'square-button-md no-border',
                        onClick: (event) => {
                            event.stopPropagation();
                            if (tool.onClick) {
                                tool.onClick();
                            }
                        }
                    }))}/>
                }
                preview={item.preview}
                body={
                    <div className="ms2-transfer-body-container">
                        {item.component && <div
                            className="ms2-transfer-bodycomponent-container"
                            onClick={event => event.stopPropagation()}>
                            {item.component}
                        </div>}
                        {item.children && <div
                            className="ms2-transfer-children-container">
                            <TransferColumnCardList
                                items={item.children}
                                side={side}
                                selectedItems={selectedItems}
                                selectedSide={selectedSide}
                                allowCtrlMultiSelect={allowCtrlMultiSelect}
                                onSelect={onSelect}
                                isRoot={false}/>
                        </div>}
                    </div>
                }/>);
        })}
    </div>
);

export default emptyState(({items = []}) => !items.length, ({emptyStateProps}) => emptyStateProps)(TransferColumnCardList);
