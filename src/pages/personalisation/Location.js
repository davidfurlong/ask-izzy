/* @flow */

import React from "react";
import reactMixin from "react-mixin";
import { debounce } from "core-decorators";
import { ltrim } from "underscore.string";

import {geolocationAvailable} from "../../geolocation";
import Personalisation from "../../mixins/Personalisation";
import components from "../../components";
import icons from "../../icons";
import storage from "../../storage";
import * as iss from "../../iss";
import suggest from "../../locationSuggestions";

const AutocompleteState = {
    NOT_SEARCHING: 0,
    SEARCHING: 1,
};

/*::`*/@reactMixin.decorate(Personalisation)/*::`;*/
class Location extends React.Component {

    static propTypes = {
        name: React.PropTypes.string.isRequired,
        onDoneTouchTap: React.PropTypes.func,
    };

    static defaultProps = {
        name: "location",
    };

    constructor(props: Object) {
        super(props);
        this.state = {
            autocompletion: AutocompleteState.NOT_SEARCHING,
            locationName: "",
            locationCoords: {},
            autocompletions: [],
        };
    }

    componentDidMount(): void {
        this.setLocationName(
            storage.getLocation(),
            storage.getLocation() != "" // valid location
        );
    }

    /* eslint-disable react/sort-comp */
    static title = "Location";

    static headingValue(): ?string {
        return this.answer && `in ${this.answer}`
    }

    static get answer(): string {
        return storage.getLocation();
    }

    static shouldEnableCatchment(): boolean {
        let tasmaniaRegex = /TAS(mania)?$/i;

        if (tasmaniaRegex.exec(storage.getLocation())) {
            return true;
        }

        return false;
    }

    static getSearch(request: iss.searchRequest): ?iss.searchRequest {
        /* Coordinates are optional */
        let coords = storage.getCoordinates();

        if (coords && coords.latitude && coords.longitude) {
            request = Object.assign(request, {
                location: `${coords.longitude}E${coords.latitude}N`,
            });
        }

        /* Location/Area is required */
        let location = storage.getLocation();

        if (!location) {
            return null;
        }

        request = Object.assign(request, {area: location});

        if (this.shouldEnableCatchment()) {
            request = Object.assign(request, {catchment: true});
        }

        return request;
    }

    static summaryLabel = "Where are you?";

    static get summaryValue(): string {
        return storage.getLocation();
    }

    static showQuestion(): boolean {
        return true;
    }

    /**
     * triggerAutocomplete:
     *
     * Trigger an autocomplete after a 500ms debounce.
     */
    /*::__(){`*/@debounce(500)/*::`}*/
    triggerAutocomplete(): void {
        let input = this.state.locationName;

        suggest(input, this.state.locationCoords)
            .then(results => {
                this.setState({
                    autocompletions: results,
                    autocompletion: AutocompleteState.NOT_SEARCHING,
                });
            })

            .catch(() => {
                this.setState({
                    autocompletion: AutocompleteState.NOT_SEARCHING,
                });
            });
    }

    setLocationName(name: any, validChoice: boolean): void {
        this.setState({
            locationName: `${name || ""}`,
        });
        this.setState({nextDisabled: !(name && validChoice)});
    }


    onNextStep(): void {
        storage.setLocation(this.state.locationName || "");
    }

    componentDidUpdate(prevProps: Object, prevState: Object): void {
        // After state updates, make sure you can see the input
        if (this.refs.search &&
            this.refs.search == document.activeElement &&
            prevState.autocompletions != this.state.autocompletions) {
            this.scrollToSearchControl();
        }
    }

    /*::__(){`*/@debounce(500)/*::`}*/
    scrollToSearchControl(): void {
        if (this.refs.search) {
            // Scroll the input to just under the appbar
            window.scrollTo(0, this.refs.search.offsetTop - 40);
        }
    }

    onSearchChange(event: Event): void {
        if (event.target instanceof HTMLInputElement) {
            this.setLocationName(ltrim(event.target.value), false);
            this.setState({
                autocompletion: AutocompleteState.SEARCHING,
            });

            // Forget the users coordinates if they change
            // the location we detected
            storage.setCoordinates(null);

            this.triggerAutocomplete();
        }
    }

    onGeoLocationSuccess(params: {coords: Coordinates, name: string}): void {
        storage.setCoordinates(params.coords);
        this.setLocationName(params.name, true);
    }

    render(): ReactElement {
        return (
            <div className="Location">
                <components.HeaderBar
                    primaryText={
                        <div>
                            Where are you?
                            <components.LogoWithShadow />
                        </div>
                    }
                    secondaryText={
                        "This will let me find the services closest to you"
                    }
                />
                <div className="List">{
                    /* if the browser supports geolocation */
                    geolocationAvailable() &&
                    <components.GeolocationButton
                        onSuccess={this.onGeoLocationSuccess.bind(this)}
                    />
                }
                <form
                    className="search"
                    onSubmit={this.props.onDoneTouchTap}
                >
                    <div>
                        <input
                            type="search"
                            ref="search"
                            onFocus={this.scrollToSearchControl.bind(this)}
                            aria-label="Search for a suburb or postcode"
                            placeholder="Search for a suburb or postcode"
                            value={this.state.locationName}
                            autoFocus={true}
                            onChange={this.onSearchChange.bind(this)}
                        />
                    </div>

                </form>
                {
                    /* any autocompletions we currently have */
                    this.state.autocompletions.map((result, index) =>
                        <components.InputListItem
                            key={index}
                            primaryText={
                                <div className="suburb">
                                    {result.suburb}
                                </div>
                            }
                            secondaryText={
                                <div className="state">
                                    {result.state}
                                </div>
                            }
                            type="radio"
                            tabIndex="0"
                            uncheckedIcon={
                                <icons.RadioUnselected className="big" />
                            }
                            checkedIcon={
                                <icons.RadioSelected className="big" />
                            }
                            onClick={() => {
                                /* set the text box to this value
                                 * and remove the autocompletions */
                                let locationName =
                                    `${result.suburb}, ${result.state}`;

                                this.setLocationName(locationName, true);
                                this.setState({
                                    autocompletions: [],
                                });
                            }}
                        />
                    )
                }</div>
                {
                    this.state.autocompletion == AutocompleteState.SEARCHING ?
                        <div className="progress">
                            <icons.Loading className="big" />
                        </div>
                    : ""
                }
                {this.renderDoneButton()}
            </div>
        );
    }

    renderDoneButton(): ?ReactElement {
        return (
            <div>
                <div className="done-button">
                    <components.FlatButton
                        label="Done"
                        onClick={this.props.onDoneTouchTap}
                        disabled={this.state.nextDisabled}
                    />
                </div>
            </div>
        )
    }

}

export default Location;
