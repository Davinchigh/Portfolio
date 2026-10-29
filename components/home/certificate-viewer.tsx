"use client"

import { useRef } from "react"
import { ArrowUpRight, Download, X } from "lucide-react"
import type { CertificateDoc } from "@/lib/site"

/** A thumbnail button that opens the full certificate in a modal dialog (Esc or the close button shuts it). */
export function CertificateViewer({ doc, issuer }: { doc: CertificateDoc; issuer: string }) {
  const dialog = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="group flex items-center gap-3 rounded-xl border bg-card p-1.5 pr-3 text-left text-sm text-muted-foreground transition-colors hover:border-amber/60 hover:text-foreground"
      >
        <img
          src={`${doc.image}-thumb.webp`}
          alt=""
          loading="lazy"
          className="h-11 w-16 rounded-lg bg-white object-cover object-top"
        />
        <span>
          view certificate<span className="sr-only">: {doc.label}</span>
        </span>
      </button>

      <dialog
        ref={dialog}
        aria-label={doc.label}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
        className="m-auto max-h-[92vh] w-[min(92vw,960px)] overflow-hidden rounded-2xl border bg-background p-0 text-foreground backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[92vh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b px-5 py-3">
            <p className="text-sm font-medium">{issuer}</p>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close certificate"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-accent"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div tabIndex={0} aria-label="Certificate image, scrollable" className="overflow-auto bg-white focus-visible:outline-offset-[-3px]">
            <img src={`${doc.image}.webp`} alt={doc.label} className="mx-auto block h-auto w-full max-w-[900px]" />
          </div>
          {(doc.pdf || doc.verify) && (
            <div className="flex flex-wrap gap-3 border-t px-5 py-3">
              {doc.pdf && (
                <a href={doc.pdf} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1.5 py-2 text-sm">
                  <Download className="h-4 w-4" aria-hidden="true" /> open the pdf
                </a>
              )}
              {doc.verify && (
                <a href={doc.verify} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1.5 py-2 text-sm">
                  verify it online <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>
          )}
        </div>
      </dialog>
    </>
  )
}
