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
    // The below will give you list of users
    const records = await this.getAll();
    records.push(attributes);
    await this.writeAll(records);
  }
  async writeAll(records) {
    // write the updated array back to this.filename
    await fs.promises.writeFile(
      this.filename,
      // the second arg to json stringify is a custome formatter the third arg is the level of indentation of the string, so with every layer of nesting, we're getting two spaces put down
      JSON.stringify(records, null, 2)
    );
  }
}

const test = async () => {
  const repo = new UsersRepository("users.json");
  await repo.create({
    email: "test@test.com",
    password: "password",
  });
  const users = await repo.getAll();
  console.log(users);
};

test();