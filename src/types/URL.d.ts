/* eslint-disable */

// Definition of URL and URLSearchParams type
// Copied from https://github.com/microsoft/TypeScript/blob/bbb31bb109d8c2366dd24725a34ea9bf2a35f3b1/lib/lib.dom.d.ts#L14918-L14983
// and https://github.com/microsoft/TypeScript/blob/bbb31bb109d8c2366dd24725a34ea9bf2a35f3b1/lib/lib.dom.iterable.d.ts#L284-L298
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache License, Version 2.0.

/** The URL interface represents an object providing static methods used for creating object URLs. */
interface URL {
  hash: string
  host: string
  hostname: string
  href: string
  toString(): string
  readonly origin: string
  password: string
  pathname: string
  port: string
  protocol: string
  search: string
  readonly searchParams: URLSearchParams
  username: string
  toJSON(): string
}

declare var URL: {
  prototype: URL
  new (url: string | URL, base?: string | URL): URL
  createObjectURL(object: any): string
  revokeObjectURL(url: string): void
}

interface URLSearchParams {
  /**
   * Appends a specified key/value pair as a new search parameter.
   */
  append(name: string, value: string): void
  /**
   * Deletes the given search parameter, and its associated value, from the list of all search parameters.
   */
  delete(name: string): void
  /**
   * Returns the first value associated to the given search parameter.
   */
  get(name: string): string | null
  /**
   * Returns all the values association with a given search parameter.
   */
  getAll(name: string): string[]
  /**
   * Returns a Boolean indicating if such a search parameter exists.
   */
  has(name: string): boolean
  /**
   * Sets the value associated to a given search parameter to the given value. If there were several values, delete the others.
   */
  set(name: string, value: string): void
  sort(): void
  /**
   * Returns a string containing a query string suitable for use in a URL. Does not include the question mark.
   */
  toString(): string
  forEach(
    callbackfn: (value: string, key: string, parent: URLSearchParams) => void,
    thisArg?: any
  ): void

  [Symbol.iterator](): IterableIterator<[string, string]>
  /**
   * Returns an array of key, value pairs for every entry in the search params.
   */
  entries(): IterableIterator<[string, string]>
  /**
   * Returns a list of keys in the search params.
   */
  keys(): IterableIterator<string>
  /**
   * Returns a list of values in the search params.
   */
  values(): IterableIterator<string>
}

declare var URLSearchParams: {
  prototype: URLSearchParams
  new (
    init?: string[][] | Record<string, string> | string | URLSearchParams
  ): URLSearchParams
  toString(): string
}

interface URLSearchParams {
  [Symbol.iterator](): IterableIterator<[string, string]>
  /**
   * Returns an array of key, value pairs for every entry in the search params.
   */
  entries(): IterableIterator<[string, string]>
  /**
   * Returns a list of keys in the search params.
   */
  keys(): IterableIterator<string>
  /**
   * Returns a list of values in the search params.
   */
  values(): IterableIterator<string>
}
