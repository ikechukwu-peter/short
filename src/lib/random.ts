class Random {
  constructor() {}
  async generate() {
    let strLength: number = 5;
    let str: string = "";
    let possibleCharacters: string =
      "abcdefghijklmopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let i: number = 0; i < strLength; i++) {
      // Get a random character from the possible character string
      let randomCharacter: string = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      // Append this character to the string
      str += randomCharacter;
    }
    // Return the final string
    return str;
  }
}

let random = new Random();

process.on("message", async (msg: any) => {
  console.log(`Received the message ${msg} from parent`);
  let uniqueUrl = await random.generate();
  if (typeof process.send === "function") {
    process.send(uniqueUrl);
  }
});
