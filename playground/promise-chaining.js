require("../src/db/mongoose");
const User = require("../src/models/user");

// User.findByIdAndUpdate("5fecd39e7e30db40b112ced3", { age: 1 })
//   .then(user => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then(result => {
//     console.log(result);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// using ASYNC AWAIT
const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age }, { new: true });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount("5fecd39e7e30db40b112ced3", 5)
  .then(console.log)
  .catch(console.error);
