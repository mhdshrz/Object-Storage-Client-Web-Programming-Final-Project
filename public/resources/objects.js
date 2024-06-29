export const objects = generateObjects(300, 20);
export const users = "d";

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
      name: getRandomFilename(type),
      type: type,
      date: getRandomDate(startDate, endDate),
      size: getRandomSize(),
      owner: owner,
      download: "https://example.com/download/" + (i + 1),
    });
  }

  return objects;
}
