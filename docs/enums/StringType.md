[node-taglib-sharp](../README.md) / [Exports](../modules.md) / StringType

# Enumeration: StringType

**`Summary`**

Specifies the text encoding used when converting betweenInclusive a string and a
[ByteVector](../classes/ByteVector.md).

**`Remarks`**

This enumeration is used by [fromString](../classes/ByteVector.md#fromstring) and
[toString](../classes/ByteVector.md#tostring)

## Table of contents

### Enumeration Members

- [Hex](StringType.md#hex)
- [Latin1](StringType.md#latin1)
- [UTF16](StringType.md#utf16)
- [UTF16BE](StringType.md#utf16be)
- [UTF16LE](StringType.md#utf16le)
- [UTF8](StringType.md#utf8)

## Enumeration Members

### Hex

• **Hex** = `5`

**`Summary`**

The string is to be encoded as a hex string for each byte (eg, 0x00, 0x12, 0xAF).
Intended to be used for debugging purposes, only.

---

### Latin1

• **Latin1** = `0`

**`Summary`**

The string is to be Latin-1 encoded.

---

### UTF16

• **UTF16** = `1`

**`Summary`**

The string is to be UTF-16 encoded.

---

### UTF16BE

• **UTF16BE** = `2`

**`Summary`**

The string is to be UTF-16BE encoded.

---

### UTF16LE

• **UTF16LE** = `4`

**`Summary`**

The string is to be UTF-16LE encoded.

---

### UTF8

• **UTF8** = `3`

**`Summary`**

The string is to be UTF-8 encoded.
