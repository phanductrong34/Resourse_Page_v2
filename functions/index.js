const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();


//data là 1 object ta tryền vào
exports.addAdminRole = functions.https.onCall((data,context)=>{
    if (context.auth.token.admin !== true){
      return {error: "You are not admin"}
    }
    // get user amd add custom claims (admin)
    return admin.auth().getUserByEmail(data.email).then((user)=>{
        return admin.auth().setCustomUserClaims(user.uid,{
            admin: true
        })
    }).then(()=>{
        return{
            message: `Succees! ${data.email} has been created as admin`
        }
    }).catch(err => {
        // console.log("err make admin role")
        return err;
    })
})

//data là 1 object {email}
exports.addTeacherRole = functions.https.onCall((data,context)=>{
    if (context.auth.token.admin !== true){
      return {error: "You are not admin"}
    }
    // get user amd add custom claims (admin)
    return admin.auth().getUserByEmail(data.email).then((user)=>{
        return admin.auth().setCustomUserClaims(user.uid,{
            teacher: true
        })
    }).then(()=>{
        return{
            message: `Succees! ${data.email} has been created as teacher`
        }
    }).catch(err => {
        return err;
    })
})


//data  = {email: email.value,password: password.value}
exports.createUser = functions.https.onCall((data,context) => {
    if (context.auth.token.admin !== true){
      return {error: "You are not admin"}
    }
    return admin
    .auth()
    .createUser(data)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      return {uid: userRecord.uid}
    })
    .catch((error) => {
      // console.log('Error creating new user:', error);
    });
})


//data  = {uid: "dsdf",email: email.value,password: password.value}
exports.updateUser = functions.https.onCall((data,context)=>{
    if (context.auth.token.admin !== true){
      return {error: "You are not admin"}
    }
    return admin
    .auth()
    .updateUser(data.uid, {
        email: data.email,
        password: data.password,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      //console.log('Successfully updated user', userRecord.toJSON());
      return {user: userRecord.toJSON() }
    })
    .catch((error) => {
      console.log('Error updating user:', error);
    });
  
})

//data = {uid : "sdfsdfsdf"}  xóa cả work của student này nữa nếu có 
exports.deleteUser = functions.https.onCall((data,context)=>{
    if (context.auth.token.admin !== true){
      return {error: "You are not admin"}
    }
    admin
    .auth()
    .deleteUser(data.uid)
    .then(() => {
      //console.log('Successfully deleted user');
    })
    .catch((error) => {
      console.log('Error deleting user:', error);
    });
  
})

//data = {ids:[userid1, userid2, userid3]}
exports.deleteMultiUser = functions.https.onCall((data,context)=>{
  if (context.auth.token.admin !== true){
    return {error: "You are not admin"}
  }
  data.ids.forEach(id=>{
      admin
      .auth()
      .deleteUser(id)
      .then(() => {
        //console.log('Successfully deleted user');
      })
      .catch((error) => {
        console.log('Error deleting user:', error);
      });
  })
  
})
