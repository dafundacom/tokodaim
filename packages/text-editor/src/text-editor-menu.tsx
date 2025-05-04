/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import * as React from "react"
import { BubbleMenu } from "@tiptap/react"
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "@tokodaim/ui"
import { Icon } from "@yopem-ui/react-icons"

import { TextEditorColorSelector } from "./text-editor-color-selector"

export function TextEditorMenu(props: any) {
  const { editor } = props

  const addLink = React.useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    if (url === null) {
      return
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  return (
    <>
      {editor && (
        <BubbleMenu
          pluginKey="default-menu"
          shouldShow={({ state, editor }) => {
            const { selection } = state
            const { empty } = selection

            if (editor.isActive("table") || empty) {
              return false
            }
            return true
          }}
          className="flex w-full space-x-2 rounded-lg border-border bg-background p-1 shadow-sm"
          tippyOptions={{ duration: 100, placement: "top-end" }}
          editor={editor}
        >
          <Button
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleBold().run()
            }}
            size="icon"
            variant={editor.isActive("bold") ? "outline" : "ghost"}
          >
            <Icon name="Bold" />
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleItalic().run()
            }}
            variant={editor.isActive("italic") ? "outline" : "ghost"}
            size="icon"
          >
            <Icon name="Italic" />
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleUnderline().run()
            }}
            variant={editor.isActive("underline") ? "outline" : "ghost"}
            size="icon"
          >
            <Icon name="Underline" />
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleStrike().run()
            }}
            variant={editor.isActive("strike") ? "outline" : "ghost"}
            size="icon"
          >
            <Icon name="Strikethrough" />
          </Button>
          <Button
            onClick={addLink}
            variant={editor.isActive("link") ? "outline" : "ghost"}
            size="icon"
          >
            <Icon name="Link" />
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleCodeBlock().run()
            }}
            variant={editor.isActive("codeBlock") ? "outline" : "ghost"}
            size="icon"
          >
            <Icon name="Code" />
          </Button>
          <TextEditorColorSelector editor={editor} />
        </BubbleMenu>
      )}
      {editor && (
        <BubbleMenu
          pluginKey="table-menu"
          shouldShow={() => {
            if (editor.isActive("table")) {
              return true
            }
            return false
          }}
          className="flex w-full space-x-2 rounded-lg border-border bg-background p-1 shadow-sm"
          tippyOptions={{
            duration: 100,
            offset: [0, 30],
            placement: "top-end",
          }}
          editor={editor}
        >
          <Button
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleBold().run()
            }}
            variant={editor.isActive("bold") ? "outline" : "ghost"}
            size="icon"
          >
            <Icon name="Bold" />
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleItalic().run()
            }}
            variant={editor.isActive("italic") ? "outline" : "ghost"}
            size="icon"
          >
            <Icon name="Italic" />
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleUnderline().run()
            }}
            variant={editor.isActive("underline") ? "outline" : "ghost"}
            size="icon"
          >
            <Icon name="Underline" />
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleStrike().run()
            }}
            variant={editor.isActive("strike") ? "outline" : "ghost"}
            size="icon"
          >
            <Icon name="Strikethrough" />
          </Button>
          <Button
            onClick={addLink}
            variant={editor.isActive("link") ? "outline" : "ghost"}
            size="icon"
          >
            <Icon name="Link" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="cursor-pointer bg-background"
                size="icon"
              >
                <Icon name="Table" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="flex w-[220px] flex-col overflow-y-auto bg-background p-0 shadow-md"
            >
              <ScrollArea className="h-72 rounded-md p-2">
                <div className="flex flex-col items-start space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                        .run()
                    }
                  >
                    Insert Table
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      editor.chain().focus().addColumnBefore().run()
                    }
                  >
                    Add Column Before
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      editor.chain().focus().addColumnAfter().run()
                    }
                  >
                    Add Column After
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                  >
                    Delete Column
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                  >
                    Add Row Before
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                  >
                    Add Row After
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().deleteRow().run()}
                  >
                    Delete Row
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().deleteTable().run()}
                  >
                    Delete Table
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().mergeCells().run()}
                  >
                    Merge Cells
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().splitCell().run()}
                  >
                    Split Cell
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      editor.chain().focus().toggleHeaderColumn().run()
                    }
                  >
                    Toggle Header Column
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      editor.chain().focus().toggleHeaderRow().run()
                    }
                  >
                    Toggle Header Row
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      editor.chain().focus().toggleHeaderCell().run()
                    }
                  >
                    Toggle Header Cell
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().mergeOrSplit().run()}
                  >
                    Merge Or Split
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .setCellAttribute("colspan", 2)
                        .run()
                    }
                  >
                    Set Cell Attribute
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().fixTables().run()}
                  >
                    Fix Tables
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().goToNextCell().run()}
                  >
                    Go To Next Cell
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      editor.chain().focus().goToPreviousCell().run()
                    }
                  >
                    Go To Previous Cell
                  </Button>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </BubbleMenu>
      )}
    </>
  )
}
