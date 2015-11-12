/* @flow */
/* Generated by ./script/iconify */
/* eslint-disable max-len */


import React from "react";
import classnames from "classnames";

export default class SvgIconChevron extends React.Component {
    render(): ReactElement {
        const {className, ...rest} = this.props;
        const classes = classnames(
            "ChevronIcon",
            "allow-override-color",
            "Icon",
            "SvgIcon",
            className
        );

        return (
            <span
                {...rest}
                dangerouslySetInnerHTML={{__html: `
                    <svg class='${classes}' version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64"  xml:space="preserve"><g id="chevron"><g id="XMLID_674_"><path fill="#231F20"  d="M26.071,44.957c-0.281,0-0.563-0.107-0.777-0.322c-0.43-0.429-0.43-1.126,0-1.555l11.08-11.081 L25.294,20.92c-0.43-0.43-0.43-1.127-0.001-1.556c0.43-0.43,1.126-0.429,1.556-0.001l11.858,11.857 c0.207,0.207,0.322,0.486,0.322,0.778s-0.115,0.571-0.322,0.777L26.848,44.635C26.634,44.85,26.352,44.957,26.071,44.957z"></path></g></g><g id="Layer_1"></g></svg>
                `}}
            />
        );
    }
}
