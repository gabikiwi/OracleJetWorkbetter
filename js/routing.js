/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['crossroads', 'history'],
        function (crossroads) {
            // routing utility classes

            /**
             * Retrieves the current URL and dispatch using crossroads.
             * This is the function to execute when the URL change.
             */
            function parseUrl() {
                // Retrieve the portion of the URL after the last /
                var shortUrl = window.location.href.split('/').pop();
                crossroads.parse(shortUrl);
            }


            /**
             * Listen to URL changes caused by back/forward button
             * using the popstate event. Call parseUrl trigger the update.
             */
            window.addEventListener('popstate', parseUrl, false);


            function setRoute(data, event) {
                var shortUrl = window.location.href.split('/').pop();
                // Build the new URL with the new page id.
                if (data.target.id) {
                    var newUrl = window.location.pathname.split('/').pop() + '?page=' + data.target.id;
                } else {
                    var newUrl = window.location.pathname.split('/').pop() + '?page=' + data.target;
                }
                // Do not do anything if the new URL is the same.
                if (newUrl !== shortUrl) {
                    history.pushState(null, null, newUrl);
                    crossroads.parse(newUrl);
                }

                return true;
            }


            return {parseUrl: parseUrl, setRoute: setRoute};

        });

