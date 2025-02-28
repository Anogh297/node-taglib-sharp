import { ByteVector, StringType } from "../../src/byteVector";

export default class CodecPackets {
	public static getTestOpusPacket(): ByteVector {
		return ByteVector.concatenate(ByteVector.fromString("OpusHead", StringType.UTF8), 0x01, 0x08, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x01, 0x05, 0x03);
	}

	public static getTestTheoraPacket(): ByteVector {
		return ByteVector.concatenate(
			0x80,
			ByteVector.fromString("theora", StringType.UTF8),
			0x01,
			0x02,
			0x03, // version
			ByteVector.fromUint(0), // Size in macro blocks
			0xf0,
			0x12,
			0x34, // Width in pixels
			0xf0,
			0x45,
			0x67, // Height in pixels
			0x01,
			0x02, // Picture offset in pixels
			ByteVector.fromUint(1234), // Frame rate numerator
			ByteVector.fromUint(2345), // Frame rate denominator
			ByteVector.fromSize(10, 0xff), // Stuff we don't care about
			0xfc,
			0x56,
			0xef, // "last bits" including keyframe granule shift
		);
	}

	public static getTestVorbisPacket(): ByteVector {
		return ByteVector.concatenate(
			0x01,
			ByteVector.fromString("vorbis", StringType.UTF8),
			ByteVector.fromUint(1234, false), // Version
			0x05, // Channels
			ByteVector.fromUint(456789, false), // Sample rate
			ByteVector.fromUint(200000, false), // bitrate max
			ByteVector.fromUint(128000, false), // bitrate nominal
			ByteVector.fromUint(100000, false), // bitrate min
			// We don't care about anything after this
		);
	}
}
