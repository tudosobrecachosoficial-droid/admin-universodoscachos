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
          onClick={() => editor.chain().toggleBold().run()}
          className={`px-3 py-1 rounded ${editor.isActive('bold') ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Negrito
        </button>
        <button
          onClick={() => editor.chain().toggleItalic().run()}
          className={`px-3 py-1 rounded ${editor.isActive('italic') ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Itálico
        </button>
        <button
          onClick={() => editor.chain().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${editor.isActive('bulletList') ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Lista
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="min-h-[400px] p-4 focus:outline-none"
      />
    </div>
  )
}
