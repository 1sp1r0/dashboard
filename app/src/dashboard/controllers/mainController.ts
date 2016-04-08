/// <reference path="../_all.ts" />

module app.dashboard {

  export class MainController {
    static $inject = ['userService', '$mdSidenav', '$mdBottomSheet',
                      '$mdToast', '$mdDialog', '$mdMedia', '$http'];

    constructor(
      private userService: app.users.UserService,
      private $mdSidenav: angular.material.ISidenavService,
      private $mdBottomSheet: angular.material.IBottomSheetService,
      private $mdToast: angular.material.IToastService,
      private $mdDialog: angular.material.IDialogService,
      private $mdMedia: angular.material.IMedia,
      private $http: angular.IHttpService)
      {
        var self = this;

        this.user = this.userService.get();
        console.log(this.user);

        if(this.user.role == "user") {
          self.selected = this.user;
          console.log('is a user');
        }
        else if(this.user.role == "coach") {
          this.clients = this.user.clients;
          self.selected = this.clients[0];
          console.log('is a coach');
        }
        self.userService.selectedUser = self.selected;




      //  this.userService.loadClients()
      //   .then(function(result) {
      //     self.users = result;
      //     console.log(self.users);
      //   });


        this._ = window['_'];


        console.log(this.current);

    }

    _: any;
    user: any;
    current: any;
    name: string;
    searchText: string = '';
    formScope: any;
    tabIndex: number = 0;
    selected: any = null;

    isUser: boolean;

    coach: any;
    clients: any;

    newNote: Note = new Note('', null);
    newReminder: Reminder = new Reminder('', null);

    slack: any[];
    slack_emails: any[];
    members: any[];
    users: any[];

    // convertToUsers(slack: any[]) {
    //   console.log('convertToUsers: ' + this.slack);
    //   this.userService.
    // }

    setFormScope(scope) {
      this.formScope = scope;
    }

    addUser($event) {
      var self = this;

      var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
      this.$mdDialog.show({
        templateUrl: './dist/view/dashboard/user/newUserDialog.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        controller: AddUserDialogController,
        controllerAs: "ctrl",
        clickOutsideToClose:true,
        fullscreen: useFullScreen
      }).then((user: any) => {
        // Call user service
        console.log('this is user' + JSON.stringify(user));
        var newUser: any = this.userService.insert(user.name).then(function(result) {
          self.clients.push(result);
          self.selectUser(result);
        });

        self.openToast("User added");
      }, () => {
        console.log('You cancelled the dialog.');
      });
    }

    addReminder($event) {
      var self = this;

      var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
      this.$mdDialog.show({
        templateUrl: './dist/view/dashboard/reminders/modal.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        controller: ReminderController,
        controllerAs: "ctrl",
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
        locals : {
          selected: null
        }
      }).then((reminder: any) => {
        // Post request, and push onto users local list of reminders
        // this.$http.post('uri').then((response) => response.data)
        // after promise is succesful add to
        // reminder.assigne.reminders.push()
        this.$http.post('/api/reminder', reminder
        ).then(function successCallback(response) {
           self.selected.reminders.push(response.data);
           console.log(response.data);
        })


        self.openToast("Remminder added");
      }, () => {
        console.log('You cancelled the dialog.');
      });
    }

    editReminder($event, reminder) {
      var self = this;
      var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
      this.$mdDialog.show({
        templateUrl: './dist/view/dashboard/reminders/modal.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        controller: ReminderController,
        controllerAs: "ctrl",
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
        locals : {
          selected: reminder
        },
      }).then((reminder: any) => {
        // Post request, and push onto users local list of reminders
        // this.$http.post('uri').then((response) => response.data)
        // after promise is succesful add to
        // reminder.assigne.reminders.push()
        this.$http.post('/api/reminder/' + reminder._id, reminder
        ).then(function successCallback(reminder) {
          //  self.selected.reminders.push(response.data);
         if(self.updateReminder(reminder.data)) {
           self.openToast("Reminder Edited");
         }
         else {
           self.openToast("Reminder Not Found!");
         }
        })
      }, () => {
        console.log('You cancelled the dialog.');
      });
    }

    removeReminder($event, reminder) {
      var confirm = this.$mdDialog.confirm()
        .textContent('Are you sure you want to remove this reminder?')
        .ariaLabel('Remove')
        .targetEvent($event)
        .ok('Yes')
        .cancel('No');

        var self = this;
        this.$mdDialog.show(confirm).then((result: any) => {
          console.log(reminder);
          if(result) {
            this.$http.post('/api/reminder/remove/' + reminder._id, reminder)
            .then(function successCallback(success) {
                if(success) {
                  console.log(success);
                  self.deleteReminder(reminder);
                }
                else {
                  //err
                }
            });
          }
          else {

          }
          self.openToast("Reminder Removed.");
        });
    }

    updateReminder(reminder) {
      console.log(this.selected.reminders);
      for(var i = 0; i < this.selected.reminders.length; i++) {
        if (reminder._id == this.selected.reminders[i]._id) {
          this.selected.reminders[i] = reminder;
          return true;
        }
      }
      return false;
    }

    deleteReminder(reminder) {
      var foundIndex = this.selected.reminders.indexOf(reminder);
      this.selected.reminders.splice(foundIndex, 1);
    }

    slackList() {
      // var test = this.userService.slack().then((members: any) => {
      //   console.log('here');
      //   console.log(members);
      // });

    }

    testButton(email: any, slack: any) {
      console.log('test-button');
      var test = this.userService.create(email, slack)
      .then(
        function(result: any)  {
          console.log(result);
        },
        function(err) {
          console.log(err);
        }
      )
    }



    // removeReminder(reminder) {
    //   var foundIndex = this.selected.reminders.indexOf(reminder);
    //   this.selected.reminders.splice(foundIndex, 1);
    //   this.openToast("Reminder removed");
    // }

    clearReminders($event) {
      var confirm = this.$mdDialog.confirm()
        .title('Are you sure you want to delete all reminders?')
        .textContent('All reminders will be deleted, you can\'t undo this action.')
        .ariaLabel('Delete all reminders')
        .targetEvent($event)
        .ok('Yes')
        .cancel('No');

        var self = this;
        this.$mdDialog.show(confirm).then(() => {
          self.selected.reminders = [];
          self.openToast("Cleared reminders");
        });
    }

    removeNote(note) {
      var foundIndex = this.selected.notes.indexOf(note);
      this.selected.notes.splice(foundIndex, 1);
      this.openToast("Note removed");
    }

    addNote() {
      this.selected.notes.push(this.newNote);
      this.newNote = new Note('', null);

      this.formScope.noteForm.$setUntouched();
      this.formScope.noteForm.$setPristine();

      this.openToast("Note added");
    }

    clearNotes($event) {
      var confirm = this.$mdDialog.confirm()
        .title('Are you sure you want to delete all notes?')
        .textContent('All notes will be deleted, you can\'t undo this action.')
        .ariaLabel('Delete all notes')
        .targetEvent($event)
        .ok('Yes')
        .cancel('No');

        var self = this;
        this.$mdDialog.show(confirm).then(() => {
          self.selected.notes = [];
          self.openToast("Cleared notes");
        });
    }

    addSurvey($event) {
      var self = this;
      console.log('addSurvey()');
      var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
      this.$mdDialog.show({
        templateUrl: './dist/view/dashboard/surveys/modal.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        controller: SurveyController,
        controllerAs: "vm",
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
        locals : {
          selected: null
        }
      }).then((survey: any) => {
        // Post request, and push onto users local list of reminders
        // this.$http.post('uri').then((response) => response.data)
        // after promise is succesful add to
        // reminder.assigne.reminders.push()

        this.$http.post('/api/survey', survey
        ).then(function successCallback(survey) {
           self.selected.surveys.push(survey.data);
           console.log('angular');
           console.log(survey.data);
        })


        self.openToast("Survey added");
      }, () => {
        console.log('You cancelled the dialog.');
      });
    }

    openToast(message): void {
      this.$mdToast.show(
        this.$mdToast.simple()
          .textContent(message)
          .position('top right')
          .hideDelay(5000)
        );
    }

    toggleList() {
      this.$mdSidenav('left').toggle();
    }

    selectUser ( user ) {
      this.selected = user;
      this.userService.selectedUser = this.selected;
      console.log(this.selected);
      var sidebar = this.$mdSidenav('left');
      if (sidebar.isOpen()) {
        sidebar.close();
      }

      this.tabIndex = 0;
    }

    hasReal(user) {
      if(user.slack.real_name) {
        return true;
      }
      else {
        return false;
      }
    }

    isCoach(user) {
      if(user.role == "coach") {
        return true;
      }
      else {
        return false;
      }
    }

    showContactOptions($event) {
      this.$mdBottomSheet.show({
        parent: angular.element(document.getElementById('wrapper')),
        templateUrl: './dist/view/dashboard/contactSheet.html',
        controller: DashboardController,
        controllerAs: "cp",
        bindToController : true,
        targetEvent: $event
      }).then((clickedItem) => {
        clickedItem && console.log( clickedItem.name + ' clicked!');
      });
    }
  }
}
