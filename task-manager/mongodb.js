const { MongoClient, ObjectID } = require("mongodb");

/* MongoClient will give us access to the functions necessary to connect to the DB so that we can perform the CRUD operations
    ObjectID will allows us to generate our own ids here from this file
*/

// Defining the connection URL and the DB we are trying to connect to
const connectionURL = "mongodb://127.0.0.1:27017"; // usning "localhost" causes problems so use IP
const databaseName = "task-manager";

// Connect to the specifif server
MongoClient.connect(
  connectionURL,
  { useUnifiedTopology: true },
  (error, client) => {
    // called when we are connected to the DB
    if (error) return console.error("unable to connect to the database!");

    // Connecting to the specific DB
    const db = client.db(databaseName);

    /******INSERTING DATA TO DB ******/

    // inserting one document to the connectd DB
    // db.collection("users").insertOne(
    //   { name: "Atif", age: 28 },
    //   (error, result) => {
    //     if (error) return console.error("Unable to insert user!");

    //     console.log(result.ops);
    //   }
    // );

    // inserting many docs
    // db.collection("users").insertMany(
    //   [
    //     { name: "Jen", age: 29 },
    //     { name: "Gunther", age: 30 }
    //   ],
    //   (error, result) => {
    //     if (error) return console.error("Unable to insert users!");

    //     console.log(result.ops);
    //   }
    // );

    // Create new collection and insert 3 docs
    // db.collection("tasks").insertMany(
    //   [
    //     { description: "a", completed: true },
    //     { description: "b", completed: false },
    //     { description: "c", completed: true }
    //   ],
    //   (error, result) => {
    //     if (error) return console.error("Unable to insert tasks!");

    //     console.log(result.ops);
    //   }
    // );

    /******GETTING DATA FROM DB******/

    // Finding one data with name
    // db.collection("users").findOne({ name: "Jen" }, (error, user) => {
    //   if (error) return console.error("Unable to fetch!");

    //   console.log(user);
    // });

    // Finding one data with name and age
    // db.collection("users").findOne({ name: "Jen", age: 12 }, (error, user) => {
    //   if (error) return console.error("Unable to fetch!");

    //   console.log(user);
    // });

    // Finding one data with ObjectId
    // db.collection("users").findOne(
    //   { _id: new ObjectID("5fe9956f5208d62533e5ae3e") },
    //   (error, user) => {
    //     if (error) return console.error("Unable to fetch!");

    //     console.log(user);
    //   }
    // );

    // Finding many records that match the criteria
    // db.collection("users")
    //   .find({ age: 28 })
    //   .toArray((error, user) => {
    //     if (error) return console.error("Unable to fetch!");

    //     console.log(user);
    //   });

    // returns the count of matching data
    // db.collection("users")
    //   .find({ age: 28 })
    //   .count((error, count) => {
    //     if (error) return console.error("Unable to fetch!");

    //     console.log(count);
    //   });

    /******UPDATE DATA USING PROMISE******/

    //Update name using _id
    // db.collection("users")
    //   .updateOne(
    //     { _id: ObjectID("5fe9990c706ea128744517c8") },
    //     {
    //       $set: { name: "Mike" }
    //     }
    //   )
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    // Increment age using _id
    // db.collection("users")
    //   .updateOne(
    //     { _id: ObjectID("5fe9990c706ea128744517c8") },
    //     {
    //       $inc: { age: 1 }
    //     }
    //   )
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    //Update many
    // db.collection("tasks")
    //   .updateMany({ completed: false }, { $set: { completed: true } })
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    /******DELETING DATA FROM DB******/

    // Delete Many
    // db.collection("users")
    //   .deleteMany({ age: 30 })
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    // Delete One
    db.collection("tasks")
      .deleteOne({ description: "b" })
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }
);
