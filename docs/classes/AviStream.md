[node-taglib-sharp](../README.md) / [Exports](../modules.md) / AviStream

# Class: AviStream

Base class representing a stream in an AVI file. Provides basic support for parsing a raw AVI
stream list.

## Table of contents

### Constructors

- [constructor](AviStream.md#constructor)

### Properties

- [FORMAT_CHUNK_ID](AviStream.md#format_chunk_id)
- [HEADER_CHUNK_ID](AviStream.md#header_chunk_id)
- [LIST_TYPE](AviStream.md#list_type)

### Accessors

- [bottom](AviStream.md#bottom)
- [codec](AviStream.md#codec)
- [flags](AviStream.md#flags)
- [handler](AviStream.md#handler)
- [initialFrames](AviStream.md#initialframes)
- [language](AviStream.md#language)
- [left](AviStream.md#left)
- [length](AviStream.md#length)
- [priority](AviStream.md#priority)
- [quality](AviStream.md#quality)
- [rate](AviStream.md#rate)
- [right](AviStream.md#right)
- [sampleSize](AviStream.md#samplesize)
- [scale](AviStream.md#scale)
- [start](AviStream.md#start)
- [suggestedSampleSize](AviStream.md#suggestedsamplesize)
- [top](AviStream.md#top)
- [type](AviStream.md#type)

## Constructors

### constructor

• **new AviStream**(`list`)

Constructs and initializes a new instance with a specified stream header.

#### Parameters

| Name   | Type                      | Description                            |
| :----- | :------------------------ | :------------------------------------- |
| `list` | [`RiffList`](RiffList.md) | RiffList containing the stream headers |

## Properties

### FORMAT_CHUNK_ID

▪ `Static` `Readonly` **FORMAT_CHUNK_ID**: `"strf"`

ID of a format chunk.

---

### HEADER_CHUNK_ID

▪ `Static` `Readonly` **HEADER_CHUNK_ID**: `"strh"`

ID of a header chunk.

---

### LIST_TYPE

▪ `Static` `Readonly` **LIST_TYPE**: `"strl"`

ID of a list chunk.

## Accessors

### bottom

• `get` **bottom**(): `number`

Gets the offset from the bottom of the main movie rectangle where this stream should be
positioned.

#### Returns

`number`

---

### codec

• `get` **codec**(): [`ICodec`](../interfaces/ICodec.md)

Gets the codec information for this stream.

#### Returns

[`ICodec`](../interfaces/ICodec.md)

---

### flags

• `get` **flags**(): `number`

Gets any flags for the data stream.

#### Returns

`number`

---

### handler

• `get` **handler**(): `number`

Gets an optional FOURCC that identifies a specific data handler. The data handler is the
preferred handler for the stream. For audio/video streams, this specifies the codec for
decoding the stream.

#### Returns

`number`

---

### initialFrames

• `get` **initialFrames**(): `number`

Gets how far audio data is skewed ahead of the video frames in an interleaved file. This
value generally 0 for non-interleaved files.

#### Returns

`number`

---

### language

• `get` **language**(): `number`

Gets the language tag for the stream.

#### Returns

`number`

---

### left

• `get` **left**(): `number`

Gets the offset from the left of the main movie rectangle where this stream should be
positioned.

#### Returns

`number`

---

### length

• `get` **length**(): `number`

Gets the length of the stream. The units are defined by `rate` and `scale` in the main file
header.

#### Returns

`number`

---

### priority

• `get` **priority**(): `number`

Gets the priority of a stream type. For example, in a file with multiple audio streams,
the one with the highest priority might be the default stream.

#### Returns

`number`

---

### quality

• `get` **quality**(): `number`

Gets an indicator of the quality of the data in the stream. Quality is represented as a
number between `0` and `10000`. -1 indicates the default quality values should be used.

**`Remarks`**

For compressed data, this typically represents the value of the quality parameter
passed to the compression software.

#### Returns

`number`

---

### rate

• `get` **rate**(): `number`

Used with [scale](AviStream.md#scale) to specify the timescale that this stream will use.

**`Remarks`**

Dividing [rate](AviStream.md#rate) by this gives the number of samples per second. For video
streams, this is the frame rate. For audio streams, this rate corresponds to the time
needed to play [blockAlign](RiffWaveFormatEx.md#blockalign) bytes of audio. For PCM audio this is
just the sample rate.

#### Returns

`number`

---

### right

• `get` **right**(): `number`

Gets the offset from the right of the main movie rectangle where this stream should be
positioned.

#### Returns

`number`

---

### sampleSize

• `get` **sampleSize**(): `number`

Gets the size of a single sample of data. If the sample size varies, this will be `0`.

#### Returns

`number`

---

### scale

• `get` **scale**(): `number`

Used with [rate](AviStream.md#rate) to specify the timescale that this stream will use.

**`Remarks`**

Dividing [rate](AviStream.md#rate) by this gives the number of samples per second. For video
streams, this is the frame rate. For audio streams, this rate corresponds to the time
needed to play `nBlockAlign` bytes of audio. For PCM audio is just the sample rate.

#### Returns

`number`

---

### start

• `get` **start**(): `number`

Gets the starting time for this stream. The units are defined by `rate` and `scale` in the
main file header.

**`Remarks`**

Usually this is zero, but it can specify a delay time for a stream that does not
start concurrently with the file.

#### Returns

`number`

---

### suggestedSampleSize

• `get` **suggestedSampleSize**(): `number`

Gets how large of a buffer should be used to read this stream.

**`Remarks`**

Typically, this contains a value corresponding to the largest chunk present in the
stream.

#### Returns

`number`

---

### top

• `get` **top**(): `number`

Gets the offset from the top of the main movie rectangle where this stream should be
positioned.

#### Returns

`number`

---

### type

• `get` **type**(): [`AviStreamType`](../enums/AviStreamType.md)

Gets a FOURCC that species the type of data contained in the stream.

#### Returns

[`AviStreamType`](../enums/AviStreamType.md)
