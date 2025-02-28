[node-taglib-sharp](../README.md) / [Exports](../modules.md) / AsfHeaderExtensionObject

# Class: AsfHeaderExtensionObject

This class extends BaseObject to provide a representation of an ASF header extension
object which can be read from and written to disk.

## Hierarchy

- [`AsfBaseObject`](AsfBaseObject.md)

  ↳ **`AsfHeaderExtensionObject`**

## Table of contents

### Accessors

- [children](AsfHeaderExtensionObject.md#children)
- [guid](AsfHeaderExtensionObject.md#guid)
- [objectType](AsfHeaderExtensionObject.md#objecttype)
- [originalSize](AsfHeaderExtensionObject.md#originalsize)

### Methods

- [addUniqueObject](AsfHeaderExtensionObject.md#adduniqueobject)
- [initializeFromFile](AsfHeaderExtensionObject.md#initializefromfile)
- [initializeFromGuid](AsfHeaderExtensionObject.md#initializefromguid)
- [render](AsfHeaderExtensionObject.md#render)
- [renderInternal](AsfHeaderExtensionObject.md#renderinternal)
- [fromFile](AsfHeaderExtensionObject.md#fromfile)

## Accessors

### children

• `get` **children**(): [`AsfBaseObject`](AsfBaseObject.md)[]

Gets the child ASF objects contained in the current instance.

**`Remarks`**

The returned array is a copy of the array of children inside this object. Any
changes to this array will not be reflected in the object.

    Only certain objects are valid inside a header extension object. Any objects that are
    not valid or not supported are read as UnknownObject.

#### Returns

[`AsfBaseObject`](AsfBaseObject.md)[]

---

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

## Methods

### addUniqueObject

▸ **addUniqueObject**(`obj`): `void`

Adds a unique child object to the current instance, replacing an existing child if present.

#### Parameters

| Name  | Type                                | Description                           |
| :---- | :---------------------------------- | :------------------------------------ |
| `obj` | [`AsfBaseObject`](AsfBaseObject.md) | Object to add to the current instance |

#### Returns

`void`

---

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

Child classes implementing [()](AsfHeaderExtensionObject.md#render) should render their contents and then
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

▸ `Static` **fromFile**(`file`, `position`): [`AsfHeaderExtensionObject`](AsfHeaderExtensionObject.md)

Constructs and initialized a new instance by reading the contents from a specified position
in the provided file.

#### Parameters

| Name       | Type              | Description                                                      |
| :--------- | :---------------- | :--------------------------------------------------------------- |
| `file`     | [`File`](File.md) | File containing contents that will be read into the new instance |
| `position` | `number`          | Position in the file where the instance begins                   |

#### Returns

[`AsfHeaderExtensionObject`](AsfHeaderExtensionObject.md)
