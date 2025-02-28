[node-taglib-sharp](../README.md) / [Exports](../modules.md) / MpegAudioFileSettings

# Class: MpegAudioFileSettings

This class contains settings related to MPEG audio file operations. Open files will need to be
re-read in order for changes to take effect.

## Table of contents

### Constructors

- [constructor](MpegAudioFileSettings.md#constructor)

### Properties

- [SUPPORTED_TAG_TYPES](MpegAudioFileSettings.md#supported_tag_types)

### Accessors

- [defaultTagTypes](MpegAudioFileSettings.md#defaulttagtypes)
- [preferApeTagAtFileEnd](MpegAudioFileSettings.md#preferapetagatfileend)
- [preferId3v2TagAtFileEnd](MpegAudioFileSettings.md#preferid3v2tagatfileend)

## Constructors

### constructor

• **new MpegAudioFileSettings**()

## Properties

### SUPPORTED_TAG_TYPES

▪ `Static` `Readonly` **SUPPORTED_TAG_TYPES**: `number`

The types of tags that are supported by MPEG audio files.

## Accessors

### defaultTagTypes

• `Static` `get` **defaultTagTypes**(): [`TagTypes`](../enums/TagTypes.md)

Gets the default types of tags for an MPEG audio file. When opening a file, if these tag
types do not exist on the file, they will be created.

#### Returns

[`TagTypes`](../enums/TagTypes.md)

• `Static` `set` **defaultTagTypes**(`value`): `void`

Sets the default types of tags for an MPEG audio file. When opening a file, if these tag
types do not exist on the file, they will be created. See [SUPPORTED_TAG_TYPES](MpegAudioFileSettings.md#supported_tag_types) for a
list of tag types that are supported by node-taglib-sharp for MPEG container files.

#### Parameters

| Name    | Type                               |
| :------ | :--------------------------------- |
| `value` | [`TagTypes`](../enums/TagTypes.md) |

#### Returns

`void`

---

### preferApeTagAtFileEnd

• `Static` `get` **preferApeTagAtFileEnd**(): `boolean`

Gets whether or not _new_ APE tags should be stored at the end of the file. If `true` new
APE tags will be stored at the end of the file. If `false` new APE tags will be stored at
the beginning of the file (not recommended). Note, this only affects _new_ APE tags.
Existing APE tags will not be moved unless removed and re-added.

**`Default`**

`true`

#### Returns

`boolean`

• `Static` `set` **preferApeTagAtFileEnd**(`value`): `void`

Gets whether or not _new_ APE tags should be stored at the end of the file. If `true` new
APE tags will be stored at the end of the file. If `false` new APE tags will be stored at
the beginning of the file (not recommended). Note, this only affects _new_ APE tags.
Existing APE tags will not be moved unless removed and re-added.

**`Default`**

`true`

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `value` | `boolean` |

#### Returns

`void`

---

### preferId3v2TagAtFileEnd

• `Static` `get` **preferId3v2TagAtFileEnd**(): `boolean`

Gets whether or not _new_ ID3v2 tags should be stored at the end of the file. If `true` new
ID3v2 tags will be stored at the end of the file. If `false` new ID3v2 tags will be stored
at the beginning of the file. Note, this only affects _new_ ID3v2 tags. Existing ID3v2 tags
will not be moved unless removed and re-added.

**`Remarks`**

In order to store an ID3v2 tag at the end of a file, it must have a tag footer. Tag
footers are only supported in ID3v2.4. If the ID3v2 version is changed, it will cause an
error to be thrown when the tag is rendered.

**`Default`**

`false`

#### Returns

`boolean`

• `Static` `set` **preferId3v2TagAtFileEnd**(`value`): `void`

Sets whether or not _new_ ID3v2 tags should be stored at the end of the file. If `true` new
ID3v2 tags will be stored at the end of the file. If `false` new ID3v2 tags will be stored
at the beginning of the file. Note, this only affects _new_ ID3v2 tags. Existing ID3v2 tags
will not be moved unless removed and re-added.

**`Remarks`**

In order to store an ID3v2 tag at the end of a file, it must have a tag footer. Tag
footers are only supported in ID3v2.4. If the ID3v2 version is changed, it will cause an
error to be thrown when the tag is rendered.

**`Default`**

`false`

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `value` | `boolean` |

#### Returns

`void`
