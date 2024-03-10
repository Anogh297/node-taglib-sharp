import * as Path from "path";
import { v4 as Uuidv4 } from "uuid";

import { ByteVector, StringType } from "../src/byteVector";

export default class TestConstants {
	public static testFileFolderPath: string = "./test-unit/resources/";
	public static testFileName = "testFile.txt";
	public static testFilePath: string = Path.join(TestConstants.testFileFolderPath, TestConstants.testFileName);
	public static testFileContents: Uint8Array = new Uint8Array([0x31, 0x32, 0x33, 0x34, 0x35, 0x61, 0x62, 0x63, 0x64, 0x65]);
	public static testFileContentsStr: string = "12345abcde";

	public static getTestFilePath: () => string = () => {
		const fileUid: string = Uuidv4();
		return Path.join(TestConstants.testFileFolderPath, `testFile_${fileUid}.txt`);
	};

	public static testStrings: { [key: string]: { bytes: Uint8Array; str: string } } = {
		Latin1: {
			bytes: new Uint8Array([0x21, 0x31, 0x32, 0x33, 0x41, 0x42, 0x43, 0x61, 0x62, 0x63, 0xc1, 0xd1, 0xfc, 0xae, 0xbe]),
			str: "!123ABCabcÁÑü®¾",
		},
		UTF16BE: {
			bytes: new Uint8Array([0x00, 0x61, 0x00, 0x62, 0x00, 0x63, 0x03, 0xba, 0x03, 0xcc, 0x03, 0xc3, 0x03, 0xbc, 0x03, 0xb5]),
			str: "abcκόσμε",
		},
		UTF16LE: {
			bytes: new Uint8Array([0x61, 0x00, 0x62, 0x00, 0x63, 0x00, 0xba, 0x03, 0xcc, 0x03, 0xc3, 0x03, 0xbc, 0x03, 0xb5, 0x03]),
			str: "abcκόσμε",
		},
		UTF16LEWithBOM: {
			bytes: new Uint8Array([0xff, 0xfe, 0x61, 0x00, 0x62, 0x00, 0x63, 0x00, 0xba, 0x03, 0xcc, 0x03, 0xc3, 0x03, 0xbc, 0x03, 0xb5, 0x03]),
			str: "abcκόσμε",
		},
		UTF8: {
			bytes: new Uint8Array([0x61, 0x62, 0x63, 0xce, 0xba, 0xcf, 0x8c, 0xcf, 0x83, 0xce, 0xbc, 0xce, 0xb5]),
			str: "abcκόσμε",
		},
	};

	public static testByteVector: ByteVector = ByteVector.fromString("foobarbaz", StringType.UTF8);

	public static syncedUint = 0x2040810;
	public static syncedUintBytes = ByteVector.fromSize(4, 0x10);
}
