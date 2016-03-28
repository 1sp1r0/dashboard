/// <reference path="../_all.ts" />

module app.users {

  export interface IUserService {
    id: any;
    user: any;
    clients: any;
    role: any;
    name: any;
    get (): any;
    loadClients(): ng.IPromise<any>;
    selectedUser: any;
  }

  export class UserService implements IUserService {

    id: any;
    name: any;
    user: any;
    clients: any;
    role: any;
    http: any;


    static $inject = ['$window', '$q', '$http', 'slackService'];

    constructor(private $window: ng.IWindowService,
                private $q: ng.IQService,
                private $http: ng.IHttpService,
                private slackService: SlackService) {
      this.user = window['user'];
      this.name = this.user.username;
      this.clients = this.user.clients;
      this.role = this.user.role;
      this.http = $http;
      this.slackService = slackService;
    }

    selectedUser: any = null;

    get (): any {
      return this.user;
    }

    loadClients(): ng.IPromise<any> {
      return this.$q.when(this.clients);
    }

    insert(params: any): ng.IPromise<any> {
      return this.http.post('/api/slack/' + params)
      .then(response => response.data);
    }

    slack(): ng.IPromise<any> {
      console.log('hit');
      return this.slackService.userList("xoxp-21143396339-21148553634-24144454581-f6d7e3347d")
        .then(response => response);
    }

  }

}
