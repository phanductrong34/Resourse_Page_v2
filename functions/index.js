const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

//data là 1 object ta tryền vào
exports.addAdminRole = functions.https.onCall((data,context)=>{
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


//data  = {email: email.value,password: password.value}
exports.createUser = functions.https.onCall((data) => {
    return admin
    .auth()
    .createUser(data)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      // console.log('Successfully created new user:', userRecord.uid);
      return {uid: userRecord.uid}
    })
    .catch((error) => {
      // console.log('Error creating new user:', error);
    });
})


//data  = {uid: "dsdf",email: email.value,password: password.value}
exports.updateUser = functions.https.onCall((data)=>{
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

//data = {uid : "sdfsdfsdf"}
exports.deleteUser = functions.https.onCall((data)=>{
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


// ta lấy user bằng hàm getUserByEmail, sau đó setCustomClaim cho nó là 1 object có data bất kì
// có thể là premium = true cũng đc, input là email, output là message


const {google} = require('googleapis');
const path = require('path')
const fs = require('fs')

/*
//data = {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, filePath, fileName}
exports.uploadVideo = functions.https.onCall((data) => {

    const oauth2Client  = new google.auth.OAuth2(
      data.CLIENT_ID,data.CLIENT_SECRET, data.REDIRECT_URI
    )

    const drive = google.drive({
      version : "v3",
      auth: oauth2Client
    })

    //upload
    drive.files.create({
        requestBody: {
            name: data.fileName,
            mimeType: 'video/mp4'
            
        },
        media:{
            mimeType: "video/mp4",
            body: fs.createReadStream(filePath)
        },
    })
    //lấy fileID để public link
    .then(response => {  
      console.log("upload-data: " + response.data);
      const fileId = response.data.id;
      
      drive.permissions.create({
        fileId : fileID,
        requestBody : {
            role : 'reader',
            type : 'anyone',
        }
      })

    })
    //lấy về link
    .then(()=>{
      drive.files.get({
          fileId : fileID,
          fields : "webViewLink, webContentLink"
      })
    })
    // ==> link trả về đây
    .then((result)=> {
      return {data: result.data} 
    })

    // bắt toàn bộ lỗi
    .catch (error =>{
        console.log(error.message);
    })

})
*/


