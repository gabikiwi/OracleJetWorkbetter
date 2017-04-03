/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'knockout', 'data/data', 'moment', 'ojs/ojknockout', 'ojs/ojvalidation-datetime', 'ojs/ojtagcloud', 'ojs/ojchart', 'ojs/ojnavigationlist', 'ojs/ojdatacollection-common'],
        function (oj, ko, jsonData, moment)
        {

            function PersonViewModel() {
                var self = this;
                var firstTime = true;
                self.data = ko.observable();
                self.colorHandler = new oj.ColorAttributeGroupHandler();
                self.personProfile = ko.observableArray([]);
                self.people = ko.observableArray([]);
                self.infoTiles = ko.observableArray();
                self.infoTilesDataSource = ko.observable();
                self.employeePhoto = ko.observable();
                self.selectedTab = ko.observable(1);
                self.detailsContentTemplate = ko.observable('personDetails/phone/summary');
                self.empId = ko.observable('');
                self.teamDataReady = ko.observable(false);
                self.navListDataReady = ko.observable(false);
                self.compensations = ko.observableArray(self.personProfile().compensations);
                self.stackValue = ko.observable('off');
                self.orientationValue = ko.observable('vertical');
                self.comboSeriesValue = ko.observableArray();
                self.comboGroupsValue = ko.observableArray();
                self.barSeriesValue = ko.observableArray();
                self.barGroupsValue = ko.observableArray();
                self.pieSeriesValue = ko.observableArray();
                self.directReports = ko.observableArray([]);

                self.handleActivated = function (info) {
                    var parentRouter = info.valueAccessor().params['ojRouter']['parentRouter'];

                    // Retrieve the childRouter instance created in main.js
                    self.empRouter = parentRouter.currentState().value;

                    self.empRouter.configure(function (stateId) {
                        var state;
                        if (stateId) {
                            var data = stateId.toString();
                            state = new oj.RouterState(data, {
                                value: data,
                                // For each state, before entering the state,
                                // make sure the data for it is loaded.
                                canEnter: function () {
                                    // The state transition will be on hold
                                    // until loadData is resolved.
                                    return self.loadData(data);
                                }
                            });
                        }
                        return state;
                    });

                    // Returns the sync promise to handleActivated. The next
                    // phase of the ojModule lifecycle (attached) will not be
                    // executed until sync is resolved.
                    return oj.Router.sync();
                };

                function getEmpURL(id) {
                    var url;
                    if (id) {
                        url = "js/data/employee" + id + ".json";
                    } else {
                        url = "js/data/employee100.json";
                    }
                    return url;
                }

                self.goEmp = function (empId) {
                    self.empRouter.go(empId.toString());
                };

                // canEnter requires a promise that resolve as true or false
                self.loadData = function (id) {
                    return new Promise(function(resolve, reject) {
                        jsonData.fetchData(getEmpURL(id)).then(function (person) {
                            self.personProfile(person);
                            self.directReports(person.reports);
                            loadPerfandPotenialData();
                            resolve(true);
                        }).fail(function (error) {
                            console.log('Error: ' + error.message);
                            resolve(false);
                        });
                    });
                };

                self.orgPeopleDataSource = ko.computed(function () {
                    return new oj.ArrayTableDataSource(self.directReports(), {idAttribute: 'empId'});
                });

                self.navListOptionChangeHandler = function (event, data) {
                    self.selectedTab(data);
                    var template = ko.utils.arrayFirst(self.infoTiles(), function (item) {
                        return (item.sid === data.value);
                    }).title;
                    var newPage = "personDetails/phone/" + template.toLowerCase();
                    self.detailsContentTemplate(newPage);
                    return true;
                };

                self.personClickHandler = function (data) {
                    self.selectedTab(data.sid);
                    ko.utils.arrayForEach(self.personProfile().comps, function (item) {
                    });
                    var newPage = "personDetails/phone/" + data.title.toLowerCase();
                    self.detailsContentTemplate(newPage);
                    return true;
                };

                self.getColor = function (skillValue) {
                    return self.colorHandler.getValue(skillValue);
                };

                self.getPhoto = function (id) {
                    // We only have images for employees below 188 for now. Use the nopic avatar for those above 18
                    var src;
                    if (id < 188) {
                        src = 'css/images/people/' + id + '.png';
                    } else {
                        src = 'css/images/people/nopic.png';
                    }
                    return src;
                };

                self.getEmail = function () {
                    return "mailto:" + self.personProfile().email + '@example.net';
                };

                self.getOrg = function (data, event) {
                    alert('This will take you to the employee page and highlight the team infotile');
                };

                self.getHireDate = function () {
                    var hireDate = self.personProfile().hireDate;
                    var dateOptions = {formatStyle: 'date', dateFormat: 'medium'};
                    var dateConverter = oj.Validation.converterFactory("datetime").createConverter(dateOptions);
                    var startDate = oj.IntlConverterUtils.dateToLocalIso(moment(hireDate).toDate());
                    hireDate = dateConverter.format(startDate);
                    return hireDate;
                };

                self.formatAddress = function () {
                    var street = self.personProfile().address;
                    var city = self.personProfile().city;
                    var state = self.personProfile().state;
                    var postal = self.personProfile().postal;
                    var country = self.personProfile().country;
                    return street + '<br/>' + city + '<br/>' + state + ' ' + postal + ' ' + country;
                };

                self.getTenure = function (emp) {
                    var now = new Date().getFullYear();
                    var hired = new Date(emp.hireDate).getFullYear();
                    var diff = now - hired;
                    return diff;
                };

                self.findAvgRating = function (emp) {
                    var avgRate, avgPot, sumRate = 0, sumPot = 0, rateCount = emp.perfs.length;
                    ko.utils.arrayForEach(emp.perfs, function (item) {
                        sumRate = sumRate + item.rating;
                        sumPot = sumPot + item.potential;
                    });
                    avgRate = sumRate / rateCount;
                    avgPot = sumPot / rateCount;
                    return {
                        avgRate: avgRate,
                        avgPot: avgPot
                    };
                };

                function loadPerfandPotenialData() {
                    var ratcount = [], potcount = [], specyear = [], payyear = [], salcount = [], data = self.personProfile();
                    ko.utils.arrayForEach(data.perfs, function (item) {
                        ratcount.push(item.rating);
                        potcount.push(item.potential);
                        specyear.push(new Date(item.effective).getFullYear());
                    });
                    ko.utils.arrayForEach(data.comps, function (item) {
                        salcount.push(item.compSalary);
                        payyear.push(new Date(item.effective).getFullYear());
                    });
                    self.comboSeriesValue(
                            [{name: "Rating", items: ratcount},
                                {name: "Potential", items: potcount}]
                            );
                    self.comboGroupsValue(specyear);
                    self.barSeriesValue(
                            [{name: "Salary", items: salcount}]
                            );
                    self.barGroupsValue(payyear);
                    self.pieSeriesValue = ko.observableArray(
                            [{name: "Bonus", items: [data.comps[0].bonus]},
                                {name: "Comission", items: [data.comps[0].comission]},
                                {name: "Salary", items: [data.comps[0].compSalary]}]
                            );
                    loadTeamData(data);
                }

                function loadTeamData(data) {

                    self.infoTiles([
                        {"sid": "1", "name": "Item1", "title": "Summary", "infolable1": "Skills", "infolable1value": data.skills.length, "infolable2": "Tenure", "infolable2value": self.getTenure(data)},
                        {"sid": "2", "name": "Item2", "title": "Performance", "infolable1": "Rating", "infolable1value": data.rating, "infolable2": "Potential", "infolable2value": data.potential},
                        {"sid": "3", "name": "Item3", "title": "Compensation", "infolable1": "Salary", "infolable1value": "$" + (data.salary > 999) ? (data.salary / 1000).toFixed(0) + 'k' : data.salary, "infolable2": "Ratio", "infolable2value": data.compRatio},
                        {"sid": "4", "name": "Item4", "title": "Team", "infolable1": "Group", "infolable1value": data.skills.length, "infolable2": "Directs", "infolable2value": self.directReports().length}
                    ]);
                    self.infoTilesDataSource = new oj.ArrayTableDataSource(self.infoTiles(), {idAttribute: 'sid'});
                    self.navListDataReady(true);
                }

                self.getSkills = function () {
                    var skills = [];
                    ko.utils.arrayForEach(self.personProfile().skills, function (item) {
                        skills.push({id: item.skill.skillId,
                            label: item.skill.skill,
                            value: item.empskillassignRating,
                            shortDesc: 'Rating for ' + item.skill.skill + ': ' + item.empskillassignRating});
                    });
                    return skills;
                };

                self.getTenure = function (data) {
                    var now = new Date().getFullYear();
                    var hired = new Date(data.hireDate).getFullYear();
                    var diff = now - hired;
                    return diff;
                };

            }

            return new PersonViewModel();
        });
