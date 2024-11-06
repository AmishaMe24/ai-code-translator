'use client'
import { useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

const languages = [
  'javascript',
  'python',
  'java',
  'cpp',
  'typescript',
  'ruby',
  'go',
  'rust'
]

export default function Home() {
  const [inputCode, setInputCode] = useState('')
  const [outputCode, setOutputCode] = useState('')
  const [inputLang, setInputLang] = useState('javascript')
  const [outputLang, setOutputLang] = useState('python')
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleTranslate = async () => {
    if (!inputCode.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: inputCode,
          fromLanguage: inputLang,
          toLanguage: outputLang,
        }),
      })
      
      const data = await response.json()
      setOutputCode(data.translatedCode)
    } catch (error) {
      console.error('Translation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-4 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold dark:text-white text-center">AI Code Translator</h1>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <select
              value={inputLang}
              onChange={(e) => setInputLang(e.target.value)}
              className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
            <Editor
              height="400px"
              language={inputLang}
              value={inputCode}
              onChange={(value) => setInputCode(value || '')}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{ minimap: { enabled: false } }}
            />
          </div>

          <div className="space-y-2">
            <select
              value={outputLang}
              onChange={(e) => setOutputLang(e.target.value)}
              className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
            <Editor
              height="400px"
              language={outputLang}
              value={outputCode}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{ readOnly: true, minimap: { enabled: false } }}
            />
          </div>
        </div>

        <button
          onClick={handleTranslate}
          disabled={isLoading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </main>
  )
}