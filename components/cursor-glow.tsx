"use client"

import { useEffect, useRef } from "react"

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update CSS variables for background glow
      const authContainers = document.querySelectorAll(".auth-container")
      authContainers.forEach((container) => {
        const rect = container.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        ;(container as HTMLElement).style.setProperty("--mouse-x", `${x}%`)
        ;(container as HTMLElement).style.setProperty("--mouse-y", `${y}%`)
      })

      // Update cursor glow position
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`
        glowRef.current.style.top = `${e.clientY}px`
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return <div ref={glowRef} className="cursor-glow" />
}
