import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return <div>Carregando editor...</div>

  return (
    <div className="border rounded-lg">
      <div className="flex gap-2 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${editor.isActive('bold') ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Negrito
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${editor.isActive('italic') ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Itálico
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Título
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${editor.isActive('bulletList') ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Lista
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded ${editor.isActive('orderedList') ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Lista numerada
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded ${editor.isActive('blockquote') ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Citação
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="min-h-[400px] p-4 focus:outline-none"
      />
    </div>
  )
}
