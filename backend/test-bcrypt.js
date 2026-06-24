const bcrypt = require('bcryptjs');

async function check() {
  const password = 'Jee@123';
  const userHash = '$2b$10$AusXy85iOWVRkr67qQ.BP.BV5BMKEwwI3JOVyW0IcV7jOwcKypjJu';
  const ownerHash = '$2b$10$/YbLu9W2jE61YtTtGeC0HuDZ1i/0Pp.rF7pte123eHF/DqIFx5DvG';

  const userMatch = await bcrypt.compare(password, userHash);
  const ownerMatch = await bcrypt.compare(password, ownerHash);

  console.log('User Match:', userMatch);
  console.log('Owner Match:', ownerMatch);
}

check();
