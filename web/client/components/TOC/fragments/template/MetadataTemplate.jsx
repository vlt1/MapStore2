/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {Button, Glyphicon} = require('react-bootstrap');
const {keys, isArray, isObject} = require('lodash');
const Message = require('../../../I18N/Message');
const {Table} = require('react-bootstrap');

const LocaleUtils = require('../../../../utils/LocaleUtils');

class MetadataTemplate extends React.Component {
    static propTypes = {
        model: PropTypes.object
    };

    static contextTypes = {
        messages: PropTypes.object
    };

    static defaultProps = {
        model: {}
    };

    constructor(props) {
        super(props);
        this.state = {collapsed: {}};
    }

    renderMetadata = (data = {}, itemTitle, path = '') => {
        const collapsePanel = (id, value) => {
            this.setState({
                collapsed: {
                    ...this.state.collapsed,
                    [id]: value
                }
            });
        };
        const withCollapseButton = (content, id) => (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                {content}
                <Button
                    style={{margin: '4px 0 0 4px'}}
                    className="square-button-md no-border"
                    onClick={() => collapsePanel(id, !this.state.collapsed[id])}>
                    <Glyphicon glyph={this.state.collapsed[id] ? 'plus' : 'minus'}/>
                </Button>
            </div>
        );
        const itemPath = (srcPath, index) => `${srcPath}@item_${index}`;

        const renderedFields = keys(data).filter(key => key !== 'references').map(key => {
            const field = data[key];
            const fieldPath = `${path}.${key}`;
            let fieldContent;

            const rowWithTitleCell = (content) => (<tr>
                <td><Message msgId={`toc.layerMetadata.${key}`}/></td>
                <td>{content}</td>
            </tr>);
            const rowSimple = (content) => (<tr>
                <td colSpan="2">{content}</td>
            </tr>);

            if (isArray(field)) {
                if (!field.length) {
                    fieldContent = null;
                } else {
                    const messagesFieldItemTitle = LocaleUtils.getMessageById(this.context.messages, `toc.layerMetadata.itemTitles.${key}`);
                    const fieldItemTitle = !messagesFieldItemTitle ?
                        LocaleUtils.getMessageById(this.context.messages, 'toc.layerMetadata.itemTitles.default') :
                        messagesFieldItemTitle;
                    const renderedElements = field.map((fieldElement, i) => {
                        const subFieldPath = itemPath(fieldPath, i);
                        return isObject(fieldElement) ?
                            this.renderMetadata(
                                fieldElement,
                                field.length > 1 ?
                                    withCollapseButton(<h4>{`${fieldItemTitle} #${i + 1}`}</h4>, subFieldPath) :
                                    null,
                                subFieldPath
                            ) :
                            <li key={i}>{fieldElement}</li>;
                    });

                    fieldContent = isObject(field[0]) ?
                        rowSimple(
                            <div>
                                {withCollapseButton(<h4><Message msgId={`toc.layerMetadata.${key}`}/></h4>, fieldPath)}
                                {!this.state.collapsed[fieldPath] ? <div>{renderedElements}</div> : null}
                            </div>
                        ) :
                        rowWithTitleCell(<ul>{renderedElements}</ul>);
                }
            } else {
                const cellContent = key === 'URL' || key === 'electronicMailAddress' ?
                    <a target="_blank" rel="noopener noreferrer" href={key === 'URL' ? field : `mailto:${field}`}>{field}</a> :
                    field;

                fieldContent = rowWithTitleCell(cellContent);
            }

            return fieldContent;
        });

        return (
            <div style={path ? {padding: '8px'} : {}}>
                {itemTitle}
                {!this.state.collapsed[path] ? <Table>
                    <tbody>
                        {renderedFields}
                    </tbody>
                </Table> : null}
            </div>
        );
    }

    renderEmpty() {
        return (
            <div>
                <Message msgId="toc.layerMetadata.emptyMetadata"/>
            </div>
        );
    }

    render() {
        const model = this.props.model;
        return keys(model).length ? (<div style={{maxHeight: '400px', overflow: 'auto'}} id={model.identifier}>
            {this.renderMetadata(model)}
        </div>) : this.renderEmpty();
    }
}

module.exports = MetadataTemplate;
