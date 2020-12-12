const fs = require("fs");
const chalk = require("chalk");

const addNote = (title, body) => {
  const notes = loadNotes();
  const isDuplicate = notes.some(note => note.title === title);
  if (!isDuplicate) {
    notes.push({ title, body });
    saveNotes(notes);
    console.log(chalk.green.inverse("New note added!"));
  } else {
    console.log(chalk.red.inverse("Note title taken!"));
  }
};

const removeNote = title => {
  const notes = loadNotes();
  const titleIndex = notes.findIndex(note => note.title === title);
  if (titleIndex !== -1) {
    notes.splice(titleIndex, 1);
    saveNotes(notes);
    console.log(chalk.green.inverse("Note removed"));
  } else {
    console.log(chalk.red.inverse("No note removed"));
  }
};

const listNotes = () => {
  const notes = loadNotes();
  console.log(chalk.blue.inverse("Your Notes"));
  notes.forEach(note => {
    console.log(chalk.green(note.title));
  });
};

const readNote = title => {
  const notes = loadNotes();
  const data = notes.find(note => note.title === title);
  debugger;
  if (data !== undefined) {
    console.log(chalk.green(data.title));
    console.log(data.body);
  } else {
    console.log(chalk.red("No note found!"));
  }
};

const saveNotes = data => {
  const dataJSON = JSON.stringify(data);
  fs.writeFileSync("./notes.json", dataJSON);
};

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync("./notes.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

module.exports = {
  addNote,
  removeNote,
  listNotes,
  readNote
};
