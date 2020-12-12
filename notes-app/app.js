// const fs = require('fs')

// fs.writeFileSync('notes.txt', "My name is Atif.");
// fs.appendFileSync('notes.txt', "I am a frontend developer");

// const validator = require('validator')

// console.log(validator.isEmail('abc@xyz.com'));
// console.log(validator.isURL('https://www.google.com'));
// console.log(validator.isURL('http/www.google.com'));

// const chalk = require('chalk')

// console.log(chalk.green.bold.inverse("Success"))

const yargs = require("yargs");
const notes = require("./notes.js");

yargs.command({
  command: "add",
  describe: "Add a new note",
  builder: {
    title: {
      describe: "Note title",
      demandOption: true,
      type: "string"
    },
    body: {
      describe: "Note body",
      demandOption: true,
      type: "string"
    }
  },
  handler(argv) {
    notes.addNote(argv.title, argv.body);
  }
});

yargs.command({
  command: "remove",
  describe: "Removing a note",
  builder: {
    title: {
      describe: "title of note to remove",
      demandOption: true,
      type: "string"
    }
  },
  handler(argv) {
    notes.removeNote(argv.title);
  }
});

yargs.command({
  command: "list",
  describe: "List all notes",
  handler() {
    notes.listNotes();
  }
});

yargs.command({
  command: "read",
  describe: "Read a note",
  builder: {
    title: { describe: "to read a note", demandOption: true, type: "string" }
  },
  handler(argv) {
    notes.readNote(argv.title);
  }
});

yargs.parse();
