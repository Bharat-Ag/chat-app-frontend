import { useEditor, EditorContent } from '@tiptap/react'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useCallback, useContext } from 'react'
import Placeholder from '@tiptap/extension-placeholder'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const extensions = [
    StarterKit,
    Image,
    Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        Placeholder: 'Write something …',
        isAllowedUri: (url, ctx) => {
            try {
                const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)
                if (!ctx.defaultValidate(parsedUrl.href)) return false
                const disallowedProtocols = ['ftp', 'file', 'mailto']
                const protocol = parsedUrl.protocol.replace(':', '')
                if (disallowedProtocols.includes(protocol)) return false
                const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))
                if (!allowedProtocols.includes(protocol)) return false
                const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
                const domain = parsedUrl.hostname
                if (disallowedDomains.includes(domain)) return false
                return true
            } catch {
                return false
            }
        },
        shouldAutoLink: url => {
            try {
                const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)
                const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                const domain = parsedUrl.hostname
                return !disallowedDomains.includes(domain)
            } catch {
                return false
            }
        },
    }),
    Placeholder.configure({
        placeholder: 'Type a message',
        emptyEditorClass: 'is-editor-empty',
    }),
]

const content = ``

export default function Tiptap({ className = '', onEditorReady, onCtrlEnter, onUpdate }) {
    const { socket, authUser } = useContext(AuthContext)
    const { selectedUser } = useContext(ChatContext)

    const editor = useEditor({
        extensions,
        content,
        onCreate: ({ editor }) => onEditorReady?.(editor),
        editorProps: {
            handleKeyDown(view, event) {
                if (event.ctrlKey && event.key === 'Enter') {
                    event.preventDefault();
                    onCtrlEnter?.();
                    return true;
                }
                return false;
            }
        },
        onUpdate: () => {
            onUpdate && onUpdate(); // 💥 Call typing handler
        },

    })

    // Paste handler to insert image from clipboard
    const onPaste = useCallback((event) => {
        if (!editor) return

        const items = event.clipboardData?.items
        if (!items) return

        for (const item of items) {
            if (item.type.indexOf('image') === 0) {
                const file = item.getAsFile()
                if (!file) return

                const reader = new FileReader()
                reader.onload = readerEvent => {
                    const base64 = readerEvent.target?.result
                    if (typeof base64 === 'string') {
                        editor.chain().focus().setImage({ src: base64 }).run()
                    }
                }
                reader.readAsDataURL(file)
                event.preventDefault()
                break
            }
        }
    }, [editor])

    useEffect(() => {
        if (!editor) return
        const el = editor.view.dom

        el.addEventListener('paste', onPaste)

        return () => {
            el.removeEventListener('paste', onPaste)
        }
    }, [editor, onPaste])

    if (!editor) {
        return null
    }

    useEffect((e) => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }

    }, [editor, onEditorReady]);


    return (
        <div className="w-full min-h-[40px] py-[10px]">
            <EditorContent editor={editor} className={`${className} custom-editor`} />
        </div>
    )
}