import React, { PropTypes, Component } from "react";
import { provideContext, connectToStores } from "fluxible-addons-react";
import { handleHistory } from "fluxible-router";

import Page from "./components/Page";
import Immutable from "immutable";

import NotFoundPage from "./pages/NotFoundPage";
import ErrorPage from "./pages/ErrorPage";
import LoadingPage from "./pages/LoadingPage";

// Wrap Application with the fluxible context.
// PS. new to this syntax? Those are called "decorators", see
// https://babeljs.io/docs/usage/experimental/
@provideContext

// Wrap with fluxible-router's history handler (required for routing)
// This also passes `currentRoute` as prop to the component
@handleHistory

// Listen to HtmlHeadStore and pass the document title to the component
@connectToStores(["HtmlHeadStore"], (context) =>
  ({ documentTitle: context.getStore("HtmlHeadStore").getTitle() })
)

class Application extends Component {

    static propTypes = {
        // props coming from fluxible-router's handleHistory
        isNavigateComplete: PropTypes.bool,
        currentRoute: PropTypes.object,
        currentNavigateError: PropTypes.shape({
            statusCode: PropTypes.number.isRequired,
            message: PropTypes.string.isRequired,
        }),

        // prop coming from HtmlHeadStore
        documentTitle: PropTypes.string,
    }

    componentDidUpdate(prevProps) {
        const { documentTitle, currentRoute } = this.props;

        if (prevProps.documentTitle !== documentTitle) {
            document.title = documentTitle;
        }
    }

    render() {
        const {
            currentRoute,
            currentNavigateError,
            isNavigateComplete
        } = this.props;

        let Handler = currentRoute && currentRoute.get("handler");

        let content;

        if (currentNavigateError && currentNavigateError.statusCode === 404) {
            // This "not found" error comes from a page init actions
            // e.g. when an upstream API fails
            content = <NotFoundPage />;
        } else if (currentNavigateError) {
            // Generic error, usually always with statusCode 500
            content = <ErrorPage err={currentNavigateError} />;
        } else if (!Handler) {
            // No handler: Route not found (e.g.
            // is not defined in the routes.js config)
            content = <NotFoundPage />;
        } else if (!isNavigateComplete) {
            // Show a loading page while waiting the route's action to finish
            content = <LoadingPage />;
        } else {
            // Here you go with the actual page content
            const params = currentRoute.get("params").toJS();
            content = <Handler {...params} />;
        }

        return (
            <Page footer={isNavigateComplete}>
                { content }
            </Page>
        );
    }
}

export default Application;
