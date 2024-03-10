import { suite, test } from "@testdeck/mocha";
import { assert } from "chai";

import EbmlElement from "../../src/ebml/ebmlElement";
import EbmlParser from "../../src/ebml/ebmlParser";
import TestFile from "../utilities/testFile";
import { ByteVector } from "../../src/byteVector";
import { File } from "../../src/file";
import { Allow, Testers } from "../utilities/testers";

@suite
class Ebml_ParserTests {
	private static TEST_BYTES = [
		0x00,
		0x00,
		0x00,
		0x00, // Buffer
		0x42,
		0x86, // Identifier (EBMLVersion)
		0x81, // Size (1)
		0x01, // Value (1)
		0x42,
		0xf7, // Identifier (EBMLReadVersion)
		0x81, // Size (1)
		0x01, // Value (1)
		0x42,
		0xf2, // Identifier (EBMLMaxIDLength)
		0x81, // Size (1)
		0x04, // Value (4)
		0x42,
		0xf3, // Identifier (EBMLMaxSizeLength)
		0x81, // Size (1)
		0x08, // Value (8)
		0x42,
		0x82, // Identifier (DocType)
		0x84, // Size (4)
		0x77,
		0x65,
		0x62,
		0x6d, // Value (webm)
		0x42,
		0x87, // Identifier (DocTypeVersion)
		0x81, // Size (1)
		0x04, // Value (4)
		0x42,
		0x85, // Identifier (DocTypeReadVersion)
		0x81, // Size (1)
		0x02, // Value (2)
	];

	@test
	public constructor_invalidParams() {
		// Act / Assert
		Testers.testTruthy((f: File) => new EbmlParser(f, 0, 123));
		Testers.testSafeUint((o: number) => new EbmlParser(TestFile.mockFile(), o, 123));
		Testers.testSafeUint((o: number) => new EbmlParser(TestFile.mockFile(), 0, o));
	}

	@test
	public constructor_invalidOptions() {
		// Act / Asssert
		Testers.testSafeUint((o: number) => {
			const options = { maxIdLength: o };
			const _ = new EbmlParser(TestFile.mockFile(), 0, 123, options);
		}, Allow.Undefined | Allow.Null);

		Testers.testSafeUint((o: number) => {
			const options = { maxSizeLength: o };
			const _ = new EbmlParser(TestFile.mockFile(), 0, 123, options);
		}, Allow.Undefined | Allow.Null);
	}

	@test
	public constructor_unsupportedOptions() {
		// Arrange 1
		const options1 = { maxIdLength: 16 };

		// Act / Assert 1
		assert.throws(() => new EbmlParser(TestFile.mockFile(), 0, 123, options1));

		// Arrange 2
		const options2 = { maxSizeLength: 16 };

		// Act / Assert 2
		assert.throws(() => new EbmlParser(TestFile.mockFile(), 0, 123, options2));
	}

	@test
	public constructor_validNoOptions() {
		// Act
		const parser = new EbmlParser(TestFile.mockFile(), 0, 123);

		// Assert
		assert.strictEqual(parser.currentElement, undefined);
		assert.strictEqual(parser["_offset"], 0);
		assert.strictEqual(parser["_maxOffset"], 123);
		assert.strictEqual(parser["_options"].maxSizeLength, 8);
		assert.strictEqual(parser["_options"].maxIdLength, 4);
	}

	@test
	public constructor_validWithOptions() {
		// Arrange
		const options = {
			maxSizeLength: 3,
			maxIdLength: 5,
		};

		// Act
		const parser = new EbmlParser(TestFile.mockFile(), 0, 123, options);

		// Assert
		assert.strictEqual(parser.currentElement, undefined);
		assert.strictEqual(parser["_offset"], 0);
		assert.strictEqual(parser["_maxOffset"], 123);
		assert.strictEqual(parser["_options"].maxSizeLength, 3);
		assert.strictEqual(parser["_options"].maxIdLength, 5);
	}

	@test
	public read() {
		// Arrange
		const parser = this.getTestParser(Ebml_ParserTests.TEST_BYTES, 4);

		// Read 1
		assert.isTrue(parser.read());
		assert.strictEqual(parser["_offset"], 8);

		let element = parser.currentElement;
		assert.isOk(element);
		assert.strictEqual(element.id, 0x4286);
		assert.strictEqual(element.length, 1);
		assert.strictEqual(element["_dataOffset"], 7);

		// Read 2
		assert.isTrue(parser.read());
		assert.strictEqual(parser["_offset"], 12);

		element = parser.currentElement;
		assert.isOk(element);
		assert.strictEqual(element.id, 0x42f7);
		assert.strictEqual(element.length, 1);
		assert.strictEqual(element["_dataOffset"], 11);

		// Read 3
		assert.isTrue(parser.read());
		assert.strictEqual(parser["_offset"], 16);

		element = parser.currentElement;
		assert.isOk(element);
		assert.strictEqual(element.id, 0x42f2);
		assert.strictEqual(element.length, 1);
		assert.strictEqual(element["_dataOffset"], 15);

		// Read 4
		assert.isTrue(parser.read());
		assert.strictEqual(parser["_offset"], 20);

		element = parser.currentElement;
		assert.isOk(element);
		assert.strictEqual(element.id, 0x42f3);
		assert.strictEqual(element.length, 1);
		assert.strictEqual(element["_dataOffset"], 19);

		// Read 5
		assert.isTrue(parser.read());
		assert.strictEqual(parser["_offset"], 27);

		element = parser.currentElement;
		assert.isOk(element);
		assert.strictEqual(element.id, 0x4282);
		assert.strictEqual(element.length, 4);
		assert.strictEqual(element["_dataOffset"], 23);

		// Read 6
		assert.isTrue(parser.read());
		assert.strictEqual(parser["_offset"], 31);

		element = parser.currentElement;
		assert.isOk(element);
		assert.strictEqual(element.id, 0x4287);
		assert.strictEqual(element.length, 1);
		assert.strictEqual(element["_dataOffset"], 30);

		// Read 7
		assert.isTrue(parser.read());
		assert.strictEqual(parser["_offset"], 35);

		element = parser.currentElement;
		assert.isOk(element);
		assert.strictEqual(element.id, 0x4285);
		assert.strictEqual(element.length, 1);
		assert.strictEqual(element["_dataOffset"], 34);

		// Read 8
		assert.isFalse(parser.read());
		assert.strictEqual(parser.currentElement, element);
	}

	@test
	public readAllValues() {
		// Arrange
		const parser = this.getTestParser(Ebml_ParserTests.TEST_BYTES, 4);

		// Act
		const elements = EbmlParser.getAllElements(parser);

		// Assert
		assert.isOk(elements);
		assert.strictEqual(elements.size, 7);

		let element = elements.get(0x4286);
		assert.strictEqual(element.id, 0x4286);
		assert.strictEqual(element.length, 1);
		assert.strictEqual(element["_dataOffset"], 7);

		element = elements.get(0x42f7);
		assert.strictEqual(element.id, 0x42f7);
		assert.strictEqual(element.length, 1);
		assert.strictEqual(element["_dataOffset"], 11);

		element = elements.get(0x42f2);
		assert.strictEqual(element.id, 0x42f2);
		assert.strictEqual(element.length, 1);
		assert.strictEqual(element["_dataOffset"], 15);

		element = elements.get(0x42f3);
		assert.strictEqual(element.id, 0x42f3);
		assert.strictEqual(element.length, 1);
		assert.strictEqual(element["_dataOffset"], 19);

		element = elements.get(0x4282);
		assert.strictEqual(element.id, 0x4282);
		assert.strictEqual(element.length, 4);
		assert.strictEqual(element["_dataOffset"], 23);

		element = elements.get(0x4287);
		assert.strictEqual(element.id, 0x4287);
		assert.strictEqual(element.length, 1);
		assert.strictEqual(element["_dataOffset"], 30);

		element = elements.get(0x4285);
		assert.strictEqual(element.id, 0x4285);
		assert.strictEqual(element.length, 1);
		assert.strictEqual(element["_dataOffset"], 34);
	}

	@test
	public processElements() {
		// Arrange
		const parser = this.getTestParser(Ebml_ParserTests.TEST_BYTES, 4);
		const validation = [false, false, false, false, false, false, false, true];

		const actions = new Map<number, (e: EbmlElement) => void>([
			[
				0x4286,
				(e) => {
					assert.strictEqual(e.id, 0x4286);
					validation[0] = true;
				},
			],
			[
				0x42f7,
				(e) => {
					assert.strictEqual(e.id, 0x42f7);
					validation[1] = true;
				},
			],
			[
				0x42f2,
				(e) => {
					assert.strictEqual(e.id, 0x42f2);
					validation[2] = true;
				},
			],
			[
				0x42f3,
				(e) => {
					assert.strictEqual(e.id, 0x42f3);
					validation[3] = true;
				},
			],
			[
				0x4282,
				(e) => {
					assert.strictEqual(e.id, 0x4282);
					validation[4] = true;
				},
			],
			[
				0x4287,
				(e) => {
					assert.strictEqual(e.id, 0x4287);
					validation[5] = true;
				},
			],
			[
				0x4285,
				(e) => {
					assert.strictEqual(e.id, 0x4285);
					validation[6] = true;
				},
			],
			[
				0x1234,
				(e) => {
					validation[7] = false;
				},
			],
		]);

		// Act
		EbmlParser.processElements(parser, actions);

		// Assert
		const expected = new Array(8).fill(true);
		assert.sameOrderedMembers(validation, expected);
	}

	@test
	public readVariableInteger_1ByteValue() {
		// Arrange
		const parser = this.getTestParser([0xbb]);

		// Act
		const result = parser["readVariableInteger"](8);

		// Assert
		assert.isOk(result);
		assert.strictEqual(result.bytes, 1);
		assert.strictEqual(result.value, 0x3b);
	}

	@test
	public readVariableInteger_2ByteValue() {
		// Arrange
		const parser = this.getTestParser([0x6a, 0xaa]);

		// Act
		const result = parser["readVariableInteger"](8);

		// Assert
		assert.isOk(result);
		assert.strictEqual(result.bytes, 2);
		assert.strictEqual(result.value, 0x2aaa);
	}

	@test
	public readVariableInteger_3ByteValue() {
		// Arrange
		const parser = this.getTestParser([0x36, 0x7a, 0xa5]);

		// Act
		const result = parser["readVariableInteger"](8);

		// Assert
		assert.isOk(result);
		assert.strictEqual(result.bytes, 3);
		assert.strictEqual(result.value, 0x167aa5);
	}

	@test
	public readVariableInteger_4ByteValue() {
		// Arrange
		const parser = this.getTestParser([0x1c, 0x16, 0x7a, 0xa5]);

		// Act
		const result = parser["readVariableInteger"](8);

		// Assert
		assert.isOk(result);
		assert.strictEqual(result.bytes, 4);
		assert.strictEqual(result.value, 0x0c167aa5);
	}

	@test
	public readVariableInteger_5ByteValue() {
		// Arrange
		const parser = this.getTestParser([0x0e, 0x6c, 0x16, 0x7a, 0xa5]);

		// Act
		const result = parser["readVariableInteger"](8);

		// Assert
		assert.isOk(result);
		assert.strictEqual(result.bytes, 5);
		assert.strictEqual(result.value, 0x066c167aa5);
	}

	@test
	public readVariableInteger_6ByteValue() {
		// Arrange
		const parser = this.getTestParser([0x07, 0x28, 0x6c, 0x16, 0x7a, 0xa5]);

		// Act
		const result = parser["readVariableInteger"](8);

		// Assert
		assert.isOk(result);
		assert.strictEqual(result.bytes, 6);
		assert.strictEqual(result.value, 0x03286c167aa5);
	}

	@test
	public readVariableInteger_7ByteValue() {
		// Arrange
		const parser = this.getTestParser([0x03, 0x63, 0x28, 0x6c, 0x16, 0x7a, 0xa5]);

		// Act
		const result = parser["readVariableInteger"](8);

		// Assert
		assert.isOk(result);
		assert.strictEqual(result.bytes, 7);
		assert.strictEqual(result.value, 0x0163286c167aa5);
	}

	@test
	public readVariableInteger_8ByteValue() {
		// Arrange
		const parser = this.getTestParser([0x01, 0x0f, 0x63, 0x28, 0x6c, 0x16, 0x7a, 0xa5]);

		// Act
		const result = parser["readVariableInteger"](8);

		// Assert
		assert.isOk(result);
		assert.strictEqual(result.bytes, 8);
		assert.strictEqual(result.value, 0x0f63286c167aa5);
	}

	@test
	public readVariableInteger_overflow() {
		// Arrange
		const parser = this.getTestParser([0x01, 0x1f, 0x63, 0x28, 0x6c, 0x16, 0x7a, 0xa5]);

		// Act / Assert
		assert.throws(() => parser["readVariableInteger"](8));
	}

	@test
	public readVariableInteger_tooFewBytes() {
		// Arrange
		const parser = this.getTestParser([0x01, 0x1f, 0x63, 0x28, 0x6c, 0x16, 0x7a]);

		// Act / Assert
		assert.throws(() => parser["readVariableInteger"](8));
	}

	@test
	public renderVariableInteger_1ByteValue() {
		// Arrange
		const parser = this.getTestParser([], 0);

		// Act
		const result = parser["renderVariableInteger"](0x3b);

		// Assert
		Testers.bvEqual(result, [0xbb]);
	}

	@test
	public renderVariableInteger_2ByteValue() {
		// Arrange
		const parser = this.getTestParser([], 0);

		// Act
		const result = parser["renderVariableInteger"](0x2aaa);

		// Assert
		Testers.bvEqual(result, [0x6a, 0xaa]);
	}

	@test
	public renderVariableInteger_3ByteValue() {
		// Arrange
		const parser = this.getTestParser([], 0);

		// Act
		const result = parser["renderVariableInteger"](0x167aa5);

		// Assert
		Testers.bvEqual(result, [0x36, 0x7a, 0xa5]);
	}

	@test
	public renderVariableInteger_4ByteValue() {
		// Arrange
		const parser = this.getTestParser([], 0);

		// Act
		const result = parser["renderVariableInteger"](0x0c167aa5);

		// Assert
		Testers.bvEqual(result, [0x1c, 0x16, 0x7a, 0xa5]);
	}

	@test
	public renderVariableInteger_5ByteValue() {
		// Arrange
		const parser = this.getTestParser([], 0);

		// Act
		const result = parser["renderVariableInteger"](0x066c167aa5);

		// Assert
		Testers.bvEqual(result, [0x0e, 0x6c, 0x16, 0x7a, 0xa5]);
	}

	@test
	public renderVariableInteger_6ByteValue() {
		// Arrange
		const parser = this.getTestParser([], 0);

		// Act
		const result = parser["renderVariableInteger"](0x03286c167aa5);

		// Assert
		Testers.bvEqual(result, [0x07, 0x28, 0x6c, 0x16, 0x7a, 0xa5]);
	}

	@test
	public renderVariableInteger_7ByteValue() {
		// Arrange
		const parser = this.getTestParser([], 0);

		// Act
		const result = parser["renderVariableInteger"](0x0163286c167aa5);

		// Assert
		Testers.bvEqual(result, [0x03, 0x63, 0x28, 0x6c, 0x16, 0x7a, 0xa5]);
	}

	@test
	public renderVariableInteger_8ByteValue() {
		// Arrange
		const parser = this.getTestParser([], 0);

		// Act
		const result = parser["renderVariableInteger"](0x0f63286c167aa5);

		// Assert
		Testers.bvEqual(result, [0x01, 0x0f, 0x63, 0x28, 0x6c, 0x16, 0x7a, 0xa5]);
	}

	@test
	public renderVariableInteger_overflow() {
		// Arrange
		const parser = this.getTestParser([], 0);

		// Act / Assert
		assert.throws(() => parser["renderVariableInteger"](BigInt("9151314442816847872")));
	}

	private getTestParser(bytes: ByteVector | number[], offset: number = 0): EbmlParser {
		const file = TestFile.getFile(bytes);
		return new EbmlParser(file, offset, bytes.length);
	}
}
