[node-taglib-sharp](../README.md) / [Exports](../modules.md) / Mpeg4IsoUserDataBox

# Class: Mpeg4IsoUserDataBox

This class extends [Mpeg4Box](Mpeg4Box.md) to provide an implementation of a ISO/IEC 14496-12 UserDataBox.

## Hierarchy

- [`Mpeg4Box`](Mpeg4Box.md)

  ↳ **`Mpeg4IsoUserDataBox`**

## Table of contents

### Accessors

- [boxType](Mpeg4IsoUserDataBox.md#boxtype)
- [data](Mpeg4IsoUserDataBox.md#data)
- [dataPosition](Mpeg4IsoUserDataBox.md#dataposition)
- [dataSize](Mpeg4IsoUserDataBox.md#datasize)
- [handlerType](Mpeg4IsoUserDataBox.md#handlertype)
- [hasChildren](Mpeg4IsoUserDataBox.md#haschildren)
- [header](Mpeg4IsoUserDataBox.md#header)
- [parentTree](Mpeg4IsoUserDataBox.md#parenttree)
- [size](Mpeg4IsoUserDataBox.md#size)

### Methods

- [addChild](Mpeg4IsoUserDataBox.md#addchild)
- [clearChildren](Mpeg4IsoUserDataBox.md#clearchildren)
- [getChild](Mpeg4IsoUserDataBox.md#getchild)
- [getChildRecursively](Mpeg4IsoUserDataBox.md#getchildrecursively)
- [getChildren](Mpeg4IsoUserDataBox.md#getchildren)
- [increaseDataPosition](Mpeg4IsoUserDataBox.md#increasedataposition)
- [initializeFromHeader](Mpeg4IsoUserDataBox.md#initializefromheader)
- [initializeFromType](Mpeg4IsoUserDataBox.md#initializefromtype)
- [loadData](Mpeg4IsoUserDataBox.md#loaddata)
- [removeChildByBox](Mpeg4IsoUserDataBox.md#removechildbybox)
- [removeChildByType](Mpeg4IsoUserDataBox.md#removechildbytype)
- [removeChildrenByBox](Mpeg4IsoUserDataBox.md#removechildrenbybox)
- [fromEmpty](Mpeg4IsoUserDataBox.md#fromempty)
- [fromHeader](Mpeg4IsoUserDataBox.md#fromheader)

## Accessors

### boxType

• `get` **boxType**(): [`ByteVector`](ByteVector.md)

Gets the MPEG-4 box type of the current instance.

#### Returns

[`ByteVector`](ByteVector.md)

#### Inherited from

Mpeg4Box.boxType

---

### data

• `get` **data**(): [`ByteVector`](ByteVector.md)

Gets the data contained in the current instance.

#### Returns

[`ByteVector`](ByteVector.md)

#### Inherited from

Mpeg4Box.data

• `set` **data**(`v`): `void`

Sets the data contained in the current instance.

#### Parameters

| Name | Type                          |
| :--- | :---------------------------- |
| `v`  | [`ByteVector`](ByteVector.md) |

#### Returns

`void`

#### Inherited from

Mpeg4Box.data

---

### dataPosition

• `get` **dataPosition**(): `number`

Gets the position of the data contained in the current instance, after any box specific headers.

#### Returns

`number`

#### Inherited from

Mpeg4Box.dataPosition

---

### dataSize

• `get` **dataSize**(): `number`

Gets the size of the data contained in the current instance, minus the size of any box specific headers.

#### Returns

`number`

#### Inherited from

Mpeg4Box.dataSize

---

### handlerType

• `get` **handlerType**(): [`ByteVector`](ByteVector.md)

Gets the type of the handler box that applies to the current instance.

#### Returns

[`ByteVector`](ByteVector.md)

#### Inherited from

Mpeg4Box.handlerType

---

### hasChildren

• `get` **hasChildren**(): `boolean`

Gets whether or not the current instance has children.

#### Returns

`boolean`

#### Inherited from

Mpeg4Box.hasChildren

---

### header

• `get` **header**(): [`Mpeg4BoxHeader`](Mpeg4BoxHeader.md)

Gets the header of the current instance.

#### Returns

[`Mpeg4BoxHeader`](Mpeg4BoxHeader.md)

#### Inherited from

Mpeg4Box.header

---

### parentTree

• `get` **parentTree**(): [`Mpeg4BoxHeader`](Mpeg4BoxHeader.md)[]

Gets the box headers for the current "udta" box and all parent boxes up to the top of the file.

**`Remarks`**

Changes to the returned object will not be honored. Set the property to change it.

#### Returns

[`Mpeg4BoxHeader`](Mpeg4BoxHeader.md)[]

---

### size

• `get` **size**(): `number`

Gets the total size of the current instance as it last appeared on disk.

#### Returns

`number`

#### Inherited from

Mpeg4Box.size

## Methods

### addChild

▸ **addChild**(`box`): `void`

Adds a specified box to the current instance.

**`See`**

Mpeg4Box object to add to the current instance.

#### Parameters

| Name  | Type                      | Description |
| :---- | :------------------------ | :---------- |
| `box` | [`Mpeg4Box`](Mpeg4Box.md) | A           |

#### Returns

`void`

#### Inherited from

[Mpeg4Box](Mpeg4Box.md).[addChild](Mpeg4Box.md#addchild)

---

### clearChildren

▸ **clearChildren**(): `void`

Removes all children from the current instance.

#### Returns

`void`

#### Inherited from

[Mpeg4Box](Mpeg4Box.md).[clearChildren](Mpeg4Box.md#clearchildren)

---

### getChild

▸ **getChild**<`TBox`\>(`type`, `predicate?`): `TBox`

Gets a child box from the current instance by finding a matching box type.

**`See`**

ByteVector object containing the box type to match.

#### Type parameters

| Name   | Type                                       |
| :----- | :----------------------------------------- |
| `TBox` | extends [`Mpeg4Box`](Mpeg4Box.md)<`TBox`\> |

#### Parameters

| Name         | Type                          | Description                                                |
| :----------- | :---------------------------- | :--------------------------------------------------------- |
| `type`       | [`ByteVector`](ByteVector.md) | A                                                          |
| `predicate?` | (`b`: `TBox`) => `boolean`    | Optional predicate to filter boxes with the provided type. |

#### Returns

`TBox`

TBox Box containing the matched box, or `undefined` if no match was found.

#### Inherited from

[Mpeg4Box](Mpeg4Box.md).[getChild](Mpeg4Box.md#getchild)

---

### getChildRecursively

▸ **getChildRecursively**(`type`): [`Mpeg4Box`](Mpeg4Box.md)

Gets a child box from the current instance by finding a matching box type, searching recursively.

**`See`**

ByteVector object containing the box type to match.

#### Parameters

| Name   | Type                          | Description |
| :----- | :---------------------------- | :---------- |
| `type` | [`ByteVector`](ByteVector.md) | A           |

#### Returns

[`Mpeg4Box`](Mpeg4Box.md)

Mpeg4Box Matching box, or `undefined` if no matching box was found

#### Inherited from

[Mpeg4Box](Mpeg4Box.md).[getChildRecursively](Mpeg4Box.md#getchildrecursively)

---

### getChildren

▸ **getChildren**<`TBox`\>(`type`, `predicate?`): `TBox`[]

Gets all child boxes from the current instance by finding a matching box type.

**`See`**

ByteVector object containing the box type to match.

#### Type parameters

| Name   | Type                                       |
| :----- | :----------------------------------------- |
| `TBox` | extends [`Mpeg4Box`](Mpeg4Box.md)<`TBox`\> |

#### Parameters

| Name         | Type                          | Description                                                |
| :----------- | :---------------------------- | :--------------------------------------------------------- |
| `type`       | [`ByteVector`](ByteVector.md) | A                                                          |
| `predicate?` | (`b`: `TBox`) => `boolean`    | Optional predicate to filter boxes with the provided type. |

#### Returns

`TBox`[]

Mpeg4Box[] Array of matching boxes, or `undefined` if no matching boxes was found.

#### Inherited from

[Mpeg4Box](Mpeg4Box.md).[getChildren](Mpeg4Box.md#getchildren)

---

### increaseDataPosition

▸ **increaseDataPosition**(`value`): `number`

Increases the data position by a given value. This function can be used by boxes
which extend from

**`See`**

Mpeg4Box to increase the data position, because the data
is located after their box specific headers.

#### Parameters

| Name    | Type     | Description                            |
| :------ | :------- | :------------------------------------- |
| `value` | `number` | The value to add to the data position. |

#### Returns

`number`

number Data position before the increase.

#### Inherited from

[Mpeg4Box](Mpeg4Box.md).[increaseDataPosition](Mpeg4Box.md#increasedataposition)

---

### initializeFromHeader

▸ `Protected` **initializeFromHeader**(`header`, `handlerType?`): `void`

Initializes a new instance of

**`See`**

- Mpeg4Box with a specified header and handler.
- Mpeg4BoxHeader object describing the new instance.

#### Parameters

| Name           | Type                                  | Description                                                                                                                 |
| :------------- | :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------- |
| `header`       | [`Mpeg4BoxHeader`](Mpeg4BoxHeader.md) | A                                                                                                                           |
| `handlerType?` | [`ByteVector`](ByteVector.md)         | Type of the handler box object containing the handler that applies to the new instance, or undefined if no handler applies. |

#### Returns

`void`

#### Inherited from

[Mpeg4Box](Mpeg4Box.md).[initializeFromHeader](Mpeg4Box.md#initializefromheader)

---

### initializeFromType

▸ `Protected` **initializeFromType**(`type`): `void`

Initializes a new instance of

**`See`**

- Mpeg4Box with a specified box type.
- ByteVector object containing the box type to use for the new instance.

#### Parameters

| Name   | Type                          | Description |
| :----- | :---------------------------- | :---------- |
| `type` | [`ByteVector`](ByteVector.md) | A           |

#### Returns

`void`

#### Inherited from

[Mpeg4Box](Mpeg4Box.md).[initializeFromType](Mpeg4Box.md#initializefromtype)

---

### loadData

▸ **loadData**(`file`): [`ByteVector`](ByteVector.md)

Loads the data of the current instance from a specified file using the internal data position and size.

**`See`**

File from which the current instance was read and from which to read the data.

#### Parameters

| Name   | Type              | Description |
| :----- | :---------------- | :---------- |
| `file` | [`File`](File.md) | The         |

#### Returns

[`ByteVector`](ByteVector.md)

ByteVector Data read from the file.

#### Inherited from

[Mpeg4Box](Mpeg4Box.md).[loadData](Mpeg4Box.md#loaddata)

---

### removeChildByBox

▸ **removeChildByBox**(`box`): `void`

Removes a specified box from the current instance.

#### Parameters

| Name  | Type                      | Description                              |
| :---- | :------------------------ | :--------------------------------------- |
| `box` | [`Mpeg4Box`](Mpeg4Box.md) | Box to remove from the current instance. |

#### Returns

`void`

#### Inherited from

[Mpeg4Box](Mpeg4Box.md).[removeChildByBox](Mpeg4Box.md#removechildbybox)

---

### removeChildByType

▸ **removeChildByType**(`type`): `void`

Removes all children with a specified box type from the current instance.

#### Parameters

| Name   | Type                          | Description           |
| :----- | :---------------------------- | :-------------------- |
| `type` | [`ByteVector`](ByteVector.md) | Type of box to remove |

#### Returns

`void`

#### Inherited from

[Mpeg4Box](Mpeg4Box.md).[removeChildByType](Mpeg4Box.md#removechildbytype)

---

### removeChildrenByBox

▸ **removeChildrenByBox**(`boxes`): `void`

Removes all specified boxes from the current instance.

#### Parameters

| Name    | Type                        | Description                                              |
| :------ | :-------------------------- | :------------------------------------------------------- |
| `boxes` | [`Mpeg4Box`](Mpeg4Box.md)[] | Collection of boxes to remove from the current instance. |

#### Returns

`void`

#### Inherited from

[Mpeg4Box](Mpeg4Box.md).[removeChildrenByBox](Mpeg4Box.md#removechildrenbybox)

---

### fromEmpty

▸ `Static` **fromEmpty**(): [`Mpeg4IsoUserDataBox`](Mpeg4IsoUserDataBox.md)

Constructs and initializes a new instance of

**`See`**

IsoUserDataBox with no children.

#### Returns

[`Mpeg4IsoUserDataBox`](Mpeg4IsoUserDataBox.md)

---

### fromHeader

▸ `Static` **fromHeader**(`header`, `handlerType`): [`Mpeg4IsoUserDataBox`](Mpeg4IsoUserDataBox.md)

Constructs and initializes a new instance of IsoUserDataBox with a provided header and
handler by reading the contents from a specified file.

#### Parameters

| Name          | Type                                  | Description                                                                                                                 |
| :------------ | :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------- |
| `header`      | [`Mpeg4BoxHeader`](Mpeg4BoxHeader.md) | A [Mpeg4BoxHeader](Mpeg4BoxHeader.md) object containing the header to use for the new instance.                             |
| `handlerType` | [`ByteVector`](ByteVector.md)         | Type of the handler box object containing the handler that applies to the new instance, or undefined if no handler applies. |

#### Returns

[`Mpeg4IsoUserDataBox`](Mpeg4IsoUserDataBox.md)
