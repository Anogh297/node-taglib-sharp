import { suite, test } from "@testdeck/mocha";
import { assert } from "chai";

import UuidWrapper from "../../src/uuidWrapper";
import { ByteVector, StringType } from "../../src/byteVector";
import { DataType, DescriptorBase, DescriptorValue } from "../../src/asf/objects/descriptorBase";
import { Testers } from "../utilities/testers";

class TestDescriptor extends DescriptorBase {
	public constructor(name: string, type: DataType, value: DescriptorValue) {
		super(name, type, value);
	}

	public render(): ByteVector {
		return undefined; /* no-op */
	}
}

@suite
class Asf_DescriptorBaseTests {
	@test
	public invalidDataType() {
		// Act / Assert
		assert.throws(() => new TestDescriptor("foo", 8888, "bar"));
	}

	@test
	public word_invalid() {
		// Act / Assert
		Testers.testUshort((v) => new TestDescriptor("foo", DataType.Word, v));
		assert.throws(() => new TestDescriptor("foo", DataType.Word, "foo"));
		assert.throws(() => new TestDescriptor("foo", DataType.Word, true));
		assert.throws(() => new TestDescriptor("foo", DataType.Word, BigInt(1234)));
		assert.throws(() => new TestDescriptor("foo", DataType.Word, ByteVector.empty()));
		assert.throws(() => new TestDescriptor("foo", DataType.Word, new UuidWrapper()));
	}

	@test
	public word_valid() {
		// Act
		const d = new TestDescriptor("foo", DataType.Word, 1234);

		// Assert
		assert.strictEqual(d.name, "foo");
		assert.strictEqual(d.type, DataType.Word);
		assert.isUndefined(d.boolValue);
		assert.isUndefined(d.byteValue);
		assert.isUndefined(d.guidValue);
		assert.isUndefined(d.stringValue);
		assert.isUndefined(d.uintValue);
		assert.isUndefined(d.ulongValue);
		assert.strictEqual(d.ushortValue, 1234);
	}

	@test
	public dword_invalid() {
		// Act / Assert
		Testers.testUint((v) => new TestDescriptor("foo", DataType.DWord, v));
		assert.throws(() => new TestDescriptor("foo", DataType.DWord, "foo"));
		assert.throws(() => new TestDescriptor("foo", DataType.DWord, true));
		assert.throws(() => new TestDescriptor("foo", DataType.DWord, BigInt(1234)));
		assert.throws(() => new TestDescriptor("foo", DataType.DWord, ByteVector.empty()));
		assert.throws(() => new TestDescriptor("foo", DataType.DWord, new UuidWrapper()));
	}

	@test
	public dword_valid() {
		// Act
		const d = new TestDescriptor("foo", DataType.DWord, 1234);

		// Assert
		assert.strictEqual(d.name, "foo");
		assert.strictEqual(d.type, DataType.DWord);
		assert.isUndefined(d.boolValue);
		assert.isUndefined(d.byteValue);
		assert.isUndefined(d.guidValue);
		assert.isUndefined(d.stringValue);
		assert.strictEqual(d.uintValue, 1234);
		assert.isUndefined(d.ulongValue);
		assert.isUndefined(d.ushortValue);
	}

	@test
	public qword_invalid() {
		// Act / Assert
		Testers.testUlong((v) => new TestDescriptor("foo", DataType.QWord, v));
		assert.throws(() => new TestDescriptor("foo", DataType.QWord, "foo"));
		assert.throws(() => new TestDescriptor("foo", DataType.QWord, true));
		assert.throws(() => new TestDescriptor("foo", DataType.QWord, 1234));
		assert.throws(() => new TestDescriptor("foo", DataType.QWord, ByteVector.empty()));
		assert.throws(() => new TestDescriptor("foo", DataType.QWord, new UuidWrapper()));
	}

	@test
	public qword_valid() {
		// Act
		const d = new TestDescriptor("foo", DataType.QWord, BigInt(1234));

		// Assert
		assert.strictEqual(d.name, "foo");
		assert.strictEqual(d.type, DataType.QWord);
		assert.isUndefined(d.boolValue);
		assert.isUndefined(d.byteValue);
		assert.isUndefined(d.guidValue);
		assert.isUndefined(d.stringValue);
		assert.isUndefined(d.uintValue);
		assert.strictEqual(d.ulongValue, BigInt(1234));
		assert.isUndefined(d.ushortValue);
	}

	@test
	public bool_invalid() {
		// Act / Assert
		assert.throws(() => new TestDescriptor("foo", DataType.Bool, undefined));
		assert.throws(() => new TestDescriptor("foo", DataType.Bool, null));
		assert.throws(() => new TestDescriptor("foo", DataType.Bool, "foo"));
		assert.throws(() => new TestDescriptor("foo", DataType.Bool, 1234));
		assert.throws(() => new TestDescriptor("foo", DataType.Bool, BigInt(1234)));
		assert.throws(() => new TestDescriptor("foo", DataType.Bool, ByteVector.empty()));
		assert.throws(() => new TestDescriptor("foo", DataType.Bool, new UuidWrapper()));
	}

	@test
	public bool_valid() {
		// Act
		const d = new TestDescriptor("foo", DataType.Bool, true);

		// Assert
		assert.strictEqual(d.name, "foo");
		assert.strictEqual(d.type, DataType.Bool);
		assert.strictEqual(d.boolValue, true);
		assert.isUndefined(d.byteValue);
		assert.isUndefined(d.guidValue);
		assert.isUndefined(d.stringValue);
		assert.isUndefined(d.uintValue);
		assert.isUndefined(d.ulongValue);
		assert.isUndefined(d.ushortValue);
	}

	@test
	public unicode_invalid() {
		// Act / Assert
		assert.throws(() => new TestDescriptor("foo", DataType.Unicode, undefined));
		assert.throws(() => new TestDescriptor("foo", DataType.Unicode, null));
		assert.throws(() => new TestDescriptor("foo", DataType.Unicode, 1234));
		assert.throws(() => new TestDescriptor("foo", DataType.Unicode, true));
		assert.throws(() => new TestDescriptor("foo", DataType.Unicode, BigInt(1234)));
		assert.throws(() => new TestDescriptor("foo", DataType.Unicode, ByteVector.empty()));
		assert.throws(() => new TestDescriptor("foo", DataType.Unicode, new UuidWrapper()));
	}

	@test
	public unicode_valid() {
		// Act
		const d = new TestDescriptor("foo", DataType.Unicode, "bar");

		// Assert
		assert.strictEqual(d.name, "foo");
		assert.strictEqual(d.type, DataType.Unicode);
		assert.isUndefined(d.boolValue);
		assert.isUndefined(d.byteValue);
		assert.isUndefined(d.guidValue);
		assert.strictEqual(d.stringValue, "bar");
		assert.isUndefined(d.uintValue);
		assert.isUndefined(d.ulongValue);
		assert.isUndefined(d.ushortValue);
	}

	@test
	public bytes_invalid() {
		// Act / Assert
		assert.throws(() => new TestDescriptor("foo", DataType.Bytes, undefined));
		assert.throws(() => new TestDescriptor("foo", DataType.Bytes, null));
		assert.throws(() => new TestDescriptor("foo", DataType.Bytes, "foo"));
		assert.throws(() => new TestDescriptor("foo", DataType.Bytes, 1234));
		assert.throws(() => new TestDescriptor("foo", DataType.Bytes, true));
		assert.throws(() => new TestDescriptor("foo", DataType.Bytes, BigInt(1234)));
		assert.throws(() => new TestDescriptor("foo", DataType.Bytes, new UuidWrapper()));
	}

	@test
	public bytes_valid() {
		// Arrange
		const bytes = ByteVector.fromString("fuxbuxquxx", StringType.UTF8);

		// Act
		const d = new TestDescriptor("foo", DataType.Bytes, bytes);

		// Assert
		assert.strictEqual(d.name, "foo");
		assert.strictEqual(d.type, DataType.Bytes);
		assert.isUndefined(d.boolValue);
		Testers.bvEqual(d.byteValue, bytes);
		assert.isUndefined(d.guidValue);
		assert.isUndefined(d.stringValue);
		assert.isUndefined(d.uintValue);
		assert.isUndefined(d.ulongValue);
		assert.isUndefined(d.ushortValue);
	}

	@test
	public guid_invalid() {
		// Act / Assert
		assert.throws(() => new TestDescriptor("foo", DataType.Guid, undefined));
		assert.throws(() => new TestDescriptor("foo", DataType.Guid, null));
		assert.throws(() => new TestDescriptor("foo", DataType.Guid, "foo"));
		assert.throws(() => new TestDescriptor("foo", DataType.Guid, 1234));
		assert.throws(() => new TestDescriptor("foo", DataType.Guid, true));
		assert.throws(() => new TestDescriptor("foo", DataType.Guid, ByteVector.empty()));
		assert.throws(() => new TestDescriptor("foo", DataType.Guid, BigInt(1234)));
	}

	@test
	public guid_valid() {
		// Arrange
		const guid = new UuidWrapper();

		// Act
		const d = new TestDescriptor("foo", DataType.Guid, guid);

		// Assert
		assert.strictEqual(d.name, "foo");
		assert.strictEqual(d.type, DataType.Guid);
		assert.isUndefined(d.boolValue);
		assert.isUndefined(d.byteValue);
		assert.isTrue(d.guidValue.equals(guid));
		assert.isUndefined(d.stringValue);
		assert.isUndefined(d.uintValue);
		assert.isUndefined(d.ulongValue);
		assert.isUndefined(d.ushortValue);
	}
}
