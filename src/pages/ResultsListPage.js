/* @flow */

"use strict";

import React from 'react';
import Router from "react-router";
import mui from "material-ui";

import BaseResultsPage from "./BaseResultsPage";
import ResultListItem from '../components/ResultListItem';
import components from '../components';
import icons from '../icons';

class ResultsListPage extends BaseResultsPage {
    render(): React.Element {
        return (
            <div className="ResultsListPage">
                <components.AppBar
                    title={this.title}
                    onBackTouchTap={this.goBack.bind(this)}
                />

                <components.HeaderBar
                    primaryText={
                        this.state.meta ?
                            <div>
                                I found {this.state.meta.total_count}{' '}
                                {this.title.toLocaleLowerCase()}{' '}
                                services for{' '}
                                {this.state.meta.location.name},{' '}
                                {this.state.meta.location.state}.
                                <icons.LogoLight />
                            </div>
                        :
                            <div>Searching...</div>
                    }
                    secondaryText={
                        <div>
                            <Router.Link
                                to={`${this.getPath()}/personalise/summary`}
                            >Change what you need</Router.Link>
                         </div>
                    }
                />

                {this.state.error ?
                    <div>
                        {this.state.error}
                    </div>
                : ''
                }

                {this.renderResults()}

                {this.state.meta || this.state.error ?
                    ''
                :
                    <div className="progress">
                        <mui.CircularProgress mode="indeterminate" />
                    </div>
                }

            </div>
        );
    }

    renderResults(): React.Element {

        return (
            <mui.List className="List results">
            {
                this.state.objects ?
                    <mui.ListItem
                        className="ViewOnMap"
                        primaryText="View on a map"
                        containerElement={
                            <Router.Link
                                to={this.getPathname() + '/map'}
                            />
                        }
                        leftIcon={
                            <icons.Map />
                        }
                        rightIcon={
                            <icons.Chevron />
                        }
                        disableFocusRipple={true}
                        disableTouchRipple={true}
                    />
                :
                    ''
            }
            {
                this.results.map((object, index) =>
                    object.infobox ?
                        <div key={index}>
                            {React.addons.cloneWithProps(object.node)}
                        </div>
                    :
                        <ResultListItem object={object} key={index} />
                )
            }
            {
                this.state.meta && this.state.meta.next ?
                    <mui.ListItem
                        primaryText="Get more results"
                        onTouchTap={this.loadMore.bind(this)}

                        disableFocusRipple={true}
                        disableTouchRipple={true}
                    />
                :
                    ''
            }
            </mui.List>
        );
    }

}

export default ResultsListPage;
