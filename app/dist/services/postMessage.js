/// <reference path="../_all.ts" />
// This should be a controller, not a service. Will fix.
var ContactManagerApp;
(function (ContactManagerApp) {
    var PostMessage = (function () {
        function PostMessage(userService, $mdDialog) {
            this.userService = userService;
            this.$mdDialog = $mdDialog;
            this.user = userService.selectedUser;
        }
        PostMessage.prototype.cancel = function () {
            this.$mdDialog.cancel();
        };
        PostMessage.prototype.save = function () {
            this.$mdDialog.hide();
        };
        PostMessage.$inject = ['userService', '$mdDialog'];
        return PostMessage;
    }());
    ContactManagerApp.PostMessage = PostMessage;
})(ContactManagerApp || (ContactManagerApp = {}));
//# sourceMappingURL=postMessage.js.map