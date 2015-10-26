/* @flow */
import React from "react";
import URL from "url";

export default class Web extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: {url: "https://example.com/landingPage"}};

    render(): ReactElement {
        let url = URL.parse(this.props.url);

        return (
            <div className="Contact Web">
                <a href={url.href}>
                    <div className="Contact-text">
                        <span className="kind">
                        {' '}
                        </span>
                        <span className="web value">
                            {url.hostname}
                            {url.path == "/" ? "" : url.path}
                        </span>
                    </div>
                </a>
            </div>
        );
    }
}
