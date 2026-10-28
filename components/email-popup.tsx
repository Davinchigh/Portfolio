"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Copy, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmailPopupProps {
  email: string
  isOpen: boolean
  onClose: () => void
}

export default function EmailPopup({ email, isOpen, onClose }: EmailPopupProps) {
  const [copied, setCopied] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={popupRef}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Email</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg flex items-center justify-between mb-4">
          <p className="text-slate-700 dark:text-slate-300 break-all mr-2">{email}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex-shrink-0 rounded-full"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" /> Copy
              </>
            )}
          </Button>
        </div>
        <div className="flex justify-end">
          <Button variant="default" onClick={onClose} className="rounded-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
