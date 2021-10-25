const fs = require("fs");

class UsersRepository {
  // remember constructor functions get called immediately when we create a new instance of a class
  // as an argument to the constructor, we will expect a filename
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }
    // store the provided filename in an instance variable
    this.filename = filename;
    // check to see if the file exists
    // constructor functions in javascript are not allowed to be asynschronous
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }
  async checkForFile() {}
}

const repo = new UsersRepository("users.json");
