[node-taglib-sharp](../README.md) / [Exports](../modules.md) / AsfFilePropertiesObject

# Class: AsfFilePropertiesObject

Extends BaseObject to provide a representation of an ASF file properties object. The
file properties object defines the global characteristics of the combined digital media streams
found within the Data object.

## Hierarchy

- [`AsfBaseObject`](AsfBaseObject.md)

  ↳ **`AsfFilePropertiesObject`**

## Table of contents

### Accessors

- [creationDate](AsfFilePropertiesObject.md#creationdate)
- [dataPacketsCount](AsfFilePropertiesObject.md#datapacketscount)
- [fileId](AsfFilePropertiesObject.md#fileid)
- [fileSize](AsfFilePropertiesObject.md#filesize)
- [flags](AsfFilePropertiesObject.md#flags)
- [guid](AsfFilePropertiesObject.md#guid)
- [maximumBitrate](AsfFilePropertiesObject.md#maximumbitrate)
- [maximumDataPacketSize](AsfFilePropertiesObject.md#maximumdatapacketsize)
- [minimumDataPacketSize](AsfFilePropertiesObject.md#minimumdatapacketsize)
- [objectType](AsfFilePropertiesObject.md#objecttype)
- [originalSize](AsfFilePropertiesObject.md#originalsize)
- [playDurationMilliseconds](AsfFilePropertiesObject.md#playdurationmilliseconds)
- [prerollMilliseconds](AsfFilePropertiesObject.md#prerollmilliseconds)
- [sendDurationMilliseconds](AsfFilePropertiesObject.md#senddurationmilliseconds)

### Methods

- [initializeFromFile](AsfFilePropertiesObject.md#initializefromfile)
- [initializeFromGuid](AsfFilePropertiesObject.md#initializefromguid)
- [render](AsfFilePropertiesObject.md#render)
- [renderInternal](AsfFilePropertiesObject.md#renderinternal)
- [fromFile](AsfFilePropertiesObject.md#fromfile)

## Accessors

### creationDate

• `get` **creationDate**(): `Date`

Gets the creation date of the file described by the current instance.

#### Returns

`Date`

---

### dataPacketsCount

• `get` **dataPacketsCount**(): `bigint`

Gets the number of packets in the data section of the file represented by the current
instance.

#### Returns

`bigint`

---

### fileId

• `get` **fileId**(): [`UuidWrapper`](UuidWrapper.md)

Gets the GUID for the file described by the current instance.

#### Returns

[`UuidWrapper`](UuidWrapper.md)

---

### fileSize

• `get` **fileSize**(): `bigint`

Gets the total size of the file described by the current instance in bytes.

#### Returns

`bigint`

---

### flags

• `get` **flags**(): `number`

Gets whether the file described by the current instance is broadcast or seekable.

**`Remarks`**

This attribute applies to presentation descriptors for ASF content. The value is a
bitwise OR of the flags in FilePropertiesFlags.
_ If FilePropertiesFlags.Broadcast is set, the following properties are not
valid
_ [fileId](AsfFilePropertiesObject.md#fileid)
_ [creationDate](AsfFilePropertiesObject.md#creationdate)
_ [dataPacketsCount](AsfFilePropertiesObject.md#datapacketscount)
_ [playDurationMilliseconds](AsfFilePropertiesObject.md#playdurationmilliseconds)
_ [sendDurationMilliseconds](AsfFilePropertiesObject.md#senddurationmilliseconds)
_ [maximumDataPacketSize](AsfFilePropertiesObject.md#maximumdatapacketsize) and [minimumDataPacketSize](AsfFilePropertiesObject.md#minimumdatapacketsize) are set to the
actual packet size
_ If FilePropertiesFlags.Seekable is set, an audio stream is present and the
[maximumDataPacketSize](AsfFilePropertiesObject.md#maximumdatapacketsize) and [minimumDataPacketSize](AsfFilePropertiesObject.md#minimumdatapacketsize) are set to the same
size. It can also be seekable if the file has an audio stream and a video stream with
a matching simple index object.

#### Returns

`number`

---

### guid

• `get` **guid**(): [`UuidWrapper`](UuidWrapper.md)

Gets the GUID that identifies the current instance.

#### Returns

[`UuidWrapper`](UuidWrapper.md)

#### Inherited from

BaseObject.guid

---

### maximumBitrate

• `get` **maximumBitrate**(): `number`

Gets the maximum instantaneous bit rate, in bits per second, for the file described by the
current instance.

#### Returns

`number`

---

### maximumDataPacketSize

• `get` **maximumDataPacketSize**(): `number`

Gets the maximum packet size, in bytes, for the file described by the current instance.

#### Returns

`number`

---

### minimumDataPacketSize

• `get` **minimumDataPacketSize**(): `number`

Gets the minimum packet size, in bytes, for the file described by the current instance.

#### Returns

`number`

---

### objectType

• `get` **objectType**(): [`AsfObjectType`](../enums/AsfObjectType.md)

Gets the type of the object for easy comparison.

#### Returns

[`AsfObjectType`](../enums/AsfObjectType.md)

#### Overrides

BaseObject.objectType

---

### originalSize

• `get` **originalSize**(): `number`

Gets the original size of the current instance.

#### Returns

`number`

#### Inherited from

BaseObject.originalSize

---

### playDurationMilliseconds

• `get` **playDurationMilliseconds**(): `number`

Get the time needed to play the file described by the current instance in milliseconds.

#### Returns

`number`

---

### prerollMilliseconds

• `get` **prerollMilliseconds**(): `number`

Gets the amount of time, in milliseconds, to buffer data before playing the file described
by the current instance.

#### Returns

`number`

---

### sendDurationMilliseconds

• `get` **sendDurationMilliseconds**(): `number`

Get the time needed to send the file described by the current instance in milliseconds. A
packet's "send time" is the time when the packet should be delivered over the network, it is
not the presentation of the packet.

#### Returns

`number`

## Methods

### initializeFromFile

▸ `Protected` **initializeFromFile**(`file`, `position`): `void`

Initializes a new instance by reading the contents from a specified position in a specified
file.

#### Parameters

| Name       | Type              | Description                                                   |
| :--------- | :---------------- | :------------------------------------------------------------ |
| `file`     | [`File`](File.md) | File which contains the details of the new instance to create |
| `position` | `number`          | Position in `file` where the object begins                    |

#### Returns

`void`

#### Inherited from

[AsfBaseObject](AsfBaseObject.md).[initializeFromFile](AsfBaseObject.md#initializefromfile)

---

### initializeFromGuid

▸ `Protected` **initializeFromGuid**(`guid`): `void`

Initializes a new instance with a specified GUID.

#### Parameters

| Name   | Type                            | Description                       |
| :----- | :------------------------------ | :-------------------------------- |
| `guid` | [`UuidWrapper`](UuidWrapper.md) | GUID to use for the new instance. |

#### Returns

`void`

#### Inherited from

[AsfBaseObject](AsfBaseObject.md).[initializeFromGuid](AsfBaseObject.md#initializefromguid)

---

### render

▸ **render**(): [`ByteVector`](ByteVector.md)

Renders the current instance as a raw ASF object.

#### Returns

[`ByteVector`](ByteVector.md)

#### Overrides

[AsfBaseObject](AsfBaseObject.md).[render](AsfBaseObject.md#render)

---

### renderInternal

▸ `Protected` **renderInternal**(`data`): [`ByteVector`](ByteVector.md)

Renders the current instance as a raw ASF object containing the specified data.

**`Remarks`**

Child classes implementing [()](AsfFilePropertiesObject.md#render) should render their contents and then
send the data through this method to produce the final output.

#### Parameters

| Name   | Type                          | Description                                                    |
| :----- | :---------------------------- | :------------------------------------------------------------- |
| `data` | [`ByteVector`](ByteVector.md) | Data to store in the rendered version of the current instance. |

#### Returns

[`ByteVector`](ByteVector.md)

#### Inherited from

[AsfBaseObject](AsfBaseObject.md).[renderInternal](AsfBaseObject.md#renderinternal)

---

### fromFile

▸ `Static` **fromFile**(`file`, `position`): [`AsfFilePropertiesObject`](AsfFilePropertiesObject.md)

Constructs a new instance by reading from a file.

#### Parameters

| Name       | Type              | Description                                  |
| :--------- | :---------------- | :------------------------------------------- |
| `file`     | [`File`](File.md) | File to read the file properties object from |
| `position` | `number`          | Offset into the file where the object begins |

#### Returns

[`AsfFilePropertiesObject`](AsfFilePropertiesObject.md)
