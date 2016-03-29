/// <reference path="../_all.ts" />
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
                this.current = this.userService.get();
                this.coach = this.current.coach;
                this.clients = this.current.clients;
                self.selected = this.clients[0];
                self.userService.selectedUser = self.selected;
                // self.userService
                //   .loadClients()
                //   .then((clients: any) => {
                //     this.clients = clients;
                //     self.selected = clients[0];
                //     self.userService.selectedUser = self.selected;
                //   });
                // self.userService.slack()
                // .then(function (members: any)  {
                //       this.members = members.members;
                //       var slack = [];
                //       console.log("members: " + this.members);
                //       this._.forEach(this.members, function(member) {
                //         if(!member.is_bot && !member.deleted){
                //             slack.push({
                //             team: member.team_id,
                //             id: member.id,
                //             name: member.name,
                //             real_name: member.real_name,
                //             email: member.profile.email,
                //             img: member.profile.image_72,
                //             timezone: member.tz
                //           });
                //         }
                //       });
                //     return slack;
                // })
                // .then(function (slack: any) {
                //   this._.forEach(slack, function(member) {
                //     self.userService.create(member.email, member)
                //     .then(function(result) {
                //       console.log(result);
                //     });
                //   })
                // });
                //  this.userService.loadClients()
                //   .then(function(result) {
                //     self.users = result;
                //     console.log(self.users);
                //   });
                this._ = window['_'];
                this.name = this.current.username;
                console.log('name: ' + this.name);
                console.log('role: ' + this.current.role);
            }
            // convertToUsers(slack: any[]) {
            //   console.log('convertToUsers: ' + this.slack);
            //   this.userService.
            // }
            MainController.prototype.setFormScope = function (scope) {
                this.formScope = scope;
            };
            MainController.prototype.addUser = function ($event) {
                var _this = this;
                var self = this;
                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/newUserDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.AddUserDialogController,
                    controllerAs: "ctrl",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then(function (user) {
                    // Call user service
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
            MainController.prototype.slackMessage = function ($event, user) {
                var self = this;
                this.userService.selectedUser = user;
                console.log(self.current);
                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/sendSlackMessage.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.SlackUsersController,
                    controllerAs: "slack",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then(function () {
                    // var members: any = this.userService.slack().then(function(result) {
                    //   console.log(result);
                    // });
                }, function () {
                    console.log('You cancelled the dialog.');
                });
            };
            MainController.prototype.slackList = function () {
                // var test = this.userService.slack().then((members: any) => {
                //   console.log('here');
                //   console.log(members);
                // });
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
            MainController.prototype.addReminder = function () {
                this.selected.reminders.push(this.newReminder);
                this.newReminder = new dashboard.Reminder('', null);
                this.formScope.reminderForm.$setUntouched();
                this.formScope.reminderForm.$setPristine();
                this.openToast("Reminder added!");
                console.log(this.selected);
            };
            MainController.prototype.removeReminder = function (reminder) {
                var foundIndex = this.selected.reminders.indexOf(reminder);
                this.selected.reminders.splice(foundIndex, 1);
                this.openToast("Reminder removed");
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