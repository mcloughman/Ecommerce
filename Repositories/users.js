const fs = require("fs");
const crypto = require("crypto");

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
  // just a note to remember that we used "Sync" methods in the constructor because constructor doesn't take async and also
  // we were only going to need them initially to create the json file
  async getAll() {
    // Open the file called this.filename, read its contents, parse its contents, and returned parsed
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }
  async create(attributes) {
    attributes.id = this.randomId();
    // The below will give you list of users
    const records = await this.getAll();
    records.push(attributes);
    await this.writeAll(records);
    return attributes;
  }
  async writeAll(records) {
    // write the updated array back to this.filename
    await fs.promises.writeFile(
      this.filename,
      // the second arg to json stringify is a custome formatter the third arg is the level of indentation of the string, so with every layer of nesting, we're getting two spaces put down
      JSON.stringify(records, null, 2)
    );
  }
  randomId() {
    // let's use the crypto module in node.js docs
    return crypto.randomBytes(4).toString("hex");
  }
  async getOne(id) {
    const records = await this.getAll();
    // then use the find method instead of writing out a for loop
    return records.find((record) => record.id === id);
  }
  async delete(id) {
    const records = await this.getAll();
    // use filter and return all the records that don't match the id
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }
  async update(id, attributes) {
    const records = await this.getAll();
    // we don't use the getOne method below because we need to save all the records
    const record = await records.find((record) => record.id === id);
    if (!record) {
      throw new Error(`Record with id of ${id} not found!`);
    }
    // assign update
    Object.assign(record, attributes);
    await this.writeAll(records);
  }
  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      let found = true;
      // we need to look through every key value pair of our filters object. We will compare key value in filters object to record object
      // If they are not the same, then we will update found to false
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
}

// better to create the instance here than simply exporting the class and creating the instance elsewhere because let's say you accidentally instantiate user.json instead of users.json and you end up with one of each. Could be problematic
module.exports = new UsersRepository("users.json");
