import { suite, test } from "@testdeck/mocha";
import { assert } from "chai";

import CodecPackets from "./codecPackets";
import Opus from "../../src/ogg/codecs/opus";
import XiphComment from "../../src/xiph/xiphComment";
import { ByteVector, StringType } from "../../src/byteVector";
import { MediaTypes } from "../../src/properties";
import { Testers } from "../utilities/testers";

@suite
class Ogg_OpusTests {
	@test
	public constructor_invalidParameters() {
		// Act / Assert
		Testers.testTruthy((v: ByteVector) => new Opus(v));
	}

	@test
	public constructor_doesNotStartWithSignature() {
		// Arrange
		const headerPacket = ByteVector.fromString("invalidString", StringType.Latin1);

		// Act / Assert
		assert.throws(() => new Opus(headerPacket));
	}

	@test
	public constructor_rtpChannelMapping_mono() {
		// Arrange
		const headerPacket = ByteVector.concatenate(
			ByteVector.fromString("OpusHead", StringType.UTF8), // Magic header
			0x01, // Version
			0x01, // Channel count
			0x03,
			0x04, // Pre-skip
			0x05,
			0x06,
			0x07,
			0x08, // Original sample rate
			0x09,
			0x0a, // Output gain
			0x00, // Channel mapping family (RTP)
			ByteVector.fromSize(20, 0xbe), // Filler
		);

		// Act
		const codec = new Opus(headerPacket);

		// Assert
		assert.strictEqual(codec.audioBitrate, 0);
		assert.strictEqual(codec.audioSampleRate, 0x08070605);
		assert.strictEqual(codec.audioChannels, 1);
		assert.isUndefined(codec.commentData);
		assert.strictEqual(codec.description, `Opus v1 Audio`);
		assert.strictEqual(codec.durationMilliseconds, 0);
		assert.strictEqual(codec.mediaTypes, MediaTypes.Audio);
		assert.strictEqual(codec.streamCount, 1);
	}

	@test
	public constructor_rtpChannelMapping_stereo() {
		// Arrange
		const headerPacket = ByteVector.concatenate(
			ByteVector.fromString("OpusHead", StringType.UTF8), // Magic header
			0x01, // Version
			0x02, // Channel count
			0x03,
			0x04, // Pre-skip
			0x05,
			0x06,
			0x07,
			0x08, // Original sample rate
			0x09,
			0x0a, // Output gain
			0x00, // Channel mapping family (RTP)
			ByteVector.fromSize(20, 0xbe), // Filler
		);

		// Act
		const codec = new Opus(headerPacket);

		// Assert
		assert.strictEqual(codec.audioBitrate, 0);
		assert.strictEqual(codec.audioSampleRate, 0x08070605);
		assert.strictEqual(codec.audioChannels, 2);
		assert.isUndefined(codec.commentData);
		assert.strictEqual(codec.description, `Opus v1 Audio`);
		assert.strictEqual(codec.durationMilliseconds, 0);
		assert.strictEqual(codec.mediaTypes, MediaTypes.Audio);
		assert.strictEqual(codec.streamCount, 1);
	}

	@test
	public constructor_vorbisChannelMapping() {
		// Arrange
		const headerPacket = ByteVector.concatenate(
			ByteVector.fromString("OpusHead", StringType.UTF8), // Magic header
			0x01, // Version
			0x08, // Channel count
			0x03,
			0x04, // Pre-skip
			0x05,
			0x06,
			0x07,
			0x08, // Original sample rate
			0x09,
			0x0a, // Output gain
			0x01, // Channel mapping family
			0x05, // Stream count 'N'
			0x03, // Two-channel stream count 'M'
		);

		// Act
		const codec = new Opus(headerPacket);

		// Assert
		assert.strictEqual(codec.audioBitrate, 0);
		assert.strictEqual(codec.audioSampleRate, 0x08070605);
		assert.strictEqual(codec.audioChannels, 8);
		assert.isUndefined(codec.commentData);
		assert.strictEqual(codec.description, `Opus v1 Audio`);
		assert.strictEqual(codec.durationMilliseconds, 0);
		assert.strictEqual(codec.mediaTypes, MediaTypes.Audio);
		assert.strictEqual(codec.streamCount, 5);
	}

	@test
	public readPacket_packetIsNotCommentData() {
		// Arrange
		const codec = Ogg_OpusTests.getTestCodec();
		const packet = ByteVector.fromSize(20, 0x0f);

		// Act
		const result = codec.readPacket(packet);

		// Assert
		assert.isFalse(result);
		assert.isUndefined(codec.commentData);
	}

	@test
	public readPacket_packetIsCommentData() {
		// Arrange
		const codec = Ogg_OpusTests.getTestCodec();
		const packet = ByteVector.concatenate(ByteVector.fromString("OpusTags", StringType.UTF8), ByteVector.fromString("foobarbaz", StringType.UTF8));

		// Act
		const result = codec.readPacket(packet);

		// Assert
		assert.isTrue(result);
		Testers.bvEqual(codec.commentData, packet.subarray(8));
	}

	@test
	public readPacket_commentsAlreadyRead() {
		// Arrange
		const codec = Ogg_OpusTests.getTestCodec();
		const commentPacket1 = ByteVector.concatenate(ByteVector.fromString("OpusTags", StringType.UTF8), ByteVector.fromString("foobarbaz", StringType.UTF8));
		const commentPacket2 = ByteVector.concatenate(ByteVector.fromString("OpusTags", StringType.UTF8), ByteVector.fromString("fuxbuxquxx", StringType.UTF8));
		codec.readPacket(commentPacket1);

		// Act
		const result = codec.readPacket(commentPacket2);

		// Assert
		assert.isTrue(result);
		Testers.bvEqual(codec.commentData, commentPacket1.subarray(8));
	}

	@test
	public writeCommentPacket_invalidParameters() {
		// Arrange
		const codec = Ogg_OpusTests.getTestCodec();
		const comment = XiphComment.fromEmpty();

		// Act / Assert
		Testers.testTruthy((v: ByteVector[]) => codec.writeCommentPacket(v, comment));
		Testers.testTruthy((v: XiphComment) => codec.writeCommentPacket([], v));
	}

	@test
	public writeCommentPacket_noPackets() {
		// Arrange
		const codec = Ogg_OpusTests.getTestCodec();
		const comment = XiphComment.fromEmpty();
		const packets: ByteVector[] = [];

		// Act
		codec.writeCommentPacket(packets, comment);

		// Assert
		assert.strictEqual(packets.length, 1);

		const expected = ByteVector.concatenate(ByteVector.fromString("OpusTags", StringType.UTF8), comment.render(true));
		Testers.bvEqual(packets[0], expected);
	}

	@test
	public writeCommentPacket_onePacket() {
		// Arrange
		const codec = Ogg_OpusTests.getTestCodec();
		const comment = XiphComment.fromEmpty();
		const packets = [ByteVector.fromString("OpusHead", StringType.UTF8)];

		// Act
		codec.writeCommentPacket(packets, comment);

		// Assert
		assert.strictEqual(packets.length, 2);

		const expected = ByteVector.concatenate(ByteVector.fromString("OpusTags", StringType.UTF8), comment.render(true));
		Testers.bvEqual(packets[1], expected);
	}

	@test
	public writeCommentPacket_noCommentPackets() {
		// Arrange
		const codec = Ogg_OpusTests.getTestCodec();
		const comment = XiphComment.fromEmpty();
		const packets = [ByteVector.fromSize(10, 0x0c), ByteVector.fromSize(10, 0x0f)];

		// Act
		codec.writeCommentPacket(packets, comment);

		// Assert
		assert.strictEqual(packets.length, 3);

		const expected = ByteVector.concatenate(ByteVector.fromString("OpusTags", StringType.UTF8), comment.render(true));
		Testers.bvEqual(packets[1], expected);
	}

	@test
	public writeCommentPacket_hasCommentPacket() {
		// Arrange
		const codec = Ogg_OpusTests.getTestCodec();
		const comment = XiphComment.fromEmpty();
		const packets = [ByteVector.fromSize(10, 0x0c), ByteVector.fromString("OpusTags", StringType.UTF8), ByteVector.fromSize(10, 0x0f)];

		// Act
		codec.writeCommentPacket(packets, comment);

		// Assert
		assert.strictEqual(packets.length, 3);

		const expected = ByteVector.concatenate(ByteVector.fromString("OpusTags", StringType.UTF8), comment.render(true));
		Testers.bvEqual(packets[1], expected);
	}

	@test
	public setDuration_invalidParameters() {
		// Arrange
		const codec = Ogg_OpusTests.getTestCodec();

		// Act / Assert
		Testers.testTruthy((v: ByteVector) => codec.setDuration(v, ByteVector.fromUlong(123)));
		Testers.testTruthy((v: ByteVector) => codec.setDuration(ByteVector.fromUlong(123), v));

		assert.strictEqual(codec.durationMilliseconds, 0);
	}

	@test
	public setDuration_validParameters() {
		// Arrange
		const codec = Ogg_OpusTests.getTestCodec();
		const first = ByteVector.fromUlong(0, false);
		const last = ByteVector.fromUlong(123456789, false);

		// Act
		codec.setDuration(first, last);

		// Assert
		assert.approximately(codec.durationMilliseconds, 2571995, 0.5);
	}

	private static getTestCodec(): Opus {
		return new Opus(CodecPackets.getTestOpusPacket());
	}
}
