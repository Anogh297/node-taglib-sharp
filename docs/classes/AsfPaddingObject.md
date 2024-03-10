[node-taglib-sharp](../README.md) / [Exports](../modules.md) / AsfPaddingObject

# Class: AsfPaddingObject

This class provides a representation of an ASF padding object which can be read from and
written to disk.

## Hierarchy

- [`AsfBaseObject`](AsfBaseObject.md)

  ↳ **`AsfPaddingObject`**

## Table of contents

### Properties

- [HEADER_LENGTH](AsfPaddingObject.md#header_length)

### Accessors

- [guid](AsfPaddingObject.md#guid)
- [objectType](AsfPaddingObject.md#objecttype)
- [originalSize](AsfPaddingObject.md#originalsize)
- [size](AsfPaddingObject.md#size)

### Methods

- [initializeFromFile](AsfPaddingObject.md#initializefromfile)
- [initializeFromGuid](AsfPaddingObject.md#initializefromguid)
- [render](AsfPaddingObject.md#render)
- [renderInternal](AsfPaddingObject.md#renderinternal)
- [fromFile](AsfPaddingObject.md#fromfile)
- [fromSize](AsfPaddingObject.md#fromsize)

## Properties

### HEADER_LENGTH

▪ `Static` `Readonly` **HEADER_LENGTH**: `24`

Length of the padding object header in bytes.

## Accessors

### guid

• `get` **guid**(): [`UuidWrapper`](UuidWrapper.md)

Gets the GUID that identifies the current instance.

#### Returns

[`UuidWrapper`](UuidWrapper.md)

#### Inherited from

BaseObject.guid

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

### size

• `get` **size**(): `number`

Gets the number of bytes the current instance will take up on disk. Note: this does _not_
include the header for the object.

#### Returns

`number`

• `set` **size**(`value`): `void`

Sets the number of padding bytes the current instance will contain. Note: this does _not_
include the header for the object.

#### Parameters

| Name    | Type     | Description                                                              |
| :------ | :------- | :----------------------------------------------------------------------- |
| `value` | `number` | Size of the current instance in bytes, must be a safe, positive integer. |

#### Returns

`void`

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

Child classes implementing [()](AsfPaddingObject.md#render) should render their contents and then
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

▸ `Static` **fromFile**(`file`, `position`): [`AsfPaddingObject`](AsfPaddingObject.md)

Constructs and initializes a new instance by reading it from a file.

#### Parameters

| Name       | Type              | Description                                              |
| :--------- | :---------------- | :------------------------------------------------------- |
| `file`     | [`File`](File.md) | File to read the padding object from                     |
| `position` | `number`          | Index into the file where the padding object starts from |

#### Returns

[`AsfPaddingObject`](AsfPaddingObject.md)

---

### fromSize

▸ `Static` **fromSize**(`size`): [`AsfPaddingObject`](AsfPaddingObject.md)

Constructs and initializes a new instance with a fixed size.

#### Parameters

| Name   | Type     | Description                                                                         |
| :----- | :------- | :---------------------------------------------------------------------------------- |
| `size` | `number` | Number of padding bytes to store in the object not including the size of the header |

#### Returns

[`AsfPaddingObject`](AsfPaddingObject.md)
