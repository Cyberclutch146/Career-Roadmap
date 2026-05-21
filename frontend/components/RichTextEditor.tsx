'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  Quote,
  Heading2
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  const ToggleButton = ({ 
    isActive, 
    onClick, 
    children 
  }: { 
    isActive: boolean; 
    onClick: () => void; 
    children: React.ReactNode 
  }) => (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors ${
        isActive 
          ? 'bg-primary/20 text-primary' 
          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border p-2 bg-surface-container-high rounded-t-xl">
      <ToggleButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
      >
        <Bold className="w-4 h-4" />
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
      >
        <Italic className="w-4 h-4" />
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
      >
        <Strikethrough className="w-4 h-4" />
      </ToggleButton>
      
      <div className="w-px h-5 bg-border mx-1" />
      
      <ToggleButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 className="w-4 h-4" />
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
      >
        <List className="w-4 h-4" />
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
      >
        <ListOrdered className="w-4 h-4" />
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
      >
        <Quote className="w-4 h-4" />
      </ToggleButton>
      
      <div className="w-px h-5 bg-border mx-1" />

      <ToggleButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
      >
        <Code className="w-4 h-4" />
      </ToggleButton>
    </div>
  )
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[300px] p-4 focus:outline-none focus:ring-0',
      },
    },
  })

  // Add styles for the placeholder extension to work correctly
  return (
    <div className="border border-border rounded-xl bg-surface flex flex-col h-full overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .is-editor-empty:first-child::before {
          color: #a1a1aa;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}} />
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
