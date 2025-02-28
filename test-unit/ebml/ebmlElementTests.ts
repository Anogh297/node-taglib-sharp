import { suite, test } from "@testdeck/mocha";
import { assert } from "chai";

import EbmlElement from "../../src/ebml/ebmlElement";
import TestFile from "../utilities/testFile";
import { File } from "../../src/file";
import { Testers } from "../utilities/testers";

@suite
class Ebml_ElementTests {
	@test
	public constructor_falsyFile() {
		Testers.testTruthy((f: File) => new EbmlElement(f, 0, 0, 0, {}));
	}

	@test
	public constructor_invalidOffset() {
		Testers.testSafeUint((o: number) => new EbmlElement(TestFile.mockFile(), o, 0, 0, {}));
	}

	@test
	public constructor_invalidSize() {
		Testers.testSafeUint((s: number) => new EbmlElement(TestFile.mockFile(), 0, 0, s, {}));
	}

	@test
	public constructor_valid() {
		// Act
		const element = new EbmlElement(TestFile.mockFile(), 0, 888, 123, {});

		// Assert
		assert.strictEqual(element.id, 888);
		assert.strictEqual(element.isLoaded, false);
		assert.strictEqual(element.length, 123);
	}

	@test
	public loads_isLoaded() {
		// Arrange
		const bytes = [0x01];
		const element = new EbmlElement(TestFile.getFile(bytes), 0, 0, 1, {});

		// Act 1
		element.load();

		// Assert 1
		assert.isTrue(element.isLoaded);

		// Act 1
		element.load();

		// Assert 1
		assert.isTrue(element.isLoaded);
	}

	@test
	public getBool() {
		const testCases = [
			{ bytes: [0x01], result: true },
			{ bytes: [0x11], result: true },
			{ bytes: [0x00], result: false },
		];

		for (const t of testCases) {
			// Arrange
			const element = new EbmlElement(TestFile.getFile(t.bytes), 0, 0, t.bytes.length, {});

			// Act
			const result = element.getBool();

			// Assert
			assert.strictEqual(result, t.result);
			assert.isTrue(element.isLoaded);
		}
	}

	@test
	public getBytes_noOffset() {
		// Arrange
		const bytes = [0x01, 0x02, 0x03, 0xaa, 0xbb, 0xcc];
		const element = new EbmlElement(TestFile.getFile(bytes), 0, 0, bytes.length, {});

		// Act
		const result = element.getBytes();

		// Assert
		Testers.bvEqual(result, bytes);
		assert.isTrue(element.isLoaded);
	}

	@test
	public getBytes_withOffset() {
		// Arrange
		const bytes = [0x01, 0x02, 0x03, 0xaa, 0xbb, 0xcc];
		const element = new EbmlElement(TestFile.getFile(bytes), 3, 0, 3, {});

		// Act
		const result = element.getBytes();

		// Assert
		Testers.bvEqual(result, bytes.slice(3));
		assert.isTrue(element.isLoaded);
	}

	@test
	public getDouble() {
		const testCases = [
			{ bytes: [0x40, 0x09, 0x21, 0xfb, 0x54, 0x2f, 0xe9, 0x38], result: 3.141592653 },
			{ bytes: [0x40, 0x49, 0x0f, 0xdb], result: 3.1415927410125732 },
		];
		for (const tc of testCases) {
			// Arrange
			const element = new EbmlElement(TestFile.getFile(tc.bytes), 0, 0, tc.bytes.length, {});

			// Act
			const result = element.getDouble();

			// Assert
			assert.strictEqual(result, tc.result);
			assert.isTrue(element.isLoaded);
		}
	}

	@test
	public getDouble_invalid() {
		const testCases = [
			{ bytes: new Array(2) }, // too short
			{ bytes: new Array(9) }, // too long
			{ bytes: new Array(6) }, // in between
		];
		for (const tc of testCases) {
			// Arrange
			const element = new EbmlElement(TestFile.getFile(tc.bytes), 0, 0, tc.bytes.length, {});

			// Act / Assert
			assert.throws(() => element.getDouble());
			assert.isTrue(element.isLoaded);
		}
	}

	@test
	public getParser() {
		// Arrange
		const bytes = [
			0x00,
			0x00,
			0x00, // Offset
			0x01,
			0x02,
			0x03, // Data
		];
		const element = new EbmlElement(TestFile.getFile(bytes), 3, 0, bytes.length, {});

		// Act
		const parser = element.getParser();

		// Assert
		assert.isOk(parser);
		assert.strictEqual(parser["_offset"], 3);
		assert.isUndefined(parser["_currentElement"]);
	}

	@test
	public getString() {
		const testCases = [
			{ bytes: [0x61, 0x62, 0x63, 0x00, 0x61, 0x62, 0x63], result: "abc" },
			{ bytes: [0x61, 0x62, 0x63, 0x61, 0x62, 0x63], result: "abcabc" },
		];
		for (const tc of testCases) {
			// Arrange
			const element = new EbmlElement(TestFile.getFile(tc.bytes), 0, 0, tc.bytes.length, {});

			// Act
			const result = element.getString();

			// Assert
			assert.strictEqual(result, tc.result);
			assert.isTrue(element.isLoaded);
		}
	}

	@test
	public getSafeUint() {
		const testCases = [
			{ bytes: [0xa1], result: 0xa1 },
			{ bytes: [0xa1, 0x00], result: 0xa100 },
			{ bytes: [0xa1, 0x00, 0x00], result: 0xa10000 },
			{ bytes: [0xa1, 0x00, 0x00, 0x00], result: 0xa1000000 },
			{ bytes: [0xa1, 0x00, 0x00, 0x00], result: 0xa1000000 },
			{ bytes: [0x1f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff], result: 9007199254740991 },
		];
		for (const tc of testCases) {
			// Arrange
			const element = new EbmlElement(TestFile.getFile(tc.bytes), 0, 0, tc.bytes.length, {});

			// Act
			const result = element.getSafeUint();

			// Assert
			assert.strictEqual(result, tc.result);
			assert.isTrue(element.isLoaded);
		}
	}

	@test
	public getSafeUint_invalid() {
		// Arrange
		const bytes = [0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
		const element = new EbmlElement(TestFile.getFile(bytes), 0, 0, bytes.length, {});

		// Act / Assert
		assert.throws(() => element.getSafeUint());
	}

	@test
	public getUlong() {
		const testCases = [
			{ bytes: [0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], result: BigInt("0x20000000000000") },
			{ bytes: [0xa1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xa1], result: BigInt("0xA1000000000000A1") },
		];
		for (const tc of testCases) {
			// Arrange
			const element = new EbmlElement(TestFile.getFile(tc.bytes), 0, 0, tc.bytes.length, {});

			// Act
			const result = element.getUlong();

			// Assert
			assert.strictEqual(result, tc.result);
			assert.isTrue(element.isLoaded);
		}
	}
}
