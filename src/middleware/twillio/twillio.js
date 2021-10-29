// require("dotenv").config();
// const { Twilio } = require("../../constants");
// const accountSid = process.env.TWILLIO_SID;
// const authToken = process.env.TWILLIO_TOKEN;

// const twillio = Twilio(accountSid, authToken);

// const AccessToken = Twilio.jwt.AccessToken;
// const VoiceGrant = AccessToken.VoiceGrant;

// class TwilioTokenGenerator {
//   static jwt(id) {
//     const outgoingApplicationSid = process.env.TWILLIO_APP_SID;

//     return this._jwtFromApplicationSid(id, outgoingApplicationSid);
//   }

//   static conferencejwt(id) {
//     const outgoingApplicationSid = process.env.TWILLIO_CONFERENCE_APP_SID;

//     return this._jwtFromApplicationSid(id, outgoingApplicationSid);
//   }

//   static sendMessage(to, registrationCode) {
//     twillio.messages
//       .create({
//         body: registrationCode,
//         from: "twillio num",
//         to: to,
//       })
//       .then((message) => console.log(message.sid));
//   }

//   static _jwtFromApplicationSid(id, outgoingApplicationSid) {
//     // Used when generating any kind of tokens
//     const accountSid = process.env.TWILLIO_SID;
//     const apiKey = process.env.TWILLIO_VOICE_TOKEN;
//     const apiSecret = process.env.TWILLIO_VOICE_SECRET;

//     // Used specifically for creating Voice tokens
//     const pushCredSid = process.env.TWILLIO_PUSH_SID;
//     // Create an access token which we will sign and return to the client,
//     // containing the grant we just created
//     const voiceGrant = new VoiceGrant({
//       outgoingApplicationSid: outgoingApplicationSid,
//       pushCredentialSid: pushCredSid,
//     });

//     // const voiceGrant = new VoiceGrant();

//     // Create an access token which we will sign and return to the client,
//     // containing the grant we just created
//     const token = new AccessToken(accountSid, apiKey, apiSecret);
//     token.addGrant(voiceGrant);
//     token.identity = id;

//     return token.toJwt();
//   }
// }

// module.exports = {
//   twillio,
//   TwilioTokenGenerator,
// };
