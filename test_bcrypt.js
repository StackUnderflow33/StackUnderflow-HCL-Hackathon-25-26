const bcrypt = require('bcryptjs');

const raw = 'admin123';
const hash = '$2a$10$fV2hJ7b/.R27Hn6S.vYf1.tK8b5u5p1w3g9rFdL2rF8/g3wV5fUqC';

bcrypt.compare(raw, hash).then((res) => {
    console.log("Match:", res);
});
