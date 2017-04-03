/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'knockout', 'utils', 'data/data', 'ojs/ojrouter', 'ojs/ojknockout', 'promise', 'ojs/ojlistview', 'ojs/ojmodel', 'ojs/ojpagingcontrol', 'ojs/ojpagingcontrol-model'],
        function (oj, ko, utils, data)
        {
            function PeopleViewModel() {
                var self = this;

                var defaultLayout = utils.readCookie('peopleLayout');
                if (defaultLayout) {
                    self.peopleLayoutType = ko.observable(defaultLayout);
                } else {
                    self.peopleLayoutType = ko.observable('peopleCardLayout');
                }
                self.allPeople = ko.observableArray([]);
                self.ready = ko.observable(false);

                data.fetchData('js/data/employees.json').then(function (people) {
                    self.allPeople(people.employees);
                }).fail(function (error) {
                    console.log('Error in getting People data: ' + error.message);
                });

                self.parsePeople = function (response) {
                    return response['employees'];
                };

                self.model = oj.Model.extend({
                    idAttribute: 'empId'
                });

                self.collection = new oj.Collection(null, {
                    url: 'js/data/employees.json',
                    model: self.model
                });

                self.nameSearch = ko.observable('');

                self.filteredAllPeople = ko.computed(function () {
                    var peopleFilter = new Array();

                    if (self.allPeople().length !== 0) {
                        if (self.nameSearch().length === 0)
                        {
                            peopleFilter = self.allPeople();
                        } else {
                            ko.utils.arrayFilter(self.allPeople(),
                                    function (r) {
                                        var token = self.nameSearch().toLowerCase();
                                        if (r.firstName.toLowerCase().indexOf(token) === 0 || r.lastName.toLowerCase().indexOf(token) === 0) {
                                            peopleFilter.push(r);
                                        }
                                    });
                        }
                    }

                    self.ready(true);
                    return peopleFilter;
                });

                self.listViewDataSource = ko.computed(function () {
                    return new oj.ArrayTableDataSource(self.filteredAllPeople(), {idAttribute: 'empId'});
                });

                self.cardViewDataSource = ko.computed(function () {
                    return new oj.PagingTableDataSource(self.listViewDataSource());
                });

                self.getPhoto = function (empId) {
                    var src;
                    if (empId < 188) {
                        src = 'css/images/people/' + empId + '.png';
                    } else {
                        src = 'css/images/people/nopic.png';
                    }
                    return src;
                };

                self.getEmail = function (emp) {
                    return "mailto:" + emp.email + '@example.net';
                };

                self.getFacetime = function (emp) {
                    return "#";
                };

                self.getChat = function (emp) {
                    return "#";
                };

                self.getOrg = function (org, event) {
                    alert('This will take you to the employee page and highlight the team infotile');
                };

                self.getTenure = function (emp) {
                    var now = new Date().getFullYear();
                    var hired = new Date(emp.hireDate).getFullYear();
                    var diff = now - hired;
                    return diff;
                };

                self.cardLayoutHandler = function () {
                    utils.createCookie('peopleLayout', 'peopleCardLayout');
                    self.peopleLayoutType('peopleCardLayout');
                };

                self.listLayoutHandler = function () {
                    utils.createCookie('peopleLayout', 'peopleListLayout');
                    self.peopleLayoutType('peopleListLayout');
                };

                self.loadPersonPage = function (emp) {
                    if (emp.empId) {
                        // Temporary code until go('person/' + emp.empId); is checked in 1.1.2
                        history.pushState(null, '', 'index.html?root=person&emp=' + emp.empId);
                        oj.Router.sync();
                    } else {
                        // Default id for person is 100 so no need to specify.
                        oj.Router.rootInstance.go('person');
                    }
                };

                self.onEnter = function(data, event){
                    if(event.keyCode === 13){
                        var emp = {};
                        emp.empId = data.empId;
                        self.loadPersonPage(emp);
                    }
                    return true;
                };
                
                self.changeHandler = function (page, event) {
                    if (event.option === 'selection') {
                        if (event.value[0]) {
                            var emp = {};
                            emp.empId = event.value[0];
                            self.loadPersonPage(emp);
                        }
                    }
                };

            }

            return PeopleViewModel;
        });
