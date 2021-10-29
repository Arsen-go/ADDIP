const { MongoError } = require("mongodb");
const { uniqid, ApolloError, AWS } = require("../constants");
const { User, Attachment } = require("../models");
const s3 = new AWS.S3();

class AttachmentRepository {
    static originalS3Path() {
        return "original";
    };

    async createAttachment(input, currentUser) {
        const { id, contentType, pixelWidth, pixelHeight, size, durationSeconds, name } = input;
        const fileId = `${AttachmentRepository.originalS3Path()}/fid${uniqid()}`;

        let owner;
        if (id) {
            owner = await User.findOne({ id });
        }

        if (currentUser) {
            owner = await User.findOne({ id: currentUser.id });
        }

        if (!owner) {
            throw new MongoError("Attachment owner is not found.");
        }

        if (name === "profileImage") {
            const attachment = await Attachment.findOne({ owner: owner.id, name: "profileImage" });
            if (attachment) {
                let params = { Bucket: "drivehop-bucket", Key: attachment.fileId };

                s3.deleteObject(params, (err) => {
                    if (err) console.log(err);
                    else console.log("deleted");
                });
                await Attachment.deleteOne({ owner: owner.id, name: "profileImage" });
            }
        }

        const attachment = new Attachment({
            fileId,
            id: uniqid(),
            createdDate: new Date(),
            owner: owner.id,
            contentType,
            pixelWidth,
            pixelHeight,
            size,
            durationSeconds,
            name
        });

        try {
            const savedAttachment = await attachment.save();
            return savedAttachment.toObject();
        } catch (error) {
            throw new ApolloError(error);
        }
    };

    async downloadLink({ fileId }) {
        const signedUrlExpireSeconds = 3600 * 24 * 360;
        const s3 = new AWS.S3({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });

        const bucketName = process.env.AWS_S3_BUCKET;
        const params = { Bucket: bucketName, Key: `${fileId}`, Expires: signedUrlExpireSeconds };

        try {
            const signedUrl = await new Promise(async (resolve, reject) => {
                s3.getSignedUrl("getObject", params, function (error, url) {
                    if (error) {
                        reject("Error getting presigned url from AWS S3");
                    } else {
                        resolve(url);
                    }
                });
            });
            return signedUrl;
        } catch (error) {
            throw new ApolloError(error.message);
        };
    };

    async uploadLink({ fileId, contentType }) {
        const signedUrlExpireSeconds = 60 * 60;
        const s3 = new AWS.S3({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });

        const bucketName = process.env.AWS_S3_BUCKET;
        const params = { Bucket: bucketName, Key: `${fileId}`, Expires: signedUrlExpireSeconds, ContentType: contentType };

        try {
            const signedUrl = await new Promise(async (resolve, reject) => {
                s3.getSignedUrl("putObject", params, function (error, url) {
                    if (error) {
                        reject("Error getting presigned url from AWS S3");
                    } else {
                        resolve(url);
                    }
                });
            });
            return signedUrl;
        } catch (error) {
            throw new ApolloError(error.message);
        };
    };
};

module.exports = AttachmentRepository;