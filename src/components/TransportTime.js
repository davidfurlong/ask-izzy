/* @flow */

import React from "react";
import { titleize } from "underscore.string";

import fixtures from "../../fixtures/services";
import icons from "../icons";

class TransportTime extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        point: React.PropTypes.object,
        suburb: React.PropTypes.string.isRequired,
    };

    // flow:disable not supported yet
    static sampleProps = {default: fixtures.ixa.location};

    render(): ReactElement {
        if (this.props.point) {
            return (
                <div className="TransportTime">
                    <icons.Walk className="ColoredIcon brand-text-dark" />
                    <span className="time">? mins</span>&nbsp;
                    <span className="location">
                        {titleize(this.props.suburb)}
                    </span>
                </div>
            );
        } else {
            /* This is a confidential location, we can't show any
             * transport time*/
            return (
                <div className="TransportTime">
                    <icons.Phone className="ColoredIcon brand-text-dark" />
                    <span className="time">Confidential location</span>&nbsp;
                    <span className="location">
                        {titleize(this.props.suburb)}
                    </span>
                </div>
            );
        }
    }
}

export default TransportTime;
