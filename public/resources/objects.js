const obj = {
  id: 1,
  originalFileName: "Yaavar.mp3",
  fileSize: 12312, // in Bytes,
  uploadDate: "2024-06-29T17:21:40.439Z",
  fileType: "mp3",
  isOwner: true,
  downloadLink: "https://webproject.s3.ir-thr-at1.arvanstorage.ir/some-string",
  // access: true,
};

export const objects = generateObjects(300, 20);
export const users = generateUsers(100);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start, end) {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString();
}

function getRandomSize() {
  return (Math.random() * (10 - 0.1) + 0.1).toFixed(2) + "MB";
}

function getRandomType() {
  const types = [
    "pdf",
    "docx",
    "xlsx",
    "jpg",
    "png",
    "txt",
    "mp4",
    "mp3",
    "jpeg",
  ];
  return types[Math.floor(Math.random() * types.length)];
}

function getRandomOwner() {
  const owners = [
    "alice",
    "bob",
    "charlie",
    "david",
    "mhdshrz",
    "eve",
    "frank",
  ];
  return owners[Math.floor(Math.random() * owners.length)];
}

function getRandomFilename(type) {
  const filenames = {
    pdf: ["report", "document", "ebook", "manual", "invoice"],
    docx: ["letter", "resume", "thesis", "essay", "proposal"],
    xlsx: ["spreadsheet", "budget", "data", "report", "analysis"],
    jpg: ["photo", "image", "picture", "snapshot", "portrait"],
    png: ["graphic", "icon", "logo", "design", "illustration"],
    txt: ["notes", "log", "readme", "info", "data"],
    mp4: ["video", "movie", "clip", "recording", "footage"],
    mp3: [
      "Yaavar",
      "Losing My Religion",
      "Hotel California",
      "Jashn e Deltangi",
      "Now We Are Free",
    ],
    jpeg: ["friends", "me", "dad", "mom", "mom and dad", "rebecca", "alex"],
  };

  return (
    filenames[type][Math.floor(Math.random() * filenames[type].length)] +
    "." +
    type
  );
}

function generateObjects(count, ownerCount) {
  const objects = [];
  const startDate = new Date(2023, 0, 1);
  const endDate = new Date(2025, 0, 1);

  for (let i = 0; i < count; i++) {
    const type = getRandomType();
    const owner = i < ownerCount ? "mhdshrz" : getRandomOwner();

    objects.push({
      id: i + 1,
      originalFileName: getRandomFilename(type),
      fileType: type,
      uploadDate: getRandomDate(startDate, endDate),
      fileSize: getRandomSize(),
      isOwner: Math.random() < 0.3,
      downloadLink: "https://example.com/download/" + (i + 1),
    });
  }

  return objects;
}

// for users
function generateRandomString(length) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateRandomName() {
  const firstNames = [
    "John",
    "Jane",
    "Alex",
    "Chris",
    "Katie",
    "Mahdi",
    "Rebecca",
    "Jennifer",
    "Alice",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Shirazi",
    "Emma",
    "Jackson",
    "Gosling",
    "Reynolds",
    "Rogers",
  ];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

function generateRandomEmail(username) {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "example.com"];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
}

function generateRandomPictureUrl() {
  const urls = [
    "/users/alice-emma.png",
    "/users/anne-jennifer.png",
    "/users/bush-matthew.png",
    "/users/dummy-avatar.png",
    "/users/george-michael.png",
    "/users/henry-rebecca.png",
    "/users/robert-laura.png",
    "/users/sarah-elizabeth.png",
  ];
  return urls[Math.floor(Math.random() * urls.length)];
}

function generateUser(id) {
  const username = generateRandomString(7);
  const name = generateRandomName();
  const email = generateRandomEmail(username);
  const picture = generateRandomPictureUrl();
  const emailVerified = Math.random() < 0.5;
  const access = Math.random() < 0.1;

  return {
    id: id,
    username: username,
    name: name,
    email: email,
    picture: picture,
    emailVerified: emailVerified,
    access: access,
  };
}

function generateUsers(number) {
  const users = [];
  for (let i = 0; i < number; i++) {
    users.push(generateUser(i + 1));
  }
  return users;
}

// console.log(users);
