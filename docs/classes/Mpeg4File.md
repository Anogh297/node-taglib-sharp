[node-taglib-sharp](../README.md) / [Exports](../modules.md) / Mpeg4File

# Class: Mpeg4File

Provides tagging and properties support for Mpeg4 files.

## Hierarchy

- [`File`](File.md)

  ↳ **`Mpeg4File`**

## Table of contents

### Constructors

- [constructor](Mpeg4File.md#constructor)

### Accessors

- [corruptionReasons](Mpeg4File.md#corruptionreasons)
- [fileAbstraction](Mpeg4File.md#fileabstraction)
- [hasTags](Mpeg4File.md#hastags)
- [isPossiblyCorrupt](Mpeg4File.md#ispossiblycorrupt)
- [isWritable](Mpeg4File.md#iswritable)
- [length](Mpeg4File.md#length)
- [mimeType](Mpeg4File.md#mimetype)
- [mode](Mpeg4File.md#mode)
- [name](Mpeg4File.md#name)
- [position](Mpeg4File.md#position)
- [properties](Mpeg4File.md#properties)
- [tag](Mpeg4File.md#tag)
- [tagTypes](Mpeg4File.md#tagtypes)
- [tagTypesOnDisk](Mpeg4File.md#tagtypesondisk)
- [bufferSize](Mpeg4File.md#buffersize)

### Methods

- [dispose](Mpeg4File.md#dispose)
- [find](Mpeg4File.md#find)
- [getTag](Mpeg4File.md#gettag)
- [insert](Mpeg4File.md#insert)
- [markAsCorrupt](Mpeg4File.md#markascorrupt)
- [preSave](Mpeg4File.md#presave)
- [rFind](Mpeg4File.md#rfind)
- [readBlock](Mpeg4File.md#readblock)
- [removeBlock](Mpeg4File.md#removeblock)
- [removeTags](Mpeg4File.md#removetags)
- [save](Mpeg4File.md#save)
- [seek](Mpeg4File.md#seek)
- [truncate](Mpeg4File.md#truncate)
- [writeBlock](Mpeg4File.md#writeblock)
- [addFileType](Mpeg4File.md#addfiletype)
- [addFileTypeResolver](Mpeg4File.md#addfiletyperesolver)
- [createFromAbstraction](Mpeg4File.md#createfromabstraction)
- [createFromPath](Mpeg4File.md#createfrompath)
- [removeFileType](Mpeg4File.md#removefiletype)
- [removeFileTypeResolver](Mpeg4File.md#removefiletyperesolver)

## Constructors

### constructor

• **new Mpeg4File**(`file`, `readStyle`)

**`Inherit Doc`**

#### Parameters

| Name        | Type                                                                |
| :---------- | :------------------------------------------------------------------ |
| `file`      | `string` \| [`IFileAbstraction`](../interfaces/IFileAbstraction.md) |
| `readStyle` | [`ReadStyle`](../enums/ReadStyle.md)                                |

#### Overrides

[File](File.md).[constructor](File.md#constructor)

## Accessors

### corruptionReasons

• `get` **corruptionReasons**(): `string`[]

Reasons for which this file is marked as corrupt.

#### Returns

`string`[]

#### Inherited from

File.corruptionReasons

---

### fileAbstraction

• `get` **fileAbstraction**(): [`IFileAbstraction`](../interfaces/IFileAbstraction.md)

Gets the [IFileAbstraction](../interfaces/IFileAbstraction.md) representing the file.

#### Returns

[`IFileAbstraction`](../interfaces/IFileAbstraction.md)

#### Inherited from

File.fileAbstraction

---

### hasTags

• `get` **hasTags**(): `boolean`

Shortcut property to determine if a file has tags in memory.
NOTE: Just because `tag !== undefined` does not mean there are tags in memory.

#### Returns

`boolean`

#### Inherited from

File.hasTags

---

### isPossiblyCorrupt

• `get` **isPossiblyCorrupt**(): `boolean`

Indicates whether or not this file may be corrupt. Files with unknown corruptions should not
be written.

#### Returns

`boolean`

#### Inherited from

File.isPossiblyCorrupt

---

### isWritable

• `get` **isWritable**(): `boolean`

Indicates whether or not tags can be written back to the current file.

#### Returns

`boolean`

#### Inherited from

File.isWritable

---

### length

• `get` **length**(): `number`

Gets the length of the file represented by the current instance. Value will be 0 if the file
is not open for reading;

#### Returns

`number`

#### Inherited from

File.length

---

### mimeType

• `get` **mimeType**(): `string`

Gets the MimeType of the file as determined during creation of the instance.

#### Returns

`string`

#### Inherited from

File.mimeType

---

### mode

• `get` **mode**(): [`FileAccessMode`](../enums/FileAccessMode.md)

Gets the file access mode in use by the current instance.

#### Returns

[`FileAccessMode`](../enums/FileAccessMode.md)

#### Inherited from

File.mode

• `set` **mode**(`val`): `void`

Sets the file access mode in use by the current instance. Changing the value will cause the
stream currently in use to be closed, except when a change is made from
[Write](../enums/FileAccessMode.md#write) to [Read](../enums/FileAccessMode.md#read) which has no effect.

#### Parameters

| Name  | Type                                           | Description                   |
| :---- | :--------------------------------------------- | :---------------------------- |
| `val` | [`FileAccessMode`](../enums/FileAccessMode.md) | File access mode to change to |

#### Returns

`void`

#### Inherited from

File.mode

---

### name

• `get` **name**(): `string`

Gets the name of the file as stored in its file abstraction.

#### Returns

`string`

#### Inherited from

File.name

---

### position

• `get` **position**(): `number`

Gets the seek position in the internal stream used by the current instance. Value will be 0
if the file is not open for reading

#### Returns

`number`

#### Inherited from

File.position

---

### properties

• `get` **properties**(): [`Properties`](Properties.md)

Gets the media properties of the file represented by the current instance.

#### Returns

[`Properties`](Properties.md)

#### Overrides

File.properties

---

### tag

• `get` **tag**(): [`Mpeg4AppleTag`](Mpeg4AppleTag.md)

Gets an abstract representation of all tags stored in the current instance.

#### Returns

[`Mpeg4AppleTag`](Mpeg4AppleTag.md)

#### Overrides

File.tag

---

### tagTypes

• `get` **tagTypes**(): [`TagTypes`](../enums/TagTypes.md)

Gets the tag types contained in the current instance.

#### Returns

[`TagTypes`](../enums/TagTypes.md)

#### Inherited from

File.tagTypes

---

### tagTypesOnDisk

• `get` **tagTypesOnDisk**(): [`TagTypes`](../enums/TagTypes.md)

Gets the tag types contained in the physical file represented by the current instance.

#### Returns

[`TagTypes`](../enums/TagTypes.md)

#### Inherited from

File.tagTypesOnDisk

• `set` **tagTypesOnDisk**(`value`): `void`

Sets the tag types contained in the physical file represented by the current instance.

#### Parameters

| Name    | Type                               |
| :------ | :--------------------------------- |
| `value` | [`TagTypes`](../enums/TagTypes.md) |

#### Returns

`void`

#### Inherited from

File.tagTypesOnDisk

---

### bufferSize

• `Static` `get` **bufferSize**(): `number`

Gets the buffer size to use when reading large blocks of data

#### Returns

`number`

#### Inherited from

File.bufferSize

## Methods

### dispose

▸ **dispose**(): `void`

Dispose the current instance. Equivalent to setting the mode to closed.

#### Returns

`void`

#### Inherited from

[File](File.md).[dispose](File.md#dispose)

---

### find

▸ **find**(`pattern`, `startPosition?`, `before?`): `number`

Searches forward through a file for a specified pattern, starting at a specified offset.

**`Throws`**

Error Thrown if `pattern` is not provided or `startPosition` is not a
positive, safe integer.

#### Parameters

| Name            | Type                          | Default value | Description                                                                                                          |
| :-------------- | :---------------------------- | :------------ | :------------------------------------------------------------------------------------------------------------------- |
| `pattern`       | [`ByteVector`](ByteVector.md) | `undefined`   | Pattern to search for in the current instance. Must be smaller than the                                              |
| `startPosition` | `number`                      | `0`           | Seek position to start searching. Must be positive, safe integer.                                                    |
| `before?`       | [`ByteVector`](ByteVector.md) | `undefined`   | Optional pattern that the searched for pattern must appear before. If this pattern is found first, `-1` is returned. |

#### Returns

`number`

Index at which the value was found. If not found, `-1` is returned.

#### Inherited from

[File](File.md).[find](File.md#find)

---

### getTag

▸ **getTag**(`types`, `create`): [`Tag`](Tag.md)

Gets a tag of the specified type from the current instance, optionally creating a new tag if
possible.

#### Parameters

| Name     | Type                               | Description                                                                                                                                                                                         |
| :------- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `types`  | [`TagTypes`](../enums/TagTypes.md) | Type of tag to read.                                                                                                                                                                                |
| `create` | `boolean`                          | Whether or not to try and create the tag if one is not found. `true` does not guarantee the tag will be created. For example, trying to create an ID3v2 tag on an OGG Vorbis file will always fail. |

#### Returns

[`Tag`](Tag.md)

#### Overrides

[File](File.md).[getTag](File.md#gettag)

---

### insert

▸ **insert**(`data`, `start`, `replace?`): `void`

Inserts a specified block of data into the file represented by the current instance, at a
specified location, replacing a specified number of bytes.

**`Throws`**

Error Thrown when: 1) data is falsey, 2) start is not a safe, positive number, or 3)
replace is not a safe, positive number

#### Parameters

| Name      | Type                          | Default value | Description                                                                                                                     |
| :-------- | :---------------------------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------ |
| `data`    | [`ByteVector`](ByteVector.md) | `undefined`   | Data to insert into the file.                                                                                                   |
| `start`   | `number`                      | `undefined`   | Index into the file at which to insert the data. Must be safe positive integer.                                                 |
| `replace` | `number`                      | `0`           | Number of bytes to replace. Typically this is the original size of the data block so that a new block will replace the old one. |

#### Returns

`void`

#### Inherited from

[File](File.md).[insert](File.md#insert)

---

### markAsCorrupt

▸ **markAsCorrupt**(`reason`): `void`

Mark the current instance as corrupt. NOTE: Not intended to be used outside of this library.

#### Parameters

| Name     | Type     | Description                                      |
| :------- | :------- | :----------------------------------------------- |
| `reason` | `string` | Reason why this file is considered to be corrupt |

#### Returns

`void`

#### Inherited from

[File](File.md).[markAsCorrupt](File.md#markascorrupt)

---

### preSave

▸ `Protected` **preSave**(): `void`

Prepares to save the file. This must be called at the beginning of every File.save() method.

#### Returns

`void`

#### Inherited from

[File](File.md).[preSave](File.md#presave)

---

### rFind

▸ **rFind**(`pattern`, `startPosition?`): `number`

Searches backwards through a file for a specified pattern, starting at a specified offset.

**`Throws`**

Error Thrown if `pattern` was not provided or if `startPosition` is
not a safe, positive integer.

#### Parameters

| Name            | Type                          | Default value | Description                                                                                                   |
| :-------------- | :---------------------------- | :------------ | :------------------------------------------------------------------------------------------------------------ |
| `pattern`       | [`ByteVector`](ByteVector.md) | `undefined`   | Pattern to search for in the current instance. Must be shorter than the [bufferSize](Mpeg4File.md#buffersize) |
| `startPosition` | `number`                      | `0`           | Number of bytes from end of the file to begin searching.                                                      |

#### Returns

`number`

Index at which the value wa found. If not found, `-1` is returned.

#### Inherited from

[File](File.md).[rFind](File.md#rfind)

---

### readBlock

▸ **readBlock**(`length`): [`ByteVector`](ByteVector.md)

Reads a specified number of bytes at the current seek position from the current position.
This method reads the block of data at the current seek position. To change the seek
position, use [seek](File.md#seek).

**`Throws`**

Error Thrown when `length` is not a positive, safe integer.

#### Parameters

| Name     | Type     | Description              |
| :------- | :------- | :----------------------- |
| `length` | `number` | Number of bytes to read. |

#### Returns

[`ByteVector`](ByteVector.md)

Object containing the data read from the current instance.

#### Inherited from

[File](File.md).[readBlock](File.md#readblock)

---

### removeBlock

▸ **removeBlock**(`start`, `length`): `void`

Removes a specified block of data from the file represented by the current instance.

**`Throws`**

Error thrown if 1) start is not a safe, positive integer or 2) length must be a safe
integer.

#### Parameters

| Name     | Type     | Description                                                                  |
| :------- | :------- | :--------------------------------------------------------------------------- |
| `start`  | `number` | Index into the file at which to remove data. Must be safe, positive integer. |
| `length` | `number` | Number of bytes to remove. Must be a safe integer.                           |

#### Returns

`void`

#### Inherited from

[File](File.md).[removeBlock](File.md#removeblock)

---

### removeTags

▸ **removeTags**(`types`): `void`

Removes a set of tag types from the current instance. In order to remove all tags from a
file, pass [AllTags](../enums/TagTypes.md#alltags) as `types`

#### Parameters

| Name    | Type                               | Description                                                                                                  |
| :------ | :--------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| `types` | [`TagTypes`](../enums/TagTypes.md) | Bitwise combined [TagTypes](../enums/TagTypes.md) value containing the tag types to be removed from the file |

#### Returns

`void`

#### Overrides

[File](File.md).[removeTags](File.md#removetags)

---

### save

▸ **save**(): `void`

Saves the changes made in the current instance to the file it represents.

#### Returns

`void`

#### Overrides

[File](File.md).[save](File.md#save)

---

### seek

▸ **seek**(`offset`, `origin?`): `void`

Moves the read/write pointer to a specified offset in the current instance, relative to a
specified origin.

#### Parameters

| Name     | Type                                   | Default value      | Description                                               |
| :------- | :------------------------------------- | :----------------- | :-------------------------------------------------------- |
| `offset` | `number`                               | `undefined`        | Byte offset to seek to. Must be a safe, positive integer. |
| `origin` | [`SeekOrigin`](../enums/SeekOrigin.md) | `SeekOrigin.Begin` | Origin from which to seek                                 |

#### Returns

`void`

#### Inherited from

[File](File.md).[seek](File.md#seek)

---

### truncate

▸ `Protected` **truncate**(`length`): `void`

Resizes the current instance to a specific number of bytes.

#### Parameters

| Name     | Type     | Description                                                              |
| :------- | :------- | :----------------------------------------------------------------------- |
| `length` | `number` | Number of bytes to resize the file to, must be a safe, positive integer. |

#### Returns

`void`

#### Inherited from

[File](File.md).[truncate](File.md#truncate)

---

### writeBlock

▸ **writeBlock**(`data`): `void`

Writes a block of data to the file represented by the current instance at the current seek
position. This will overwrite any existing data at the seek position and append new data to
the file if writing past the current end.

**`Throws`**

Error Thrown when `data` is not provided.

#### Parameters

| Name   | Type                          | Description                                         |
| :----- | :---------------------------- | :-------------------------------------------------- |
| `data` | [`ByteVector`](ByteVector.md) | ByteVector containing data to the current instance. |

#### Returns

`void`

#### Inherited from

[File](File.md).[writeBlock](File.md#writeblock)

---

### addFileType

▸ `Static` **addFileType**(`mimeType`, `constructor`, `override?`): `void`

Registers the constructor for a subclass of [File](File.md) with the MimeType it is associated
with. Optionally, the MimeType can be forcefully overridden if it was already registered.

#### Parameters

| Name          | Type                                                       | Default value | Description                                                                                                                                                                                                 |
| :------------ | :--------------------------------------------------------- | :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mimeType`    | `string`                                                   | `undefined`   | MimeType to register this subclass constructor to.                                                                                                                                                          |
| `constructor` | [`FileTypeConstructor`](../modules.md#filetypeconstructor) | `undefined`   | Constructor for a subclass of [File](File.md) that will be called if a file with a MimeType of `mimeType` is created.                                                                                       |
| `override`    | `boolean`                                                  | `false`       | If `true` and a subclass of [File](File.md) was already registered to `mimeType`, it will be forcefully overridden. If `false`, an `Error` will be thrown if a subclass already registered to the MimeType. |

#### Returns

`void`

#### Inherited from

[File](File.md).[addFileType](File.md#addfiletype)

---

### addFileTypeResolver

▸ `Static` **addFileTypeResolver**(`resolver`): `void`

Registers a [FileTypeResolver](../modules.md#filetyperesolver) to the front of the list of file type resolvers.

#### Parameters

| Name       | Type                                                 | Description                                                                                                              |
| :--------- | :--------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| `resolver` | [`FileTypeResolver`](../modules.md#filetyperesolver) | Function to handle resolving a subclass of [File](File.md) from an [IFileAbstraction](../interfaces/IFileAbstraction.md) |

#### Returns

`void`

#### Inherited from

[File](File.md).[addFileTypeResolver](File.md#addfiletyperesolver)

---

### createFromAbstraction

▸ `Static` **createFromAbstraction**(`abstraction`, `mimeType?`, `propertiesStyle?`): [`File`](File.md)

Creates a new instance of a [File](File.md) subclass for a specified file abstraction, MimeType,
and property read style.

#### Parameters

| Name              | Type                                                    | Default value       | Description                                                                                                                                                  |
| :---------------- | :------------------------------------------------------ | :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `abstraction`     | [`IFileAbstraction`](../interfaces/IFileAbstraction.md) | `undefined`         | Object to use when reading/writing from the current instance.                                                                                                |
| `mimeType?`       | `string`                                                | `undefined`         | Optional, MimeType to use for determining the subclass of [File](File.md) to return. If omitted, the MimeType will be guessed based on the file's extension. |
| `propertiesStyle` | [`ReadStyle`](../enums/ReadStyle.md)                    | `ReadStyle.Average` | Optional, level of detail to use when reading the media information from the new instance. If omitted, [Average](../enums/ReadStyle.md#average) is used.     |

#### Returns

[`File`](File.md)

New instance of [File](File.md) as read from the specified abstraction.

#### Inherited from

[File](File.md).[createFromAbstraction](File.md#createfromabstraction)

---

### createFromPath

▸ `Static` **createFromPath**(`filePath`, `mimeType?`, `propertiesStyle?`): [`File`](File.md)

Creates a new instance of [File](File.md) subclass for a specified file path, MimeType, and
property read style.

#### Parameters

| Name              | Type                                 | Default value       | Description                                                                                                                                                  |
| :---------------- | :----------------------------------- | :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filePath`        | `string`                             | `undefined`         | Path to the file to read/write.                                                                                                                              |
| `mimeType?`       | `string`                             | `undefined`         | Optional, MimeType to use for determining the subclass of [File](File.md) to return. If omitted, the MimeType will be guessed based on the file's extension. |
| `propertiesStyle` | [`ReadStyle`](../enums/ReadStyle.md) | `ReadStyle.Average` | Optional, level of detail to use when reading the media information from the new instance. If omitted [Average](../enums/ReadStyle.md#average) is used.      |

#### Returns

[`File`](File.md)

New instance of [File](File.md) as read from the specified path.

#### Inherited from

[File](File.md).[createFromPath](File.md#createfrompath)

---

### removeFileType

▸ `Static` **removeFileType**(`mimeType`): `void`

Used for removing a file type constructor during unit testing

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `mimeType` | `string` |

#### Returns

`void`

#### Inherited from

[File](File.md).[removeFileType](File.md#removefiletype)

---

### removeFileTypeResolver

▸ `Static` **removeFileTypeResolver**(`resolver`): `void`

Used for removing a file type resolver during unit testing

#### Parameters

| Name       | Type                                                 |
| :--------- | :--------------------------------------------------- |
| `resolver` | [`FileTypeResolver`](../modules.md#filetyperesolver) |

#### Returns

`void`

#### Inherited from

[File](File.md).[removeFileTypeResolver](File.md#removefiletyperesolver)
