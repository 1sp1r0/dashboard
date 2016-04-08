var app;
(function (app) {
    var dashboard;
    (function (dashboard) {
        var MainController = (function () {
            function MainController(userService, $mdSidenav, $mdBottomSheet, $mdToast, $mdDialog, $mdMedia, $http) {
                this.userService = userService;
                this.$mdSidenav = $mdSidenav;
                this.$mdBottomSheet = $mdBottomSheet;
                this.$mdToast = $mdToast;
                this.$mdDialog = $mdDialog;
                this.$mdMedia = $mdMedia;
                this.$http = $http;
                this.searchText = '';
                this.tabIndex = 0;
                this.selected = null;
                this.newNote = new dashboard.Note('', null);
                this.newReminder = new dashboard.Reminder('', null);
                var self = this;
                this.user = this.userService.get();
                console.log(this.user);
                if (this.user.role == "user") {
                    self.selected = this.user;
                    console.log('is a user');
                }
                else if (this.user.role == "coach") {
                    this.clients = this.user.clients;
                    self.selected = this.clients[0];
                    console.log('is a coach');
                }
                self.userService.selectedUser = self.selected;
                this._ = window['_'];
                console.log(this.current);
            }
            MainController.prototype.setFormScope = function (scope) {
                this.formScope = scope;
            };
            MainController.prototype.addUser = function ($event) {
                var _this = this;
                var self = this;
                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/user/newUserDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.AddUserDialogController,
                    controllerAs: "ctrl",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then(function (user) {
                    console.log('this is user' + JSON.stringify(user));
                    var newUser = _this.userService.insert(user.name).then(function (result) {
                        self.clients.push(result);
                        self.selectUser(result);
                    });
                    self.openToast("User added");
                }, function () {
                    console.log('You cancelled the dialog.');
                });
            };
            MainController.prototype.addReminder = function ($event) {
                var _this = this;
                var self = this;
                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/reminders/modal.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.ReminderController,
                    controllerAs: "ctrl",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        selected: null
                    }
                }).then(function (reminder) {
                    _this.$http.post('/api/reminder', reminder).then(function successCallback(response) {
                        self.selected.reminders.push(response.data);
                        console.log(response.data);
                    });
                    self.openToast("Remminder added");
                }, function () {
                    console.log('You cancelled the dialog.');
                });
            };
            MainController.prototype.editReminder = function ($event, reminder) {
                var _this = this;
                var self = this;
                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/reminders/modal.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.ReminderController,
                    controllerAs: "ctrl",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        selected: reminder
                    },
                }).then(function (reminder) {
                    _this.$http.post('/api/reminder/' + reminder._id, reminder).then(function successCallback(reminder) {
                        if (self.updateReminder(reminder.data)) {
                            self.openToast("Reminder Edited");
                        }
                        else {
                            self.openToast("Reminder Not Found!");
                        }
                    });
                }, function () {
                    console.log('You cancelled the dialog.');
                });
            };
            MainController.prototype.removeReminder = function ($event, reminder) {
                var _this = this;
                var confirm = this.$mdDialog.confirm()
                    .textContent('Are you sure you want to remove this reminder?')
                    .ariaLabel('Remove')
                    .targetEvent($event)
                    .ok('Yes')
                    .cancel('No');
                var self = this;
                this.$mdDialog.show(confirm).then(function (result) {
                    console.log(reminder);
                    if (result) {
                        _this.$http.post('/api/reminder/remove/' + reminder._id, reminder)
                            .then(function successCallback(success) {
                            if (success) {
                                console.log(success);
                                self.deleteReminder(reminder);
                            }
                            else {
                            }
                        });
                    }
                    else {
                    }
                    self.openToast("Reminder Removed.");
                });
            };
            MainController.prototype.updateReminder = function (reminder) {
                console.log(this.selected.reminders);
                for (var i = 0; i < this.selected.reminders.length; i++) {
                    if (reminder._id == this.selected.reminders[i]._id) {
                        this.selected.reminders[i] = reminder;
                        return true;
                    }
                }
                return false;
            };
            MainController.prototype.deleteReminder = function (reminder) {
                var foundIndex = this.selected.reminders.indexOf(reminder);
                this.selected.reminders.splice(foundIndex, 1);
            };
            MainController.prototype.slackList = function () {
            };
            MainController.prototype.testButton = function (email, slack) {
                console.log('test-button');
                var test = this.userService.create(email, slack)
                    .then(function (result) {
                    console.log(result);
                }, function (err) {
                    console.log(err);
                });
            };
            MainController.prototype.clearReminders = function ($event) {
                var confirm = this.$mdDialog.confirm()
                    .title('Are you sure you want to delete all reminders?')
                    .textContent('All reminders will be deleted, you can\'t undo this action.')
                    .ariaLabel('Delete all reminders')
                    .targetEvent($event)
                    .ok('Yes')
                    .cancel('No');
                var self = this;
                this.$mdDialog.show(confirm).then(function () {
                    self.selected.reminders = [];
                    self.openToast("Cleared reminders");
                });
            };
            MainController.prototype.removeNote = function (note) {
                var foundIndex = this.selected.notes.indexOf(note);
                this.selected.notes.splice(foundIndex, 1);
                this.openToast("Note removed");
            };
            MainController.prototype.addNote = function () {
                this.selected.notes.push(this.newNote);
                this.newNote = new dashboard.Note('', null);
                this.formScope.noteForm.$setUntouched();
                this.formScope.noteForm.$setPristine();
                this.openToast("Note added");
            };
            MainController.prototype.clearNotes = function ($event) {
                var confirm = this.$mdDialog.confirm()
                    .title('Are you sure you want to delete all notes?')
                    .textContent('All notes will be deleted, you can\'t undo this action.')
                    .ariaLabel('Delete all notes')
                    .targetEvent($event)
                    .ok('Yes')
                    .cancel('No');
                var self = this;
                this.$mdDialog.show(confirm).then(function () {
                    self.selected.notes = [];
                    self.openToast("Cleared notes");
                });
            };
            MainController.prototype.addSurvey = function ($event) {
                var _this = this;
                var self = this;
                console.log('addSurvey()');
                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/surveys/modal.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.SurveyController,
                    controllerAs: "vm",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        selected: null
                    }
                }).then(function (survey) {
                    _this.$http.post('/api/survey', survey).then(function successCallback(survey) {
                        self.selected.surveys.push(survey.data);
                        console.log('angular');
                        console.log(survey.data);
                    });
                    self.openToast("Survey added");
                }, function () {
                    console.log('You cancelled the dialog.');
                });
            };
            MainController.prototype.openToast = function (message) {
                this.$mdToast.show(this.$mdToast.simple()
                    .textContent(message)
                    .position('top right')
                    .hideDelay(5000));
            };
            MainController.prototype.toggleList = function () {
                this.$mdSidenav('left').toggle();
            };
            MainController.prototype.selectUser = function (user) {
                this.selected = user;
                this.userService.selectedUser = this.selected;
                console.log(this.selected);
                var sidebar = this.$mdSidenav('left');
                if (sidebar.isOpen()) {
                    sidebar.close();
                }
                this.tabIndex = 0;
            };
            MainController.prototype.hasReal = function (user) {
                if (user.slack.real_name) {
                    return true;
                }
                else {
                    return false;
                }
            };
            MainController.prototype.isCoach = function (user) {
                if (user.role == "coach") {
                    return true;
                }
                else {
                    return false;
                }
            };
            MainController.prototype.showContactOptions = function ($event) {
                this.$mdBottomSheet.show({
                    parent: angular.element(document.getElementById('wrapper')),
                    templateUrl: './dist/view/dashboard/contactSheet.html',
                    controller: dashboard.DashboardController,
                    controllerAs: "cp",
                    bindToController: true,
                    targetEvent: $event
                }).then(function (clickedItem) {
                    clickedItem && console.log(clickedItem.name + ' clicked!');
                });
            };
            MainController.$inject = ['userService', '$mdSidenav', '$mdBottomSheet',
                '$mdToast', '$mdDialog', '$mdMedia', '$http'];
            return MainController;
        }());
        dashboard.MainController = MainController;
    })(dashboard = app.dashboard || (app.dashboard = {}));
})(app || (app = {}));
//# sourceMappingURL=mainController.js.map