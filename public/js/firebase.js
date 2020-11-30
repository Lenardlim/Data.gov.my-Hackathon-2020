
/*
______ _____ _____  ______ ____           _____ ______               _____ _______ _____ ____  _   _  _____
|  ____|_   _|  __ \|  ____|  _ \   /\    / ____|  ____|        /\   / ____|__   __|_   _/ __ \| \ | |/ ____|
| |__    | | | |__) | |__  | |_) | /  \  | (___ | |__          /  \ | |       | |    | || |  | |  \| | (___
|  __|   | | |  _  /|  __| |  _ < / /\ \  \___ \|  __|        / /\ \| |       | |    | || |  | | . ` |\___ \
| |     _| |_| | \ \| |____| |_) / ____ \ ____) | |____      / ____ \ |____   | |   _| || |__| | |\  |____) |
|_|    |_____|_|  \_\______|____/_/    \_\_____/|______|    /_/    \_\_____|  |_|  |_____\____/|_| \_|_____/

*/

//Table of Content
// 1. Initialize Firebase



//2. CRUD DB
//2.1. Create document in collection
//2.2. Read
//2.2.1. Read document in collection
//2.2.2 Read entire collection
//2.2.3 Read collection via promise
//2.3. Update
//2.3.1. Update one document in collection
//2.3.2. Batch Update document in collection
//2.3.3. Update Single Field in document
//2.3.4. Update Nested Field
//2.4. Delete
//2.4.1. Delete document
//2.4.2. Delete Nested Field
//2.4.3. Move collection to new location
//2.4.4. Delete file via URL
//3. User management
//3.1. Create user
//3.2. Get current user
//3.3. Sign User In
//3.4. Google sign in
//3.5. Send Reset Password Email

// 1. Initialize Firebase
const config = {
  apiKey: "AIzaSyBdim4ivYZqR7ClP4sWma1UwsabUne6wJ8",
  authDomain: "marketplace-82593.firebaseapp.com",
  databaseURL: "https://marketplace-82593.firebaseio.com",
  projectId: "marketplace-82593",
  storageBucket: "marketplace-82593.appspot.com",
  messagingSenderId: "778457754487",
  appId: "1:778457754487:web:54019607083374a39a0f72"
};
firebase.initializeApp(config);
const secondaryApp=firebase.initializeApp(config,"Secondary");

const fdb = firebase.firestore(); //All searchable data should be here?
const storageRef = firebase.storage().ref();

//2. CRUD DB
//2.1. Create document in collection
function addToDB(collection,object){
  return fdb.collection(collection).add(object)
  // .then(function(docRef) {
  //     console.log("Document written with ID: ", docRef.id);
  // })
  // .catch(function(error) {
  //     console.error("Error adding document: ", error);
  // });
}

//2.2. Read
//2.2.1. Read document in collection
function getDoc(collection,doc){
var docRef = fdb.collection(collection).doc(doc);
docRef.get().then(function(doc) {
    if (doc.exists) {
        return doc.data();
        //console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
}

//2.2.2 Read entire collection
function getCollection(collection){
  console.log("Getting collection")
  fdb.collection(collection).get().then(function(q) {
    q.forEach(function(d) {
        return(d.data())
        console.log(d.data());
    });
  })
}

//2.2.3 Read collection via promise
function promiseCollection(collection){
  return fdb.collection(collection).get()
}

//2.2.4. Get doucment
function getDocument(collection,doc){
  return fdb.collection(collection).doc(doc).get()
}


//2.3. Update
//2.3.1. Update one document in collection
function updateDB(collection,doc,object,notify,date){
  //Auto add meta
  if(date){
    object.date_modified=date;
  }else{
    object.date_modified=Date.now();
  }

  fdb.collection(collection).doc(doc).set(object).then(function() {
      console.log("Document successfully written!");
      if(notify==1){
        alert("Record updated")
      }
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });
}

//2.3.2. Batch Update document in collection
function batchUpdateDB(collection,docs,objects){
if(docs.length==objects.length){
  var batch = fdb.batch();
  var batch_arr=[];
    for(i=0;i<docs.length;i++){
      objects[i].date_modified=Date.now();
      batch.set(fdb.collection(collection).doc(docs[i]),objects[i]);
    }
  //alert("Updated")
    batch.commit().then(function () {
       //alert("Updated")
    });
  }else{
    alert("Something went wrong...")
  }
}

/*Keeping here for reference
// Get a new write batch
var batch = db.batch();

// Set the value of 'NYC'
var nycRef = db.collection("cities").doc("NYC");
batch.set(nycRef, {name: "New York City"});

// Update the population of 'SF'
var sfRef = db.collection("cities").doc("SF");
batch.update(sfRef, {"population": 1000000});

// Delete the city 'LA'
var laRef = db.collection("cities").doc("LA");
batch.delete(laRef);

// Commit the batch
batch.commit().then(function () {
    // ...
});
*/

//2.3.3. Update Single Field in document
function updateSingleDBField(collection,doc,field,value){
     var obj={};
     obj[field]=value;
     fdb.collection(collection).doc(doc).update(obj);
}

//2.3.4. Update Nested Field
function updateNestedField(collection,doc,field,nestedfield,value){
    var obj={};
    obj[field+"."+nestedfield]=value;
    fdb.collection(collection).doc(doc).update(obj);
}


//2.4. Delete
//2.4.1. Delete document
function deleteData(collection,doc,notify){
  console.log(collection)
  console.log(doc)
  fdb.collection(collection).doc(doc).delete().then(function() {
      console.log("Document successfully deleted!");
      if(notify==1){
        alert("Record deleted")
      }
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
}

//2.4.2. Delete Nested Field
function deleteNestedField(collection,doc,field,nestedfield){
  var obj={};
  obj[field+"."+nestedfield]=firebase.firestore.FieldValue.delete();
  fdb.collection(collection).doc(doc).update(obj);
}

//2.4.3. Move collection to new location
function moveData(collection,doc,moveto,obj,notify){
  obj.date_moved=Date.now();
  updateDB(moveto,doc,obj)
  setTimeout(function(){
    deleteData(collection,doc,notify)
  },1000)
}

//2.4.4. Delete file via URL
function deleteFileViaURL(url){
    try{
      var deleteRef = firebase.storage().refFromURL(url)
      deleteRef.delete().then(function() {
         console.log("File deleted successfully");
      }).catch(function(error) {
         console.log("Delete failed:"+error);
      });
    }catch(err){}
}

//3. User management
//3.1. Create user
function createUser(email,password){
  //console.log("Creating user")
  //Creates user using a secondary app so that it doesnt log this user our
  return secondaryApp.auth().createUserWithEmailAndPassword(email,password)
  /*
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(){
      console.log(firebase.auth().currentUser);
  })
  .catch(function(error) {
    alert(error.message);
  });*/
}

//3.2. Get current user
function getCurrentUser(){
  return firebase.auth().currentUser;
}

//3.3. Sign User In
function signUserIn(e,pw){
  firebase.auth().signInWithEmailAndPassword(e,pw).catch(function(error) {
    alert(error.message)
  })
}

//3.4. Google sign in
var provider = new firebase.auth.GoogleAuthProvider();


//3.5. Send Reset Password Email
function sendUserResetEmail(e){
    firebase.auth().sendPasswordResetEmail(e).then(function() {
      // Email sent.
      alert("A password reset email has been sent to "+e+" .Follow the instructions to reset your password.")
    }).catch(function(error) {
      // An error happened.
      alert("An error occured. Please contact your administrator")
    });
}
