/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import * as React from "react"
import { Extension, type Range, type Editor as TextEditor } from "@tiptap/core"
import { ReactRenderer } from "@tiptap/react"
import Suggestion from "@tiptap/suggestion"
import { Icon } from "@yopem-ui/react-icons"
import tippy from "tippy.js"

interface TextEditorCommandItemProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick?: () => void
}

interface TextEditorCommandProps {
  editor: TextEditor
  range: Range
}

const TextEditorCommand = Extension.create({
  name: "text-editor-slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: TextEditor
          range: Range
          props: any
        }) => {
          props.command({ editor, range })
        },
      },
    }
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: "Text",
      description: "Just start typing with plain text.",
      searchTerms: ["p", "paragraph"],
      icon: <Icon name="Text" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .run()
      },
    },
    {
      title: "Heading 1",
      description: "H1 section heading.",
      searchTerms: ["title", "big", "large"],
      icon: <Icon name="Heading1" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run()
      },
    },
    {
      title: "Heading 2",
      description: "H2 section heading.",
      searchTerms: ["subtitle", "medium"],
      icon: <Icon name="Heading2" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run()
      },
    },
    {
      title: "Heading 3",
      description: "H3 section heading.",
      searchTerms: ["subtitle", "small"],
      icon: <Icon name="Heading3" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run()
      },
    },
    {
      title: "Heading 4",
      description: "H4 section heading.",
      searchTerms: ["subtitle", "small"],
      icon: <Icon name="Heading4" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 4 })
          .run()
      },
    },
    {
      title: "Heading 5",
      description: "H5 section heading.",
      searchTerms: ["subtitle", "small"],
      icon: <Icon name="Heading5" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 5 })
          .run()
      },
    },
    {
      title: "Youtube",
      description: "Add Youtube Video.",
      searchTerms: ["youtube"],
      icon: <Icon name="Youtube" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor.chain().focus().deleteRange(range).run()
        const url = prompt("Enter YouTube URL")

        if (url && url.includes("youtube.com")) {
          editor.commands.setYoutubeVideo({
            src: url,
            width: 640,
            height: 480,
          })
        }
      },
    },
    {
      title: "X",
      description: "Add X Tweet.",
      searchTerms: ["x"],
      icon: <Icon name="X" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor.chain().focus().deleteRange(range).run()
        const url = prompt("Enter X Tweet URL")
        const regex = /^https?:\/\/twitter\.com\/\w+\/status\/(\d+).*$/

        // FIX: later
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        if (url && url.match(regex)) {
          // const match = url.match(regex)
          editor.commands.insertContent({
            type: "reactXEmbed",
            attrs: {
              tweetUrl: url,
            },
          })
        }
      },
    },
    {
      title: "Facebook",
      description: "Add Facebook Embed.",
      searchTerms: ["facebook"],
      icon: <Icon name="Facebook" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor.chain().focus().deleteRange(range).run()
        const url = prompt("Enter Facebook URL")

        if (url) {
          // const match = url.match(regex)
          editor.commands.insertContent({
            type: "reactFacebookEmbed",
            attrs: {
              facebookUrl: url,
            },
          })
        }
      },
    },
    {
      title: "Horizontal Rule",
      description: "Add Horizontal Rule.",
      searchTerms: ["horizontal-rule"],
      icon: <Icon name="Minus" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor.chain().focus().deleteRange(range).run()
        editor.commands.setHorizontalRule()
      },
    },
    {
      title: "Button",
      description: "Add Button.",
      searchTerms: ["button"],
      icon: <Icon name="Plus" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent("<react-button>Text</react-button>")
          .run()
      },
    },

    {
      title: "Bullet List",
      description: "Add Bullet List.",
      searchTerms: ["bulletList"],
      icon: <Icon name="List" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor.chain().focus().deleteRange(range).toggleWrap("bulletList").run()
      },
    },
    {
      title: "Table",
      description: "Add Table.",
      searchTerms: ["table"],
      icon: <Icon name="Table" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run()
      },
    },

    {
      title: "Ordered List",
      description: "Add Ordered List.",
      searchTerms: ["orderedList"],
      icon: <Icon name="ListOrdered" />,
      command: ({ editor, range }: TextEditorCommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleWrap("orderedList")
          .run()
      },
    },
    {
      title: "Code",
      description: "Capture a code snippet.",
      searchTerms: ["codeblock"],
      icon: <Icon name="Code" />,
      command: ({ editor, range }: TextEditorCommandProps) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: "Quote",
      description: "Add blockquote.",
      searchTerms: ["blockquote"],
      icon: <Icon name="Quote" />,
      command: ({ editor, range }: TextEditorCommandProps) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleWrap("blockquote")
          .run(),
    },
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      const search = query.toLowerCase()
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.searchTerms.some((term: string) => term.includes(search))
      )
    }
    return true
  })
}

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight
  const itemHeight = item.offsetHeight || 0

  const top = item.offsetTop
  const bottom = top + itemHeight

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5
  }
}

const TextEditorCommandList = ({
  items,
  command,
}: {
  items: TextEditorCommandItemProps[]
  command: any
  editor: any
  range: any
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0)

  const selectItem = React.useCallback(
    (index: number) => {
      const item = items[index]
      command(item)
    },
    [command, items],
  )

  React.useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"]
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault()
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length)
          return true
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length)
          return true
        }
        if (e.key === "Enter") {
          selectItem(selectedIndex)
          return true
        }
        return false
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [items, selectedIndex, setSelectedIndex, selectItem])

  React.useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  const commandListContainer = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const container = commandListContainer.current

    const item = container?.children[selectedIndex] as HTMLElement

    if (container) updateScrollView(container, item)
  }, [selectedIndex])

  return items.length > 0 ? (
    <div
      id="text-editor-slash-command"
      ref={commandListContainer}
      className="z-10 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border bg-background px-1 py-2 shadow-md transition-all"
    >
      {items.map((item: TextEditorCommandItemProps, index: number) => {
        return (
          <button
            className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-foreground hover:bg-background/20 ${
              index === selectedIndex ? "bg-background/80 text-foreground" : ""
            }`}
            key={index}
            onClick={() => {
              selectItem(index)
            }}
          >
            <div className="flex size-10 items-center justify-center rounded-md border bg-background">
              {item.title === "Continue writing" ? "Loading..." : item.icon}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  ) : null
}

const renderItems = () => {
  let component: ReactRenderer | null = null
  let popup: any = null

  return {
    onStart: (props: {
      editor: TextEditor
      clientRect: DOMRect
      range: any
    }) => {
      component = new ReactRenderer(TextEditorCommandList, {
        props,
        editor: props.editor,
      })

      //@ts-expect-error
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        zIndex: 40,
        trigger: "manual",
        placement: "bottom-start",
      })
    },
    onUpdate: (props: { editor: TextEditor; clientRect: DOMRect }) => {
      component?.updateProps(props)

      if (popup) {
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      }
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide()

        return true
      }

      //@ts-expect-error
      return component?.ref?.onKeyDown(props)
    },
    onExit: () => {
      popup?.[0].destroy()
      component?.destroy()
    },
  }
}

export const TextEditorCommandMenu = TextEditorCommand.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems,
  },
})
