// isMember, isAdmim, title, body, author.username, timestamp, id

const alignMessages = (messages) => {
  const alignLeft = [];
  let prevId = null;
  for (const message of messages) {
    if (prevId) {
      if (message.author.id === prevId) {
        alignLeft.push(alignLeft[alignLeft.length - 1]);
      } else {
        alignLeft.push(!alignLeft[alignLeft.length - 1]);
      }
    } else {
      alignLeft.push(true);
    }
    prevId = message.author.id;
  }

  const alignMessage = alignLeft.map((left) => {
    return left ? "left" : "right";
  });

  return alignMessage;
};

module.exports = alignMessages;
