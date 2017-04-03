/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['knockout'],
        function (ko)
        {
            /* 
             * Your application specific code will go here
             */

            function dashboardViewModel() {
                var self = this;

                self.dashboardItems = ko.observableArray([
                    {"name": "Item1", "title": "Title1"},
                    {"name": "Item2", "title": "Title2"},
                    {"name": "Item3", "title": "Title3"},
                    {"name": "Item4", "title": "Title4"},
                    {"name": "Item5", "title": "Title5"},
                    {"name": "Item6", "title": "Title6"},
                    {"name": "Item7", "title": "Title7"},
                    {"name": "Item8", "title": "Title8"},
                    {"name": "Item9", "title": "Title9"},
                    {"name": "Item10", "title": "Title10"}
                ]);
            }

            return dashboardViewModel;

        });
