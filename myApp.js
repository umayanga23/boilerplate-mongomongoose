const mongoose = require('mongoose');
require('dotenv').config({ path: 'MONGO_URL.env' }); 
const MONGO_URI = process.env.MONGO_URI; 
console.log('MONGO_URI:', MONGO_URI);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  w: "majority",
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Define the Schema FIRST
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  age: Number, 
  favoriteFoods: [String], 
});

//  Define the Model AFTER the schema
const Person = mongoose.model('Person', personSchema);

//  Remove duplicate `let Person;`

const createAndSavePerson = (done) => {
  const person = new Person({
    name: "Umayanga Amith",  // Example name
    age: 24,           // Example age
    favoriteFoods: ["Code", "Bugs"], // Example favorite foods
  });

  person.save((err, data) => {
    if (err) return done(err);
    done(null, data); // Pass saved document to callback
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  // Use Model.find() to search for all people with the given name
  Person.find({ name: personName }, (err, data) => {
    if (err) {
      return done(err); // Pass the error to the callback
    }
    done(null, data); // Pass the results to the callback
  });
};

const findOneByFood = (food, done) => {
  // Use Model.findOne() to find a single person with the given food in their favoriteFoods
  Person.findOne({ favoriteFoods: food }, (err, person) => {
    if (err) return done(err);  // Handle error
    done(null, person);         // Return found person (or null if no person is found)
  });
}

findOneByFood('Burrito', (err, person) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Found person:", person); // Log the found person
  }
});
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) return done(err); // Handle any error that may occur
    done(null, person);        // Return the found person to the callback
  });
};

const findEditThenSave = (personId, done) => {
   // Find the person by their _id
   Person.findById(personId, (err, person) => {
    if (err) return done(err);  // If there's an error, pass it to the callback
    
    // Add "hamburger" to the person's favoriteFoods array
    person.favoriteFoods.push('hamburger');

    // Save the updated person document
    person.save((err, updatedPerson) => {
      if (err) return done(err);  // If there's an error saving, pass it to the callback
      done(null, updatedPerson);  // Return the updated person document to the callback
    });
  });

};


const findAndUpdate = (personName, done) => {
  // Use findOneAndUpdate to find a person by their name and update their age
  Person.findOneAndUpdate(
    { name: personName },  // Search filter: find a person with the given name
    { age: 20 },           // Update operation: set the person's age to 20
    { new: true },         // Option to return the updated document
    (err, updatedPerson) => {
      if (err) return done(err);  // If there's an error, pass it to the callback
      done(null, updatedPerson);  // Return the updated person document to the callback
    }
  );
};

const removeById = (personId, done) => {
  // Use findByIdAndRemove to find and remove a person by their _id
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return done(err);  // If there's an error, pass it to the callback
    done(null, removedPerson);  // Return the removed person document to the callback
  });
};
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";  // Replace with the name to remove

  // Use Model.remove() to delete all people with the name 'Mary'
  Person.remove({ name: nameToRemove }, (err, result) => {
    if (err) return done(err);  // Pass the error to the callback
    done(null, result);  // Return the result object, which contains the outcome and count
  });
};
const queryChain = (done) => {
  const foodToSearch = "burrito";  // Replace with the food you want to search for

  // Chain the query helpers to find people, sort them by name, limit the results, select specific fields, and execute
  Person.find({ favoriteFoods: foodToSearch })  // Find people who like 'burrito'
    .sort({ name: 1 })  // Sort the results by name in ascending order
    .limit(2)  // Limit the results to 2 documents
    .select('-age')  // Exclude the 'age' field from the results
    .exec((err, data) => {
      if (err) return done(err);  // Pass the error to the callback
      done(null, data);  // Pass the result data to the callback
    });
};

//  Export the Model
exports.PersonModel = Person;

// Export all functions
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;