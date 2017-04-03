/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['knockout', 'ojs/ojcore', 'data/data', 'ojs/ojknockout', 'ojs/ojchart'],
        function (ko, oj, data)
        {
            /* 
             * Your application specific code will go here
             */

            function DashboardViewModel() {
                var self = this;

                self.personProfile = ko.observableArray([]);
                self.ready = ko.observable(false);
                self.stackValue = ko.observable('off');
                self.orientationValue = ko.observable('horizontal');
                self.barSeriesValue = ko.observableArray();
                self.barGroupsValue = ko.observableArray();
                self.averagePerformance = ko.observable();
                self.averagePotential = ko.observable();                
                var barGroups = ["2000", "2001", "2002", "2003", "2004"];
                self.barSeriesValue(
                        [{name: "Finance", items: [80, 60, 50, 30, 20]}]
                        );
                self.barGroupsValue(barGroups);
                self.pieSeriesValue = ko.observableArray(
                    [{name: "Not Fitting into a Team", items: [2]},
                         {name: "No Career Progression", items: [2]},
                         {name: "Salary", items: [4]},
                         {name: "Seeking New Skills", items: [3]},
                         {name: "Personal/Family Reasons", items: [3]},
                         {name: "Work Environment", items: [1]}
                     ]
                    );

                var converterFactory = oj.Validation.converterFactory('number');
                self.percentConverter = converterFactory.createConverter({style: 'decimal', maximumFractionDigits: 0});

                data.fetchData('js/data/employee100.json').then(function (person) {
                    self.personProfile(person);
                    self.ready(true);
                    self.formatAverages();
                }).fail(function (error) {
                    console.log('Error: ' + error.message);
                });

                self.getPhoto = function (id) {
                    if (self.personProfile().empId < 188) {
                        var src = 'css/images/people/' + id + '.png';
                    } else {
                        src = 'css/images/people/nopic.png';
                    }
                    return src;
                };
                self.formatAverages = function(){
                    self.averagePerformance(self.personProfile().groupAvgRating.toPrecision(2));
                    self.averagePotential(self.personProfile().groupAvgPotential.toPrecision(2));                  
                };

                self.dashboardItems = ko.observableArray([
                    {"name": "Item1", "title": "My Team", "target": "people", "sizeClass": "oj-masonrylayout-tile-2x1"},
                    {"name": "Item2", "title": "My Notifications", "target": "me", "sizeClass": "oj-masonrylayout-tile-1x1"},
                    {"name": "Item3", "title": "My Activities", "target": "me", "sizeClass": "oj-masonrylayout-tile-1x1"},
                    {"name": "Item4", "title": "My Team Activities", "target": "me", "sizeClass": "oj-masonrylayout-tile-1x2"},
                    {"name": "Item5", "title": "Compensation Ratio", "target": "me", "sizeClass": "oj-masonrylayout-tile-1x1"},
                    {"name": "Item6", "title": "Average Compensation", "target": "me", "sizeClass": "oj-masonrylayout-tile-1x1"},
                    {"name": "Item7", "title": "Average Ratings", "target": "me", "sizeClass": "oj-masonrylayout-tile-1x1"},
                    {"name": "Item8", "title": "Average Performance", "target": "me", "sizeClass": "oj-masonrylayout-tile-1x1"},
                    {"name": "Item9", "title": "Attrition History", "target": "me", "sizeClass": "oj-masonrylayout-tile-1x1"},
                    {"name": "Item10", "title": "About Me", "target": "person", "sizeClass": "oj-masonrylayout-tile-1x1"}
                ]);

                self.compratio = ko.observableArray([
                    {"faderatio": "1", "name": "Finance", "value": "$150k", "rate": "100"},
                    {"faderatio": "0.8", "name": "Development", "value": "$125k", "rate": "70"},
                    {"faderatio": "0.8", "name": "HR", "value": "$90k", "rate": "50"},
                    {"faderatio": "0.6", "name": "Maintenance", "value": "$60k", "rate": "40"},
                    {"faderatio": "0.6", "name": "Shipping", "value": "$50k", "rate": "30"}
                ]);

                self.dashboardClick = function (ui, event) {
                    //console.log("in click");
                };
            }

            return DashboardViewModel;

        });
