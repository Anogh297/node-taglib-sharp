[node-taglib-sharp](../README.md) / [Exports](../modules.md) / ApeTagItem

# Class: ApeTagItem

Class that represents a property in an APE tag.

## Table of contents

### Accessors

- [isEmpty](ApeTagItem.md#isempty)
- [isReadOnly](ApeTagItem.md#isreadonly)
- [key](ApeTagItem.md#key)
- [size](ApeTagItem.md#size)
- [text](ApeTagItem.md#text)
- [type](ApeTagItem.md#type)
- [value](ApeTagItem.md#value)

### Methods

- [clone](ApeTagItem.md#clone)
- [render](ApeTagItem.md#render)
- [toString](ApeTagItem.md#tostring)
- [fromBinaryValue](ApeTagItem.md#frombinaryvalue)
- [fromData](ApeTagItem.md#fromdata)
- [fromTextValues](ApeTagItem.md#fromtextvalues)

## Accessors

### isEmpty

• `get` **isEmpty**(): `boolean`

Gets whether or not the current instance is empty.

#### Returns

`boolean`

---

### isReadOnly

• `get` **isReadOnly**(): `boolean`

Gets whether or not the current instance is flagged as read-only on disk.

#### Returns

`boolean`

---

### key

• `get` **key**(): `string`

Gets the key that specified the contents of the item.

**`Remarks`**

This value is used for specifying the contents of the item in a common and
consistent fashion. For example, `TITLE` specifies that the item contains the title of
the track.

#### Returns

`string`

---

### size

• `get` **size**(): `number`

Size of the current instance as it last appeared on disk.

#### Returns

`number`

---

### text

• `get` **text**(): `string`[]

Gets the string values stored in the current item, if the current item is a text item, or
an empty array if the current item is a binary item or no text is stored.

#### Returns

`string`[]

---

### type

• `get` **type**(): [`ApeTagItemType`](../enums/ApeTagItemType.md)

Gets the type of value contained in the current instance.

#### Returns

[`ApeTagItemType`](../enums/ApeTagItemType.md)

---

### value

• `get` **value**(): [`ByteVector`](ByteVector.md)

Gets the binary value stored in the current item, if the current item is a binary item, or
`undefined` if the current item is a text item.

#### Returns

[`ByteVector`](ByteVector.md)

## Methods

### clone

▸ **clone**(): [`ApeTagItem`](ApeTagItem.md)

Creates a deep copy of the current instance.

#### Returns

[`ApeTagItem`](ApeTagItem.md)

---

### render

▸ **render**(): [`ByteVector`](ByteVector.md)

Renders the current instance as an APEv2 item.

#### Returns

[`ByteVector`](ByteVector.md)

---

### toString

▸ **toString**(): `string`

Gets the contents of the current instance as a string. If the current instance is binary or
does not have a text array, `undefined` will be returned. Otherwise, the text values will be
joined into a single, comma separated list.

#### Returns

`string`

---

### fromBinaryValue

▸ `Static` **fromBinaryValue**(`key`, `value`): [`ApeTagItem`](ApeTagItem.md)

Constructs and initializes a new instance of [ApeTagItem](ApeTagItem.md) with a specified key and binary
data to use as the value.

#### Parameters

| Name    | Type                          | Description                       |
| :------ | :---------------------------- | :-------------------------------- |
| `key`   | `string`                      | Key to use for the item           |
| `value` | [`ByteVector`](ByteVector.md) | Binary data to store as the value |

#### Returns

[`ApeTagItem`](ApeTagItem.md)

---

### fromData

▸ `Static` **fromData**(`data`, `offset`): [`ApeTagItem`](ApeTagItem.md)

Constructs a new instance of [ApeTagItem](ApeTagItem.md) by reading in a raw APEv2 item.

#### Parameters

| Name     | Type                          | Description                                                                                   |
| :------- | :---------------------------- | :-------------------------------------------------------------------------------------------- |
| `data`   | [`ByteVector`](ByteVector.md) | [ByteVector](ByteVector.md) containing the item to read                                       |
| `offset` | `number`                      | Index into `data` at which to begin reading the item data. Must be a positive 32-bit integer. |

#### Returns

[`ApeTagItem`](ApeTagItem.md)

---

### fromTextValues

▸ `Static` **fromTextValues**(`key`, `...values`): [`ApeTagItem`](ApeTagItem.md)

Constructs and initializes a new instance of [ApeTagItem](ApeTagItem.md) with a specified key and collection
of text values.

#### Parameters

| Name        | Type       | Description                 |
| :---------- | :--------- | :-------------------------- |
| `key`       | `string`   | Key to use for the item     |
| `...values` | `string`[] | Values to store in the item |

#### Returns

[`ApeTagItem`](ApeTagItem.md)
