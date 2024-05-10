import { customAlphabet } from "nanoid"

export const uniqueCharacter = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
  5,
)

export const cuid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  40,
)
