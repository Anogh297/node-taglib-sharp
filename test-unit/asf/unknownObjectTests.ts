import { suite, test } from "@testdeck/mocha";
import { assert } from "chai";

import ObjectTests from "./objectTests";
import TestFile from "../utilities/testFile";
import UnknownObject from "../../src/asf/objects/unknownObject";
import UuidWrapper from "../../src/uuidWrapper";
import { ByteVector } from "../../src/byteVector";
import { ObjectType } from "../../src/asf/constants";
import { File } from "../../src/file";
import { Testers } from "../utilities/testers";

@suite
class Asf_UnknownObjectTests extends ObjectTests<UnknownObject> {
	protected get fromFileConstructor(): (f: File, p: number) => UnknownObject {
		return UnknownObject.fromFile;
	}
	protected get minSize(): number {
		return undefined;
	}
	protected get objectGuid(): UuidWrapper {
		return undefined;
	}

	@test
	public fromFile_validParameters() {
		// Arrange
		const data = this.getObjectBytes();
		const file = TestFile.getFile(data);

		// Act
		const object = UnknownObject.fromFile(file, 10);

		// Assert
		assert.isOk(object);
		assert.isTrue(object.guid.equals(this._guid));
		assert.strictEqual(object.objectType, ObjectType.UnknownObject);
		assert.strictEqual(object.originalSize, this._originalSize);
		Testers.bvEqual(object.data, this._bytes);
	}

	@test
	public setData_invalidValue() {
		// Arrange
		const data = this.getObjectBytes();
		const file = TestFile.getFile(data);
		const object = UnknownObject.fromFile(file, 10);

		// Act / Assert
		Testers.testTruthy((v: ByteVector) => {
			object.data = v;
		});
	}

	@test
	public setData_validValue() {
		// Arrange
		const data = this.getObjectBytes();
		const file = TestFile.getFile(data);
		const object = UnknownObject.fromFile(file, 10);

		const newBytes = ByteVector.fromSize(10, 0x23);

		// Act
		object.data = newBytes;

		// Assert
		Testers.bvEqual(object.data, newBytes);
		assert.strictEqual(object.originalSize, this._originalSize);
	}

	@test
	public render_isRoundTrip() {
		// Arrange
		const data = this.getObjectBytes();
		const file = TestFile.getFile(data);
		const object = UnknownObject.fromFile(file, 10);

		// Act
		const output = object.render();

		// Assert
		assert.isOk(output);
		Testers.bvEqual(output, data.subarray(10));
	}

	private readonly _bytes = ByteVector.fromSize(32, 0x12);
	private readonly _guid = new UuidWrapper();
	private readonly _originalSize = this._bytes.length + 16 + 8;

	private getObjectBytes() {
		return ByteVector.concatenate(
			ByteVector.fromSize(10), // Offset
			this._guid.toBytes(),
			ByteVector.fromUlong(this._originalSize, false),
			this._bytes,
		);
	}
}
