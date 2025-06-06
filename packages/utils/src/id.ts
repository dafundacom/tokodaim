import { customAlphabet } from "nanoid"

export const createId = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  40,
)

export const uniqueCharacter = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
  5,
)
