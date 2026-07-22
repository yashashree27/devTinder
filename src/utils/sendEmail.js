const { SendEmailCommand } = require( "@aws-sdk/client-ses");
const { sesClient } = require( "./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, subject, mailbody) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${mailbody}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "Hi from yashashree the devtindery",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
    ],
  });
};

const run = async (subject, mailbody) => {
  const sendEmailCommand = createSendEmailCommand(
    "yashashree37252@gmail.com",
    "yashshree@thedevtindery.in", // i can write any anything with my domain name
    subject,
    mailbody
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };