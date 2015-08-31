/* @flow */

import React from "react";
import Router from "react-router";
import colors from "../constants/theme";
import fixtures from "../../fixtures/services";
import mui from "material-ui";
import reactMixin from "react-mixin";
import _ from "underscore";

import icons from "../icons";
import iss from '../iss';
import OpeningTimes from "./OpeningTimes";
import TransportTime from "./TransportTime";

var palette = colors.getPalette();

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
class ResultListItem extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            relatedServices: [],  // includes us, use this.relatedServices
        };
    }

    // flow:disable not supported yet
    static propTypes = {
        object: React.PropTypes.object.isRequired,
        nRelatedServices: React.PropTypes.number,
    };

    // flow:disable not supported yet
    static sampleProps = {object: fixtures.ixa};

    // flow:disable
    static defaultProps =  {
        nRelatedServices: 4,
    };

    /**
     * relatedServices:
     * A list of related services, limited to 4
     */
    /* flow:disable */
    get relatedServices(): Array<Object> {
        return this.state.relatedServices
            .slice(0, this.props.nMoreRelatedServices);
    }

    /**
     * nMoreRelatedServices:
     * The number of related services minus the 4 relatedServices.
     */
    /* flow:disable */
    get nMoreRelatedServices(): number {
        return Math.max(0,
                        this.state.relatedServices.length -
                            this.props.nMoreRelatedServices);
    }

    componentDidMount(): void {
        /* request our sibling services */
        iss('search/', {
            site_id: this.props.object.site.id,
            type: 'service',
        })
            .then(data => {
                /* remove ourselves */
                var relatedServices =
                    _.reject(data.objects,
                             service => service.id == this.props.object.id);
                this.setState({relatedServices: relatedServices});
            });
    }

    render(): React.Element {
        var {
            object,
        } = this.props;

        return (
            <mui.ListItem
                className="ResultListItem"
                containerElement={
                    <Router.Link
                        to="service"
                        params={{id: object.id}}
                    />
                }

                rightIcon={
                    <icons.Chevron />
                }

                disableFocusRipple={true}
                disableTouchRipple={true}
            >
                <h2 className="name">{object.name}</h2>
                <div className="site_name">{object.site.name}</div>
                <OpeningTimes className="opening_hours" object={object} />
                <TransportTime object={object} />
                <ul className="related">{
                    this.relatedServices.map((service, index) =>
                        <li key={index}>{service.name}</li>
                    )
                }</ul>
                {this.nMoreRelatedServices > 0 ?
                    <div>
                        {this.nMoreRelatedServices} more{' '}
                        {this.nMoreRelatedServices == 1 ?
                            'service' : 'services'}...
                    </div>
                :
                    ''
                }
            </mui.ListItem>
        );
    }
}

export default ResultListItem;