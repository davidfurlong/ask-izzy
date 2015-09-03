/* @flow */

"use strict";

import React from 'react';
import Router from "react-router";
import mui from "material-ui";
import reactMixin from "react-mixin";

import Personalisation from '../../mixins/Personalisation';
import components from '../../components';
import icons from '../../icons';
import * as iss from '../../iss';

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
/*::`*/@reactMixin.decorate(Router.State)/*::`;*/
/*::`*/@reactMixin.decorate(Personalisation)/*::`;*/
class LocationPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
        };
    }

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        return request;
    }

    onTouchDoneButton(event: Event): void {
        event.preventDefault();
        this.nextStep();
    }

    componentDidMount(): void {
    }

    render(): React.Element {
        return (
            <div>
                <components.HeaderBar
                    primaryText={
                        <div>
                            <icons.LogoLight className="Logo" />
                            These services can help you
                            {' '}
                            {this.context.controller.category.byline
                                .toLocaleLowerCase()}.
                        </div>
                    }
                    secondaryText={
                        <div>
                            I'll ask you a few questions to help you you
                            find the right places.
                        </div>
                    }
                />
                <div className="padded">
                    All of your answers are private and anonymous and are
                    never stored anywhere. When you close I will forget them.
                </div>

                <div className="done-button">
                    <mui.FlatButton
                        label="Okay"
                        onTouchTap={this.onTouchDoneButton.bind(this)}
                    />
                </div>

            </div>
        );
    }

}

export default LocationPage;
