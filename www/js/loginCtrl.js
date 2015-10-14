 angular.module('starter.loginCtrl', ['firebase','ngMessages'])
.controller("loginCtrl", function ($scope, $ionicModal, $rootScope, $ionicPopup, $state, $firebaseAuth) {


   // Firebase reference
    var myRef = new Firebase("https://vote-x.firebaseio.com");
    var userRef ;
    // Login Status-----------------------------------
    
    $rootScope.currentUserSignedIn = false;
  
    //UserData after Registration-----------------------------
   
 
    $scope.userEmail;
    $scope.registerID;
    $scope.userID; //authData.uid nach Login gespeichert
    $scope.profilePic;
    var fid; // Firebade user ID firebaseio.com/users/*fid*/email etc

    //Get initial userdata-----------------------------

            
    
    $scope.getInitialData = function(userRef){
              var fbStr = new Firebase ("https://vote-x.firebaseio.com/users/");
              var usersRef = fbStr.push({
               email: $scope.userEmail    
                });
    
      fid = usersRef.key();
       console.log("Firebase ID: "+fid);
    };
     
     
     //----- ------- Go Home------------ ---- --
     $scope.goHome = function () {
     $state.go("app.home");     
     }
    


    //--------------------------------------------------------------------------------------------------

    // Login
    $scope.doLogin = function (email, password) {

        if (email !== undefined && password !== undefined) {
            myRef.authWithPassword({
                email: email,
                password: password
            }, function (error, authData) {
                if (error) {
                    switch (error.code) {
                        case "INVALID_PASSWORD":
                            showAlertLogin(ErrorLoginTitle2, ErrorLoginText2);
                           // console.log("The specified user account password is incorrect.");
                            break;

                        case "INVALID_USER":
                            showAlertLogin(ErrorLoginTitle4, ErrorLoginText4);
                           // console.log("There is no user with this email registered.");
                            break;

                        default:
                            showAlertLogin(ErrorLoginTitle3, ErrorLoginText3);
                           // console.log("Error logging user in:", error);
                    }
                } else {
                     $rootScope.currentUserSignedIn =true;
                    
                     console.log("current user signed in");
            //    $scope.getProfilePic(authData);
                     $scope.userID = authData.uid;
                    showAlertLoggedIn(authData);
                  $scope.modal1.hide();
                 $state.go("app.profile");
                }
            },{remember: "sessionOnly"
            })
        }
      };

//----------------------Register function ------------------------------
      $scope.doRegister = function (username1, password1, password2) {

        if (password1 !== password2) {
          showAlertError("Fehler!", "Ihr Passwort stimmt nicht überein!");

        }

        else
        if (username1 !== undefined && password1 !== undefined && password2 !== undefined) {
            myRef.createUser({

                email: username1,
                password: password1,
                verified: 0    
                     
            },

             function (error, authData,password) {
                if (error) {

                  switch (error.code) {
                     case "INVALID_EMAIL":
                         showAlertError(ErrorTitle1, ErrorText1);
                         console.log("The specified user account email is invalid.");
                         break;
                     case "INVALID_PASSWORD":
                         showAlertError(ErrorTitle2, ErrorText2);
                         console.log("The specified user account password is incorrect.");
                         break;
                     case "INVALID_USER":
                         showAlertError(ErrorTitle3, ErrorText3);
                         console.log("The specified user account does not exist.");
                         break;

                     case "EMAIL_TAKEN":
                         showAlertError(ErrorTitle4, ErrorText4);
                         console.log("The specified user account email is already in use.");
                         break;

                     case "UNKNOWN_ERROR":
                         showAlertError(ErrorTitle5, ErrorText5);
                         console.log("An unknown error occurred.");
                         break;

                     default:
                         showAlertError(ErrorTitle5, ErrorText5);
                         console.log("Error logging user in:", error);
                 }
                } else {
                  $scope.userEmail = username1;
                    console.log(authData.uid);
                    userRef = authData.uid;
                    $scope.getInitialData(userRef); 
                    showAlertCreated(username1);
                    $state.go("app.home");
                   
                }
            })
        }
    }

    //---------------------------------------------------------------------------------------------------------------

        // ERROR-HANDLING Registration
        var ErrorTitle1 = "Ungültige Email!";
        var ErrorText1 = "Die angegebene Email-Adresse ist leider ungültig ! :(";

        var ErrorTitle2 = "Ungültiges Passwort!"
        var ErrorText2 = "Das angegebene Passwort ist leider ungültig ! :(";

        var ErrorTitle3 = "Ungültiger Benutzername!"
        var ErrorText3 = "Der angegebene Benutzername ist leider ungültig oder vergeben ! :(";

        var ErrorTitle4 = "Diese Email-Adresse ist nicht verfügbar!"
        var ErrorText4 = "Die angegebene Email-Adresse ist leider schon vergeben! :(";

        var ErrorTitle5 = "Es gab einen Fehler!"
        var ErrorText5 = "Es ist leider ein Fehler aufgetreten! :(";

    //------------------------------------------------------------------------------------------------------------------
    // ERROR-HANDLING Login

    var ErrorLoginTitle2 = "Ungültiges Passwort!";
    var ErrorLoginText2 = "Das angegebene Passwort ist leider falsch! Haben Sie ihr Kennwort vergessen ?";

    var ErrorLoginTitle3 = "Login fehlgeschlagen!"
    var ErrorLoginText3 = "Beim Login ist ein Fehler aufgetreten! :( Bitte kontaktiere den Support!";

    var ErrorLoginTitle4 = "Login fehlgeschlagen!"
    var ErrorLoginText4 = "Es wurde kein Benutzer mit dieser Email-Adresse gefunden! Bitte registrieren Sie sich zuerst.";

    //------------------------------------------------------------------------------------------------------------------
    //Alert popup Error Registrierung
    var showAlertError = function (title, text) {
        $ionicPopup.alert({
            title: title,
            template: text
        })
    };


    //Alert popup Registrierung successful
    var showAlertCreated = function (username) {
       $ionicPopup.alert({
            title: 'Geschafft!',
            template: 'Dein Konto mit der Email: ' + username + ' wurde erfolgreich erstellt :)'
        })
    };


    //Alert popup Error Login

    var showAlertLogin = function (title, text) {
        $ionicPopup.alert({
            title: title,
            template: text
        })
    };

    //Alert popup login success

    var showAlertLoggedIn = function (authData) {
        $ionicPopup.alert({
            title: 'Willkommen!',
            template: 'Du hast dich erfolgreich mit der Email: ' + authData.password.email + ' eingeloggt :)'
        })
    };

    

    //------------------------------------------------------------------------------------------------------------------
    // Forgot Password
    $scope.resetPW = function (username) {
    myRef.resetPassword({
      email: username
    }, function(error) {
      if (error) {
        switch (error.code) {
          case "INVALID_USER":
            console.log("The specified user account does not exist.");
            $ionicPopup.alert({
                title: 'Fehler!',
                template: 'Konnten keinen Benutzer mit dieser Email finden! '
            })
            break;
          default:
            console.log("Error resetting password:", error);
        }
      } else {
        console.log("Password reset email sent successfully!");
         $ionicPopup.alert({
                title: 'Fertig!',
                template: 'Eine Email mit dem neuen Passwort wurde verschickt! '
            })
      }
    });
    }

//-----------------------------Facebook-Login------------------------------- 
 $scope.loginFB = function() {
      $scope.modal1.hide();
myRef.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
    } else {
        console.log("FB Authdata: "+JSON.stringify(authData.facebook.profileImageURL)); // noch andere Daten auslesen
        $ionicPopup.alert({
            title: 'Willkommen!',
            template: 'Du hast dich erfolgreich eingeloggt :)'
        });
      $scope.currentUserSignedIn =true;
    
                     console.log("current user signed in");
                       }
     },
     
      {
        remember:"sessionOnly",
        scope: "email"   
          
      }
)

};
  
});