import { suite, test } from "@testdeck/mocha";
import { assert } from "chai";

import SyncData from "../../src/id3v2/syncData";
import TestConstants from "../testConstants";
import { ByteVector } from "../../src/byteVector";
import { Testers } from "../utilities/testers";

@suite
class Id3v2_SyncDataTests {
	@test
	public fromUint_InvalidValues() {
		// Act/Assert
		Testers.testUint((v: number) => {
			SyncData.fromUint(v);
		});
		assert.throws(() => {
			SyncData.fromUint(0xf0000000);
		});
	}

	@test
	public fromUint_Successful() {
		// Act
		const output = SyncData.fromUint(TestConstants.syncedUint);

		// Assert
		Testers.bvEqual(output, TestConstants.syncedUintBytes);
	}

	@test
	public resyncByteVector_FalsyData() {
		// Act/Assert
		assert.throws(() => {
			SyncData.resyncByteVector(null);
		});
		assert.throws(() => {
			SyncData.resyncByteVector(undefined);
		});
	}

	@test
	public resyncByteVector_validData() {
		// Arrange
		const data = ByteVector.concatenate(
			ByteVector.fromSize(10, 0xaa),
			0xff,
			0x00,
			0xff,
			ByteVector.fromSize(11, 0xbb),
			0xff,
			0x00,
			0xff,
			ByteVector.fromSize(9, 0xcc),
			0xff,
			0x00,
			0xe5,
			ByteVector.fromSize(11, 0xdd),
			0xff,
			0x00,
			0xe5,
			ByteVector.fromSize(9, 0xee),
			0xff,
			0x00,
			0x00,
			ByteVector.fromSize(11, 0x11),
			0xff,
			0x00,
			0x00,
			ByteVector.fromSize(9, 0x22),
			0xff,
			0x00,
			0xff,
			0x00,
			0xff,
			ByteVector.fromSize(7, 0x33),
			0xff,
			0x00,
			0xff,
			0x00,
			0xff,
			ByteVector.fromSize(7, 0x33),
		);

		// Act
		const output = SyncData.resyncByteVector(data);

		// Assert
		const expected = ByteVector.concatenate(
			ByteVector.fromSize(10, 0xaa),
			0xff,
			0xff, // Aligned to 2
			ByteVector.fromSize(11, 0xbb),
			0xff,
			0xff, // Not aligned to 2
			ByteVector.fromSize(9, 0xcc),
			0xff,
			0xe5, // Aligned, second byte is 0b111xxxxx
			ByteVector.fromSize(11, 0xdd),
			0xff,
			0xe5, // Not aligned, second byte is 0b111xxxxx
			ByteVector.fromSize(9, 0xee),
			0xff,
			0x00, // Aligned, second byte is 00
			ByteVector.fromSize(11, 0x11),
			0xff,
			0x00, // Not aligned, second byte is 00
			ByteVector.fromSize(9, 0x22),
			0xff,
			0xff,
			0xff, // Multiple bytes
			ByteVector.fromSize(7, 0x33),
			0xff,
			0xff,
			0xff, // Multiple bytes, not aligned
			ByteVector.fromSize(7, 0x33),
		);
		Testers.bvEqual(output, expected);
		assert.isFalse(ByteVector.equals(data, expected));
	}

	@test
	public toUint_FalsyData() {
		// Act/Assert
		Testers.testTruthy((v: ByteVector) => {
			SyncData.toUint(v);
		});
	}

	@test
	public toUint_TooFewBytes() {
		// Arrange
		const input = ByteVector.fromSize(2, 0x10);

		// Act
		const output = SyncData.toUint(input);

		// Assert
		assert.equal(output, 0x810);
	}

	@test
	public toUint_TooManyBytes() {
		// Arrange
		const input = ByteVector.fromSize(6, 0x10);

		// Act
		const output = SyncData.toUint(input);

		// Assert
		assert.equal(output, TestConstants.syncedUint);
	}

	@test
	public toUint_JustRightBytes() {
		// Arrange
		const input = ByteVector.fromSize(4, 0x10);

		// Act
		const output = SyncData.toUint(input);

		// Assert
		assert.equal(output, TestConstants.syncedUint);
	}

	@test
	public unsyncByteVector_falsyData() {
		// Act/Assert
		Testers.testTruthy((v: ByteVector) => {
			SyncData.unsyncByteVector(v);
		});
	}

	@test
	public unsyncByteVector_validData() {
		// Arrange
		const data = ByteVector.concatenate(
			ByteVector.fromSize(10, 0xaa),
			0xff,
			0xff, // Aligned to 2
			ByteVector.fromSize(11, 0xbb),
			0xff,
			0xff, // Not aligned to 2
			ByteVector.fromSize(9, 0xcc),
			0xff,
			0xe5, // Aligned, second byte is 0b111xxxxx
			ByteVector.fromSize(11, 0xdd),
			0xff,
			0xe5, // Not aligned, second byte is 0b111xxxxx
			ByteVector.fromSize(9, 0xee),
			0xff,
			0x00, // Aligned, second byte is 00
			ByteVector.fromSize(11, 0x11),
			0xff,
			0x00, // Not aligned, second byte is 00
			ByteVector.fromSize(9, 0x22),
			0xff,
			0xff,
			0xff, // Multiple bytes
			ByteVector.fromSize(7, 0x33),
			0xff,
			0xff,
			0xff, // Multiple bytes, not aligned
			ByteVector.fromSize(7, 0x33),
		);

		// Act
		const output = SyncData.unsyncByteVector(data);

		// Assert
		const expected = ByteVector.concatenate(
			ByteVector.fromSize(10, 0xaa),
			0xff,
			0x00,
			0xff,
			ByteVector.fromSize(11, 0xbb),
			0xff,
			0x00,
			0xff,
			ByteVector.fromSize(9, 0xcc),
			0xff,
			0x00,
			0xe5,
			ByteVector.fromSize(11, 0xdd),
			0xff,
			0x00,
			0xe5,
			ByteVector.fromSize(9, 0xee),
			0xff,
			0x00,
			0x00,
			ByteVector.fromSize(11, 0x11),
			0xff,
			0x00,
			0x00,
			ByteVector.fromSize(9, 0x22),
			0xff,
			0x00,
			0xff,
			0x00,
			0xff,
			ByteVector.fromSize(7, 0x33),
			0xff,
			0x00,
			0xff,
			0x00,
			0xff,
			ByteVector.fromSize(7, 0x33),
		);
		Testers.bvEqual(output, expected);
		assert.isFalse(ByteVector.equals(data, expected));
	}
}
