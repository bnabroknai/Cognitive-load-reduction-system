import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cn } from "./utils.ts";

describe("cn", () => {
  it("merges class names", () => {
    assert.strictEqual(cn("foo", "bar"), "foo bar");
  });

  it("handles conditional classes", () => {
    assert.strictEqual(cn("foo", true && "bar", false && "baz"), "foo bar");
  });

  it("handles objects", () => {
    assert.strictEqual(cn({ foo: true, bar: false, baz: true }), "foo baz");
  });

  it("handles arrays", () => {
    assert.strictEqual(cn(["foo", "bar"], "baz"), "foo bar baz");
  });

  it("handles nested arrays and objects", () => {
    assert.strictEqual(cn(["foo", { bar: true, baz: false }], "qux"), "foo bar qux");
  });

  it("resolves tailwind conflicts", () => {
    // This depends on twMerge working correctly
    assert.strictEqual(cn("p-4", "p-2"), "p-2");
    assert.strictEqual(cn("text-red-500", "text-blue-500"), "text-blue-500");
  });

  it("handles empty and weird inputs", () => {
    assert.strictEqual(cn(""), "");
    assert.strictEqual(cn(null as any, undefined as any, false as any, ""), "");
  });
});
